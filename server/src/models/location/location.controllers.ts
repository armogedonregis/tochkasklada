import { Request, Response } from 'hyper-express'
import { res_type, response } from '@/utils/response'
import locationService from './location.service';
import locationModel from './location.model';

interface CRUD {
    name: string;
    short_name: string;
    address: string;
    cityId: string;
}

async function create_location(req: Request, res: Response) {
    const data: CRUD = req.body;
    try {
        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const created_location = await locationService.create_location(data);

        if(!created_location) {
            return response(res, res_type.bad_request, { error: "failed to create location" })
        }

        return response(res, res_type.created, locationModel.location_view(created_location))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function update_location(req: Request, res: Response) {
    const data: CRUD = req.body;
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const updated_location = await locationService.update_location(id, data);

        if(!updated_location) {
            return response(res, res_type.bad_request, { error: "failed to update location" })
        }

        return response(res, res_type.ok, locationModel.location_view(updated_location))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function delete_location(req: Request, res: Response) {
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        const deleted_location = await locationService.delete_location(id);

        if(!deleted_location) {
            return response(res, res_type.bad_request, { error: "failed to delete location" })
        }

        return response(res, res_type.ok, { success: true })

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_all_locations(req: Request, res: Response) {
    try {
        const all_locations = await locationService.get_all_locations();

        const locations_view = all_locations.map(item => locationModel.location_view(item))

        return response(res, res_type.ok, locations_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_location_by_short_name(req: Request, res: Response) {
    const { short_name } = req.params;
    try {

        const location_short_name = await locationService.get_by_short_name_location(short_name);

        if(!location_short_name) {
            return response(res, res_type.bad_request, { error: "failed search short name" })
        }

        return response(res, res_type.ok, locationModel.location_view(location_short_name))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_locations_by_city(req: Request, res: Response) {
    const { cityId } = req.params;
    try {

        const locations = await locationService.get_locations_by_city(cityId);

        if(!locations || locations.length === 0) {
            return response(res, res_type.bad_request, { error: "no locations found for this city" })
        }

        const locations_view = locations.map(item => locationModel.location_view(item))

        return response(res, res_type.ok, locations_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

export default {
    create_location,
    update_location,
    delete_location,
    get_all_locations,
    get_location_by_short_name,
    get_locations_by_city
} 