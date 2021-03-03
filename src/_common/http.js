module.exports = {
    success: (x) => ({
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify(x)
    }),

    validationError: (x) => ({
        statusCode: 400,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            message: x.message
        })
    }),

    error: (e) => ({
        statusCode: 500,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        },
        body: JSON.stringify({
            message: e.message
        })
    })
}
