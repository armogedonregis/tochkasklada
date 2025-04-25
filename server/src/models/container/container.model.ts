import { Containers, Location, Cells } from "@prisma/client"

function container_view(container: Containers & { location?: Location, cells?: Cells[] }) {
    const view = {
        id: container.id,
        locId: container.locId,
        location: container.location,
        cells: container.cells,
        createdAt: container.createdAt,
        updatedAt: container.updatedAt,
    }
    return view
}

export default {
    container_view
} 