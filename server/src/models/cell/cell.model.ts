import { Cells, Containers, SizeCells } from "@prisma/client"

function cell_view(cell: Cells & { container?: Containers, size?: SizeCells }) {
    const view = {
        id: cell.id,
        size_id: cell.size_id,
        name: cell.name,
        len_height: cell.len_height,
        containerId: cell.containerId,
        container: cell.container,
        size: cell.size,
        createdAt: cell.createdAt,
        updatedAt: cell.updatedAt,
    }
    return view
}

export default {
    cell_view
} 