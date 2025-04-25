import { Location, City, Containers } from "@prisma/client"

function location_view(location: Location & { city?: City, containers?: Containers[] }) {
    const view = {
        id: location.id,
        name: location.name,
        short_name: location.short_name,
        address: location.address,
        city: location.city,
        containers: location.containers,
        createdAt: location.createdAt,
        updatedAt: location.updatedAt,
    }
    return view
}

export default {
    location_view
} 