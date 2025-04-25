import { Request, Response } from 'hyper-express'
import { res_type, response } from '@/utils/response'
import cityService from './city.service';
import cityModel from './city.model';

interface CRUD {
    title: string;
    short_name: string;
}

async function create_city(req: Request, res: Response) {
    const data: CRUD = req.body;
    try {
        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const created_city = await cityService.create_city(data);

        if(!created_city) {
            return response(res, res_type.bad_request, { error: "failed to create city" })
        }

        return response(res, res_type.created, cityModel.city_view(created_city))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}


async function update_city(req: Request, res: Response) {
    const data: CRUD = req.body;
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const updated_city = await cityService.update_city(id, data);

        if(!updated_city) {
            return response(res, res_type.bad_request, { error: "failed to update city" })
        }

        return response(res, res_type.ok, cityModel.city_view(updated_city))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}


async function delete_city(req: Request, res: Response) {
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        const deleted_city = await cityService.delete_city(id);

        if(!deleted_city) {
            return response(res, res_type.bad_request, { error: "failed to delete city" })
        }

        return response(res, res_type.ok, { success: true })

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_all_city(req: Request, res: Response) {
    try {

        const all_city = await cityService.get_all_city();

        const city_view = all_city.map(item => cityModel.city_view(item))

        return response(res, res_type.ok, city_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}


async function get_city_by_short_name(req: Request, res: Response) {
    const { short_name } = req.params;
    try {

        const city_short_name = await cityService.get_by_short_name_city(short_name);

        if(!city_short_name) {
            return response(res, res_type.bad_request, { error: "failed search short name" })
        }

        return response(res, res_type.ok, cityModel.city_view(city_short_name))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

export default {
    create_city,
    update_city,
    delete_city,
    get_all_city,
    get_city_by_short_name
}