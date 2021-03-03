const { hook } = require('../../../_common/codeDeploy/index')
const test = require('./notes-integration-test')

const postHookTest = async () => {
    try {
        await test()
        return {
            success: true
        }
    } catch (e) {
        console.log('The Post Hook Error: ', e)
        return {
            success: false
        }
    }
}

module.exports.handler = hook(postHookTest)
