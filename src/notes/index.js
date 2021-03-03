const http = require('../_common/http')
const getRoute = require('../_common/route')

/**
 * @typedef Message
 * @property {string} message
 */

/**
 * Returns a default message
 * @return {HttpResponse<Message>}
 */
function getNote() {
    return http.success({ message: 'ok' })
}

/**
 * Returns a default message
 * @return {HttpResponse<Message>}
 */
function listNotes() {
    return http.success({ message: 'ok' })
}

module.exports.handler = async (event) => {
    const route = getRoute(event)
    if (route === 'GET myNote') return getNote()
    if (route === 'GET list') return listNotes()
    return http.validationError({ message: 'Invalid Endpoint' })
}
