import { Request, Response } from 'hyper-express'
import { res_type, response } from '@/utils/response'
import containerService from './container.service';
import containerModel from './container.model';

interface CRUD {
    id?: number;
    locId: string;
}

async function create_container(req: Request, res: Response) {
    const data: CRUD = req.body;
    try {
        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const created_container = await containerService.create_container(data);

        if(!created_container) {
            return response(res, res_type.bad_request, { error: "failed to create container" })
        }

        return response(res, res_type.created, containerModel.container_view(created_container))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function update_container(req: Request, res: Response) {
    const data: CRUD = req.body;
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        if(!data) {
            return response(res, res_type.bad_request, { error: "all fields is required" })
        }

        const updated_container = await containerService.update_container(Number(id), data);

        if(!updated_container) {
            return response(res, res_type.bad_request, { error: "failed to update container" })
        }

        return response(res, res_type.ok, containerModel.container_view(updated_container))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function delete_container(req: Request, res: Response) {
    const { id } = req.params;
    try {

        if(!id) {
            return response(res, res_type.bad_request, { error: "id is required" })
        }

        const deleted_container = await containerService.delete_container(Number(id));

        if(!deleted_container) {
            return response(res, res_type.bad_request, { error: "failed to delete container" })
        }

        return response(res, res_type.ok, { success: true })

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_all_containers(req: Request, res: Response) {
    try {
        const all_containers = await containerService.get_all_containers();

        const containers_view = all_containers.map(item => containerModel.container_view(item))

        return response(res, res_type.ok, containers_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_container_by_id(req: Request, res: Response) {
    const { id } = req.params;
    try {

        const container = await containerService.get_container_by_id(Number(id));

        if(!container) {
            return response(res, res_type.bad_request, { error: "container not found" })
        }

        return response(res, res_type.ok, containerModel.container_view(container))

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

async function get_containers_by_location(req: Request, res: Response) {
    const { locId } = req.params;
    try {

        const containers = await containerService.get_containers_by_location(locId);

        if(!containers || containers.length === 0) {
            return response(res, res_type.bad_request, { error: "no containers found for this location" })
        }

        const containers_view = containers.map(item => containerModel.container_view(item))

        return response(res, res_type.ok, containers_view)

    } catch (error: any) {
        return response(res, res_type.server_error, { error })
    }
}

export default {
    create_container,
    update_container,
    delete_container,
    get_all_containers,
    get_container_by_id,
    get_containers_by_location
} 