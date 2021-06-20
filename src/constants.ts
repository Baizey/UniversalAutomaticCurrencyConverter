const v4Api = `/api/v4`

export const Routes = {
    health: '/health',
    symbols: `${v4Api}/symbols`,
    rate: `${v4Api}/rate/:from/:to`,
}

export const HttpStatus = {
    ok: 200,
    okNoResult: 204,
    badInput: 400,
    notAuthorized: 401,
    notFound: 404,
    error: 500,
}