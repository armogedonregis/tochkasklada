import { City, Location } from "@prisma/client"


function city_view(city: City & { location?: Location[] }) {
    const view = {
        id: city.id,
        title: city.title,
        short_name: city.short_name,
        location: city.location,
        createdAt: city.createdAt,
        updatedAt: city.updatedAt,
    }
    return view
}

export default {
    city_view
}