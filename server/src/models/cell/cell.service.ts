import prisma from "@/lib/prisma"
import { ICell } from "./cell.interface";

interface CRUD {
    size_id: string;
    name: string;
    len_height?: string;
    containerId: number;
}

async function get_all_cells(): Promise<ICell[]> {
    const cells = await prisma.cells.findMany({
        include: {
            container: true,
            size: true
        }
    })
    return cells
}

async function create_cell(data: CRUD): Promise<ICell> {
    const cell = await prisma.cells.create({
        data: data
    })
    return cell;
}

async function update_cell(id: string, data: CRUD): Promise<ICell> {
    const cell = await prisma.cells.update({
        where: {
            id: id
        },
        data: data
    })
    return cell;
}

async function delete_cell(id: string): Promise<ICell> {
    const cell = await prisma.cells.delete({
        where: {
            id: id
        }
    })
    return cell;
}

async function get_cell_by_id(id: string) {
    const cell = await prisma.cells.findUnique({
        where: {
            id: id
        },
        include: {
            container: true,
            size: true
        }
    })
    return cell;
}

async function get_cells_by_container(containerId: number) {
    const cells = await prisma.cells.findMany({
        where: {
            containerId: containerId
        },
        include: {
            size: true
        }
    })
    return cells;
}

async function get_cells_by_size(size_id: string) {
    const cells = await prisma.cells.findMany({
        where: {
            size_id: size_id
        },
        include: {
            container: true
        }
    })
    return cells;
}

export default {
    get_all_cells,
    create_cell,
    update_cell,
    delete_cell,
    get_cell_by_id,
    get_cells_by_container,
    get_cells_by_size
} 