import prisma from "@/lib/prisma"
import { ILocation } from "./location.interface";

interface CRUD {
    name: string;
    short_name: string;
    address: string;
    cityId: string;
}

async function get_all_locations(): Promise<ILocation[]> {
    const locations = await prisma.location.findMany({
        include: {
            city: true,
        }
    })
    return locations
}

async function create_location(data: CRUD): Promise<ILocation> {
    const location = await prisma.location.create({
        data: data
    })
    return location;
}

async function update_location(id: string, data: CRUD): Promise<ILocation> {
    const location = await prisma.location.update({
        where: {
            id: id
        },
        data: data
    })
    return location;
}

async function delete_location(id: string): Promise<ILocation> {
    const location = await prisma.location.delete({
        where: {
            id: id
        }
    })
    return location;
}

async function get_by_short_name_location(short_name: string) {
    const location = await prisma.location.findFirst({
        where: {
            short_name: short_name
        },
        include: {
            city: true,
            containers: true
        }
    })
    return location;
}

async function get_locations_by_city(cityId: string) {
    const locations = await prisma.location.findMany({
        where: {
            cityId: cityId
        },
        include: {
            containers: true
        }
    })
    return locations;
}

export default {
    get_all_locations,
    create_location,
    update_location,
    delete_location,
    get_by_short_name_location,
    get_locations_by_city
} 