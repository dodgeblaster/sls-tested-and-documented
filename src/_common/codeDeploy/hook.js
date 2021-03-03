const AWS = require('aws-sdk')
const codeDeploy = new AWS.CodeDeploy({ apiVersion: '2014-10-06' })

/**
 * Get Input
 *
 * This helper function gets the event passed by codeDeploy and pulls
 * out the development id and lifecycle id. This will later be used by
 * the success fail functions
 *
 */
const getInput = (event) => {
    return {
        id: event.DeploymentId,
        lifecycleId: event.LifecycleEventHookExecutionId
    }
}

/**
 * success
 *
 * This helper function will take the formatted input from getInput,
 * and return a status of successful. The status must be the string
 * "Succeeded" in order to register has successful.
 *
 */
const success = async (e) => {
    const params = {
        deploymentId: e.id,
        lifecycleEventHookExecutionId: e.lifecycleId,
        status: 'Succeeded'
    }

    return codeDeploy.putLifecycleEventHookExecutionStatus(params).promise()
}

/**
 * fail
 *
 * This helper function will take the formatted input from getInput,
 * and return a status of Failed. The status must be the string
 * "Failed" in order to register has failed.
 *
 */
const fail = async (e) => {
    const params = {
        deploymentId: e.id,
        lifecycleEventHookExecutionId: e.lifecycleId,
        status: 'Failed'
    }

    return codeDeploy.putLifecycleEventHookExecutionStatus(params).promise()
}

/**
 * Main Function
 *
 * This is the main function which will wrap all hooks, injecting them
 * with helper fucntions and values
 */
module.exports = (fn) => async (e) => {
    const input = getInput(e)
    const result = await fn()
    if (result.success) {
        return await success(input)
    } else {
        return await fail(input)
    }
}
