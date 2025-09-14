// base-crud.service.ts
import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '@/infrastructure/prisma/prisma.service';
import { LoggerService } from '@/infrastructure/logger/logger.service';
import { Prisma } from '@prisma/client';

export interface PaginationMeta {
    totalCount: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

export interface FindOptions<WhereInput, OrderBy, SortField> {
    search?: string;
    page?: number;
    limit?: number;
    sortBy?: SortField;
    sortDirection?: 'asc' | 'desc';
    where?: WhereInput;
    include?: any;
}

export interface BaseCrudService<
    Entity,
    CreateDto,
    UpdateDto,
    WhereInput,
    OrderBy,
    SortField extends string
> {
    findMany(
        options: FindOptions<WhereInput, OrderBy, SortField>,
        currentUser?: { id: string; role: string }
    ): Promise<PaginatedResponse<Entity>>;

    findOne(id: string): Promise<Entity>;
    create(createDto: CreateDto): Promise<Entity>;
    update(id: string, updateDto: UpdateDto): Promise<Entity>;
    remove(id: string): Promise<{ id: string }>;
}

@Injectable()
export abstract class BaseCrudService<
    Entity,
    CreateDto,
    UpdateDto,
    WhereInput extends Record<string, any> = any,
    OrderBy = any,
    SortField extends string = string
> implements BaseCrudService<Entity, CreateDto, UpdateDto, WhereInput, OrderBy, SortField> {

    protected abstract readonly modelName: Prisma.ModelName;
    protected abstract readonly searchFields: (keyof WhereInput)[];
    protected abstract readonly relationSearchFields?: {
        model: Prisma.ModelName;
        fields: string[];
        relationField: string;
    }[];

    constructor(
        protected readonly prisma: PrismaService,
        protected readonly logger: LoggerService,
    ) { }

    protected abstract buildWhereCondition(
        search: string,
        currentUser?: { id: string; role: string }
    ): Promise<WhereInput>;

    protected abstract buildOrderBy(
        sortBy: SortField,
        sortDirection: 'asc' | 'desc'
    ): OrderBy;

    protected abstract applyAccessControl(
        where: WhereInput,
        currentUser?: { id: string; role: string }
    ): Promise<WhereInput>;

    async findMany(
        options: FindOptions<WhereInput, OrderBy, SortField>,
        currentUser?: { id: string; role: string }
    ): Promise<PaginatedResponse<Entity>> {
        const {
            search,
            page = 1,
            limit = 10,
            sortBy,
            sortDirection = 'desc',
            where: additionalWhere,
            include,
        } = options;

        try {
            let where: WhereInput = additionalWhere || ({} as WhereInput);

            // Apply search conditions
            if (search) {
                const searchWhere = await this.buildWhereCondition(search, currentUser);
                where = this.mergeWhereConditions(where, searchWhere);
            }

            // Apply access control
            where = await this.applyAccessControl(where, currentUser);

            // Build orderBy
            const orderBy = sortBy ? this.buildOrderBy(sortBy, sortDirection) : undefined;

            // Calculate pagination
            const skip = (page - 1) * limit;

            // Get total count
            const totalCount = await this.getTotalCount(where);

            // If no results, return empty
            if (totalCount === 0) {
                return {
                    data: [],
                    meta: { totalCount, page, limit, totalPages: 0 },
                };
            }

            // Get data
            const data = await this.getData(where, skip, limit, orderBy, include);

            // Calculate total pages
            const totalPages = Math.ceil(totalCount / limit);

            return {
                data,
                meta: { totalCount, page, limit, totalPages },
            };
        } catch (error) {
            this.logger.error(
                `Failed to find ${this.modelName}: ${error.message}`,
                error.stack,
                this.constructor.name
            );
            throw new InternalServerErrorException(`Ошибка при поиске ${this.modelName}`);
        }
    }

    protected mergeWhereConditions(
        baseWhere: WhereInput,
        additionalWhere: WhereInput
    ): WhereInput {
        if (Object.keys(baseWhere).length === 0) {
            return additionalWhere;
        }

        return {
            AND: [baseWhere, additionalWhere],
        };
    }

    protected async getTotalCount(where: WhereInput): Promise<number> {
        return this.prisma[this.modelName.toLowerCase()].count({ where });
    }

    protected async getData(
        where: WhereInput,
        skip: number,
        take: number,
        orderBy?: OrderBy,
        include?: any
    ): Promise<Entity[]> {
        return this.prisma[this.modelName.toLowerCase()].findMany({
            where,
            skip,
            take,
            orderBy,
            include,
        });
    }

    async findOne(id: string): Promise<Entity> {
        try {
            const entity = await this.prisma[this.modelName.toLowerCase()].findUnique({
                where: { id },
            });

            if (!entity) {
                throw new NotFoundException(`${this.modelName} с ID ${id} не найден`);
            }

            return entity;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to find ${this.modelName}: ${error.message}`,
                error.stack,
                this.constructor.name
            );
            throw new InternalServerErrorException(`Ошибка при поиске ${this.modelName}`);
        }
    }

    async create(createDto: CreateDto): Promise<Entity> {
        try {
            const entity = await this.prisma[this.modelName.toLowerCase()].create({
                data: createDto,
            });

            this.logger.log(
                `${this.modelName} created with id: ${entity.id}`,
                this.constructor.name
            );

            return entity;
        } catch (error) {
            this.logger.error(
                `Failed to create ${this.modelName}: ${error.message}`,
                error.stack,
                this.constructor.name
            );
            throw new InternalServerErrorException(`Ошибка при создании ${this.modelName}`);
        }
    }

    async update(id: string, updateDto: UpdateDto): Promise<Entity> {
        try {
            await this.findOne(id); // Check if exists

            const entity = await this.prisma[this.modelName].update({
                where: { id },
                data: updateDto,
            });

            this.logger.log(
                `${this.modelName} with id ${id} updated successfully`,
                this.constructor.name
            );

            return entity;
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to update ${this.modelName}: ${error.message}`,
                error.stack,
                this.constructor.name
            );
            throw new InternalServerErrorException(`Ошибка при обновлении ${this.modelName}`);
        }
    }

    async remove(id: string): Promise<{ id: string }> {
        try {
            await this.findOne(id); // Check if exists

            await this.prisma[this.modelName.toLowerCase()].delete({
                where: { id },
            });

            this.logger.log(
                `${this.modelName} with id ${id} removed successfully`,
                this.constructor.name
            );

            return { id };
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw error;
            }
            this.logger.error(
                `Failed to remove ${this.modelName}: ${error.message}`,
                error.stack,
                this.constructor.name
            );
            throw new InternalServerErrorException(`Ошибка при удалении ${this.modelName}`);
        }
    }
}