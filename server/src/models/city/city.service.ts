import prisma from "@/lib/prisma"
import { ICity } from "./city.interface";

interface CRUD {
    title: string;
    short_name: string;
}

async function get_all_city(): Promise<ICity[]> {
    const city = await prisma.city.findMany()
    return city
}

async function create_city(data: CRUD): Promise<ICity> {
    const city = await prisma.city.create({
        data: data
    })
    return city;
}

async function update_city(id: string, data: CRUD): Promise<ICity> {
    const city = await prisma.city.update({
        where: {
            id: id
        },
        data: data
    })
    return city;
}

async function delete_city(id: string): Promise<ICity> {
    const city = await prisma.city.delete({
        where: {
            id: id
        }
    })
    return city;
}

async function get_by_short_name_city(short_name: string) {
    const city = await prisma.city.findFirst({
        where: {
            short_name: short_name
        },
        include: {
            locations: true
        }
    })
    return city;
}

export default {
    get_all_city,
    create_city,
    update_city,
    delete_city,
    get_by_short_name_city
}