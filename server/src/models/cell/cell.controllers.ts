import { Request, Response } from 'hyper-express'
import { res_type, response } from '@/utils/response'
import cellService from './cell.service';
import cellModel from './cell.model';

interface CRUD {
    size_id: string;
    name: string;
    len_height?: string;
    containerId: number;
}

async function create_cell(req: Request, res: Response) {
    const data: CRUD = req.body;
    try {
        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const created_cell = await cellService.create_cell(data);

        if(!created_cell) {
            return response(res, res_type.bad_request, { error: "failed to create cell" })
        }

        return response(res, res_type.created, cellModel.cell_view(created_cell))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function update_cell(req: Request, res: Response) {
    const data: CRUD = req.body;
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const updated_cell = await cellService.update_cell(id, data);

        if(!updated_cell) {
            return response(res, res_type.bad_request, { error: "failed to update cell" })
        }

        return response(res, res_type.ok, cellModel.cell_view(updated_cell))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function delete_cell(req: Request, res: Response) {
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        const deleted_cell = await cellService.delete_cell(id);

        if(!deleted_cell) {
            return response(res, res_type.bad_request, { error: "failed to delete cell" })
        }

        return response(res, res_type.ok, { success: true })

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_all_cells(req: Request, res: Response) {
    try {
        const all_cells = await cellService.get_all_cells();

        const cells_view = all_cells.map(item => cellModel.cell_view(item))

        return response(res, res_type.ok, cells_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_cell_by_id(req: Request, res: Response) {
    const { id } = req.params;
    try {

        const cell = await cellService.get_cell_by_id(id);

        if(!cell) {
            return response(res, res_type.bad_request, { error: "cell not found" })
        }

        return response(res, res_type.ok, cellModel.cell_view(cell))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_cells_by_container(req: Request, res: Response) {
    const { containerId } = req.params;
    try {

        const cells = await cellService.get_cells_by_container(Number(containerId));

        if(!cells || cells.length === 0) {
            return response(res, res_type.bad_request, { error: "no cells found for this container" })
        }

        const cells_view = cells.map(item => cellModel.cell_view(item))

        return response(res, res_type.ok, cells_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_cells_by_size(req: Request, res: Response) {
    const { size_id } = req.params;
    try {

        const cells = await cellService.get_cells_by_size(size_id);

        if(!cells || cells.length === 0) {
            return response(res, res_type.bad_request, { error: "no cells found for this size" })
        }

        const cells_view = cells.map(item => cellModel.cell_view(item))

        return response(res, res_type.ok, cells_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

export default {
    create_cell,
    update_cell,
    delete_cell,
    get_all_cells,
    get_cell_by_id,
    get_cells_by_container,
    get_cells_by_size
} 