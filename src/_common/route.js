/**
 * TODO:
 * Need to add tests and handle edge cases such as
 * - empty path
 * - path + id
 * - path + query string
 */
function route(event) {
    const VERB = event.httpMethod
    const ACTION = event.path.split('/')[2]
    return `${VERB} ${ACTION}`
}

module.exports = route
