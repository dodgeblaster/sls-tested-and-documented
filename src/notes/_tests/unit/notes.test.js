const notes = require('../../index')
const dynamodb = require('aws-sdk/clients/dynamodb')

describe('notes endpoint', () => {
    let putSpy
    let removeSpy
    let getSpy
    beforeAll(() => {
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put')
        removeSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'delete')
        getSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'get')
    })

    afterAll(() => {
        putSpy.mockRestore()
    })

    /**
     * Note Create
     * Validate that it has a title
     */
    test('create will validate title', async () => {
        const result = await notes.handler({
            httpMethod: 'POST',
            path: 'something/notes/create',
            body: JSON.stringify({}),
            requestContext: {
                authorizer: {
                    claims: { email: 'example' }
                }
            }
        })

        expect(result).toEqual({
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: '{"message":"Must have a title"}'
        })
    })

    /**
     * Note Create
     * Confirm the happy path
     */
    test('can create a note', async () => {
        const returnedItem = { id: 'id_1234', title: 'note title' }

        putSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem)
        })

        const result = await notes.handler({
            httpMethod: 'POST',
            path: 'something/notes/create',
            body: JSON.stringify({
                title: 'note title'
            }),
            requestContext: {
                authorizer: {
                    claims: { email: 'example' }
                }
            }
        })

        expect(result.statusCode).toEqual(200)
        expect(result.headers).toEqual({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
            'Access-Control-Allow-Headers': 'Content-Type'
        })
        expect(JSON.parse(result.body).id.startsWith('note_')).toBeTruthy()
        expect(JSON.parse(result.body).title).toEqual('note title')
    })

    /**
     * Note Remove
     * Validate that it has a title
     */
    test('remove will validate id input', async () => {
        const result = await notes.handler({
            httpMethod: 'POST',
            path: 'something/notes/remove',
            body: JSON.stringify({}),
            requestContext: {
                authorizer: {
                    claims: { email: 'example' }
                }
            }
        })

        expect(result).toEqual({
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: '{"message":"Must have an id"}'
        })
    })

    /**
     * Note Remove
     * Confirm the happy path
     */
    test('remove will correctly remove item', async () => {
        const returnedItem = {
            Attributes: {
                SK: 'id_1234',
                title: 'note title'
            }
        }

        removeSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem)
        })

        const result = await notes.handler({
            httpMethod: 'POST',
            path: 'something/notes/remove',
            body: JSON.stringify({
                id: 'id_1234'
            }),
            requestContext: {
                authorizer: {
                    claims: { email: 'example' }
                }
            }
        })

        expect(result).toEqual({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: '{"id":"id_1234","title":"note title"}'
        })
    })

    /**
     * Note Get
     * Confirm the happy path
     */
    test('get will correctly get item', async () => {
        const returnedItem = {
            Item: {
                PK: 'example',
                SK: 'id_1234',
                title: 'note title'
            }
        }

        getSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem)
        })

        const result = await notes.handler({
            httpMethod: 'GET',
            path: 'something/notes/?note=id_1234',
            queryStringParameters: {
                note: 'id_1234'
            },
            requestContext: {
                authorizer: {
                    claims: { email: 'example' }
                }
            }
        })

        expect(result).toEqual({
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: '{"id":"id_1234","title":"note title"}'
        })
    })

    /**
     * Note Get
     * Confirm Item not found
     */
    test('get will correctly return item not found', async () => {
        const returnedItem = {}

        getSpy.mockReturnValue({
            promise: () => Promise.resolve(returnedItem)
        })

        const result = await notes.handler({
            httpMethod: 'GET',
            path: 'something/notes/?note=id_1234',
            queryStringParameters: {
                note: 'id_1234'
            },
            requestContext: {
                authorizer: {
                    claims: { email: 'example' }
                }
            }
        })

        expect(result).toEqual({
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            body: '{"message":"Not Found"}'
        })
    })
})
