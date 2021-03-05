const { auth, getStackOutputs } = require('../../../_common/codeDeploy/index')
const chai = require('chai')
const expect = chai.expect
const fetch = require('node-fetch')

module.exports = async () => {
    /**
     * Get userPool info and endpoint from cloudformation outputs
     */
    const { userPoolId, userPoolClientId, url } = await getStackOutputs(
        process.env.REGION,
        process.env.CFSTACK
    )

    /**
     * Using the userPool info, we fetch a jwt to use so we can make
     * authenticated api calls against protected endpoints
     */
    const jwt = await auth({
        userPoolId: userPoolId,
        userPoolClientId: userPoolClientId
    })

    /**
     * Create a Note
     */
    const createRaw = await fetch(url + '/notes/create', {
        method: 'post',
        body: JSON.stringify({
            title: 'One'
        }),
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const createResult = await createRaw.json()

    /**
     * Get a Note
     */
    const getRaw = await fetch(url + '/notes/get?note=' + createResult.id, {
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })

    const getResult = await getRaw.json()
    expect(getResult.id).to.be.equal(createResult.id)
    expect(getResult.title).to.be.equal('One')

    /**
     * Remove a Note
     */
    const removeRaw = await fetch(url + '/notes/remove', {
        method: 'post',
        body: JSON.stringify({
            id: createResult.id
        }),
        headers: {
            Authorization: `Bearer ${jwt}`
        }
    })
    const removeResult = await removeRaw.json()
    expect(removeResult.id).to.be.equal(createResult.id)
    expect(removeResult.title).to.be.equal('One')
}
