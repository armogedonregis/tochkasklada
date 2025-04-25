import prisma from "@/lib/prisma"
import { ISize } from "./size.interface";

interface CRUD {
    name: string;
    size: string;
    area: string;
}

async function get_all_sizes(): Promise<ISize[]> {
    const sizes = await prisma.sizeCells.findMany()
    return sizes
}

async function create_size(data: CRUD): Promise<ISize> {
    const size = await prisma.sizeCells.create({
        data: data
    })
    return size;
}

async function update_size(id: string, data: CRUD): Promise<ISize> {
    const size = await prisma.sizeCells.update({
        where: {
            id: id
        },
        data: data
    })
    return size;
}

async function delete_size(id: string): Promise<ISize> {
    const size = await prisma.sizeCells.delete({
        where: {
            id: id
        }
    })
    return size;
}

async function get_size_by_id(id: string) {
    const size = await prisma.sizeCells.findUnique({
        where: {
            id: id
        }
    })
    return size;
}

export default {
    get_all_sizes,
    create_size,
    update_size,
    delete_size,
    get_size_by_id
} 