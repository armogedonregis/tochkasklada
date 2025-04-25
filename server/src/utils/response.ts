import { Response } from 'hyper-express'

interface ResponseData {
    status: string
    message: string
    data: any
}

// https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
export enum res_type
{
    ok = 200,
    created = 201,
    bad_request = 400,
    unauthorized = 401,
    payment_required = 402,
    forbidden = 403,
    not_found = 404,
    method_not_allowed = 405,
    server_error = 500,
    not_implemented = 501
}

const response = <T extends object>(res: Response, status: res_type | number, data: T): Response =>
{
    return res
        .status(status)
        .header('Connection', 'keep-alive')
        .header('Keep-Alive', 'timeout=20')
        .header('Content-Type', 'application/json')
        .send(JSON.stringify(data))
}

const OkResponse = (res: Response, data: any): Response =>
{
   return res
       .status(200)
       .header('Connection', 'keep-alive')
       .header('Keep-Alive', 'timeout=20')
       .header('Content-Type', 'application/json')
       .send(
           JSON.stringify({
               status: 'Success',
               message: 'Success',
               data,
           } as ResponseData),
       )
       .end()
};

const NotFoundResponse = (res: Response, message: any): Response =>
{
   return res
       .status(404)
       .header('Connection', 'keep-alive')
       .header('Keep-Alive', 'timeout=5')
       .header('Content-Type', 'application/json; charset=utf-8')
       .header('Test', 'test')
       .send(
           JSON.stringify({
               status: 'Not Found',
               message,
           } as ResponseData),
       )
       .end()
};

const CreatedResponse = (res: Response, data: any): Response =>
{
   return res
       .status(201)
       .header('Connection', 'keep-alive')
       .header('Keep-Alive', 'timeout=5')
       .header('Content-Type', 'application/json; charset=utf-8')
       .send(
           JSON.stringify({
               status: 'Success',
               message: 'Success',
               data,
           } as ResponseData),
       )
       .end()
};

const BadRequestResponse = (res: Response, status: number, message: any): Response =>
{
   return res
       .status(status)
       .header('Connection', 'keep-alive')
       .header('Keep-Alive', 'timeout=5')
       .header('Content-Type', 'application/json; charset=utf-8')
       .send(
           JSON.stringify({
               status: 'Bad Request',
               message,
           } as ResponseData),
       )
       .end()
}

export
{
    response,
    OkResponse,
    NotFoundResponse,
    CreatedResponse,
    BadRequestResponse
}