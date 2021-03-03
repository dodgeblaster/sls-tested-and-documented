const { auth, getStackOutputs } = require('../../../_common/codeDeploy/index')
const chai = require('chai')
const expect = chai.expect
const fetch = require('node-fetch')

module.exports = async () => {
    const { userPoolId, userPoolClientId, url } = await getStackOutputs()

    const jwt = await auth({
        userPoolId: userPoolId,
        userPoolClientId: userPoolClientId
    })

    const raw = await fetch(url + '/notes/myNote', {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })

    const result = await raw.json()
    expect(result.message).to.be.equal('ok')
}
