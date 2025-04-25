import prisma from "@/lib/prisma"
import { IContainer } from "./container.interface";

interface CRUD {
    id?: number;
    locId: string;
}

async function get_all_containers(): Promise<IContainer[]> {
    const containers = await prisma.containers.findMany({
        include: {
            location: true
        }
    })
    return containers
}

async function create_container(data: CRUD): Promise<IContainer> {
    const container = await prisma.containers.create({
        data: data
    })
    return container;
}

async function update_container(id: number, data: CRUD): Promise<IContainer> {
    const container = await prisma.containers.update({
        where: {
            id: id
        },
        data: data
    })
    return container;
}

async function delete_container(id: number): Promise<IContainer> {
    const container = await prisma.containers.delete({
        where: {
            id: id
        }
    })
    return container;
}

async function get_container_by_id(id: number) {
    const container = await prisma.containers.findUnique({
        where: {
            id: id
        },
        include: {
            location: true,
            cells: true
        }
    })
    return container;
}

async function get_containers_by_location(locId: string) {
    const containers = await prisma.containers.findMany({
        where: {
            locId: locId
        },
        include: {
            cells: true
        }
    })
    return containers;
}

export default {
    get_all_containers,
    create_container,
    update_container,
    delete_container,
    get_container_by_id,
    get_containers_by_location
} 