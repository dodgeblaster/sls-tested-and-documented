const CognitoIdentityServiceProvider = require('amazon-cognito-identity-js')
// Required in order to use the cognito js library to work.
global.fetch = require('node-fetch')

/**
 * Authenticate a cognito user and return its authentication token. Use the auth
 * token in the authorization header
 */
const userName = 'int-test-admin@example.com'
const password = 'Password@1001'

function authenticateUser({ userPoolId, userPoolClientId }) {
    return new Promise((res, rej) => {
        console.info('Authenticating user...')
        const authenticationData = {
            Username: userName,
            Password: password
        }

        const authenticationDetails = new CognitoIdentityServiceProvider.AuthenticationDetails(
            authenticationData
        )

        const poolData = {
            UserPoolId: userPoolId,
            ClientId: userPoolClientId
        }

        const userPool = new CognitoIdentityServiceProvider.CognitoUserPool(
            poolData
        )
        const userData = {
            Username: userName,
            Pool: userPool
        }

        const cognitoUser = new CognitoIdentityServiceProvider.CognitoUser(
            userData
        )

        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                const token = result.getIdToken().getJwtToken()
                res(token)
            },
            onFailure: function (err) {
                console.log('Integration Test Congito Error: ', err)
                rej(err)
            }
        })
    })
}

module.exports = authenticateUser
