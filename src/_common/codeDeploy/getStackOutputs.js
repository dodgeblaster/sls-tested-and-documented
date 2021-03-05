const AWS = require('aws-sdk')

/**
 * Get Api Endpoint
 *
 * In order to run this test both locally and in side a CI pipeline,
 * we need to get the url in a way that does not involve the
 * serverless.yml file. Accessing this value by making
 * a CloudFormation sdk call will work in both scenarios.
 *
 */
async function getStackOutputs(region, stackName) {
    const client = new AWS.CloudFormation({
        region
    })

    let response
    try {
        response = await client
            .describeStacks({
                StackName: stackName
            })
            .promise()
    } catch (e) {
        throw new Error(
            `Cannot find stack ${stackName}: ${e.message}\n` +
                `Please make sure stack with the name "${stackName}" exists.`
        )
    }

    const stacks = response.Stacks
    const stackOutputs = stacks[0].Outputs

    const apiOutput = stackOutputs.find(
        (output) => output.OutputKey === 'ServiceEndpoint'
    )

    const userPoolId = stackOutputs.find(
        (output) => output.OutputKey === 'userPoolId'
    )

    const userPoolClientId = stackOutputs.find(
        (output) => output.OutputKey === 'userPoolClientId'
    )

    return {
        url: apiOutput.OutputValue,
        userPoolId: userPoolId.OutputValue,
        userPoolClientId: userPoolClientId.OutputValue
    }
}

module.exports = getStackOutputs
