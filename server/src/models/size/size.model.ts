import { SizeCells, Cells } from "@prisma/client"

function size_view(size: SizeCells) {
    const view = {
        id: size.id,
        name: size.name,
        size: size.size,
        area: size.area,
        createdAt: size.createdAt,
        updatedAt: size.updatedAt,
    }
    return view
}

export default {
    size_view
} 