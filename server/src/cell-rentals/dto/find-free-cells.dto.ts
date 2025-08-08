import { IsOptional, IsInt, Min, IsString, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export enum CellFreeSortField {
    NAME = 'name',
    SIZE = 'size',
    LOCATION = 'location',
    CITY = 'city',
}

export enum SortDirection {
    ASC = 'asc',
    DESC = 'desc'
}

export class FindFreeCellRentalsDto {
    @IsOptional()
    @IsString()
    search?: string;

    // Фильтр по локации
    @IsOptional()
    @IsString()
    locationId?: string;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number;

    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    limit?: number;

    @IsOptional()
    @IsEnum(CellFreeSortField)
    sortBy?: CellFreeSortField;

    @IsOptional()
    @IsEnum(SortDirection)
    sortDirection?: SortDirection;
} 