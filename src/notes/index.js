const http = require('../_common/http')
const { v4: uuid } = require('uuid')
const AWS = require('aws-sdk')
const table = process.env.TABLE
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-1'
})

/**
 * @typedef Note
 * @property {string} id
 * @property {string} title
 */

/**
 * Gets a users note based on their cognito JWT and query param
 * Example: https://url.com/notes/?note=note_123
 * @param {APIGatewayEvent} event
 * @return {HttpResponse<Note>}
 */
async function getNote(event) {
    const email = event.requestContext.authorizer.claims.email
    const qRarams = event.queryStringParameters

    const params = {
        TableName: table,
        Key: {
            PK: email,
            SK: qRarams.note
        }
    }
    const result = await dynamoDb.get(params).promise()
    if (!result.Item) {
        return http.validationError({ message: 'Not Found' })
    }
    return http.success({
        id: result.Item.SK,
        title: result.Item.title
    })
}

/**
 * Returns a placeholder default message
 * @param {APIGatewayEvent} event
 * @return {HttpResponse<Message>}
 */
function listNotes() {
    return http.success({ message: 'ok' })
}

/**
 * Creates a note based on the email from the logged in users JWT,
 * and the data.title given as the body of the post
 * @param {APIGatewayEvent} event
 * @return {HttpResponse<Note>}
 */
async function createNote(event) {
    const email = event.requestContext.authorizer.claims.email
    const data = JSON.parse(event.body)
    const id = 'note_' + uuid()
    const params = {
        TableName: table,
        Item: {
            PK: email,
            SK: id,
            title: data.title
        }
    }
    await dynamoDb.put(params).promise()
    return http.success({
        id,
        title: data.title
    })
}

/**
 * Removes a note based on the email from the loged in users JWT,
 * and the data.id given as the body of the post
 * @param {APIGatewayEvent} event
 * @return {HttpResponse<Note>}
 */
async function removeNote(event) {
    const data = JSON.parse(event.body)
    const email = event.requestContext.authorizer.claims.email
    const params = {
        TableName: table,
        Key: {
            PK: email,
            SK: data.id
        },
        ReturnValues: 'ALL_OLD'
    }
    const result = await dynamoDb.delete(params).promise()
    return http.success({
        id: data.id,
        title: result.Attributes.title
    })
}

/**
 * This module handles the following endpoints:
 * - GET /list
 * - GET /?note=note_123
 * - POST  /create
 * - POST /remove
 * @param {APIGatewayEvent} event
 * @return {HttpResponse}
 */
async function router(event) {
    try {
        const VERB = event.httpMethod
        const ACTION = event.path.split('/')[2]

        if (VERB === 'GET' && ACTION === 'list') {
            return listNotes()
        }

        if (VERB === 'GET') {
            return getNote(event)
        }

        if (VERB === 'POST' && ACTION === 'create') {
            return createNote(event)
        }

        if (VERB === 'POST' && ACTION === 'remove') {
            return removeNote(event)
        }

        return http.validationError({ message: 'Invalid Endpoint' })
    } catch (e) {
        return http.error({ message: e.message })
    }
}

module.exports.handler = router
