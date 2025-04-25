import { Request, Response } from 'hyper-express'
import { res_type, response } from '@/utils/response'
import sizeService from './size.service';
import sizeModel from './size.model';

interface CRUD {
    name: string;
    size: string;
    area: string;
}

async function create_size(req: Request, res: Response) {
    const data: CRUD = req.body;
    try {
        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const created_size = await sizeService.create_size(data);

        if(!created_size) {
            return response(res, res_type.bad_request, { error: "failed to create size" })
        }

        return response(res, res_type.created, sizeModel.size_view(created_size))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function update_size(req: Request, res: Response) {
    const data: CRUD = req.body;
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const updated_size = await sizeService.update_size(id, data);

        if(!updated_size) {
            return response(res, res_type.bad_request, { error: "failed to update size" })
        }

        return response(res, res_type.ok, sizeModel.size_view(updated_size))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function delete_size(req: Request, res: Response) {
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        const deleted_size = await sizeService.delete_size(id);

        if(!deleted_size) {
            return response(res, res_type.bad_request, { error: "failed to delete size" })
        }

        return response(res, res_type.ok, { success: true })

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_all_sizes(req: Request, res: Response) {
    try {
        const all_sizes = await sizeService.get_all_sizes();

        const sizes_view = all_sizes.map(item => sizeModel.size_view(item))

        return response(res, res_type.ok, sizes_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_size_by_id(req: Request, res: Response) {
    const { id } = req.params;
    try {

        const size = await sizeService.get_size_by_id(id);

        if(!size) {
            return response(res, res_type.bad_request, { error: "size not found" })
        }

        return response(res, res_type.ok, sizeModel.size_view(size))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

export default {
    create_size,
    update_size,
    delete_size,
    get_all_sizes,
    get_size_by_id
} 