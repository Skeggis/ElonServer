const express = require('express')
const router = express.Router()

const {
    createOrganizationHandler,
    getMyOrganizationHandler,
    requestToJoinOrganizationHandler,
    answerJoinRequestHandler,
    deleteMemberFromOrganizationHandler,
    getOrganizationDataHandler,
    leaveOrganizationHandler,
    refreshOrganizationsHandler
} = require('../handlers/organizationHandler')

async function createOrganization(req, res) {
    const {
        uuid = '',
        imageUrl = '', //Url to the 
        name = '' //OrganizationName
    } = req.body

    if (!(uuid && name)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Please fill all fields"]
        })
    }

    const organization = {
        owner_id: uuid,
        name: name,
        image_url: imageUrl,
    }

    const result = await createOrganizationHandler(organization)

    if (!result.success) { return res.status(401).json(result) }

    return res.status(200).json(result)
}

async function getMyOrganization(req, res) {
    const {
        uuid = '',
    } = req.body

    if (!(uuid)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Client Error ... Please contact us for support at ....."]
        })
    }

    const result = await getMyOrganizationHandler(uuid)

    if (!result.success) { return res.status(401).json(result) }

    return res.status(200).json(result)
}

async function requestToJoinOrganization(req, res) {
    const { uuid = '', organization_id = '' } = req.body

    if (!(uuid && organization_id)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Client Error ... Please contact us for support at ....."]
        })
    }

    const result = await requestToJoinOrganizationHandler(uuid, organization_id)

    if (!result.success) { return res.status(401).json(result) }

    return res.status(200).json(result)
}

async function answerJoinRequest(req, res) {
    //UUID is uuid of the user sending the post request
    const { user_uuid = '', organization_id = '', uuid = '', accept = false } = req.body

    if (!(user_uuid && organization_id && uuid)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Client Error ... Please contact us for support at ....."]
        })
    }

    const result = await answerJoinRequestHandler(user_uuid, organization_id, uuid, accept)
    if (!result.success) { return res.status(401).json(result) }

    return res.status(200).json(result)
}

async function deleteMemberFromOrganization(req, res) {
    //UUID is uuid of the user sending the post request
    const { user_uuid = '', organization_id = '', uuid = '' } = req.body

    if (!(user_uuid && organization_id && uuid)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Client Error ... Please contact us for support at ....."]
        })
    }

    const result = await deleteMemberFromOrganizationHandler(user_uuid, organization_id, uuid)
    if (!result.success) { return res.status(401).json(result) }

    return res.status(200).json(result)

}

async function refreshOrganizationData(req, res) {
    const { uuid = '', organization_id = '' } = req.body
    const result = await getOrganizationDataHandler(uuid, organization_id)
    if (!result.success) { return res.status(401).json(result) }

    return res.status(200).json(result)
}

async function leaveOrganization(req, res) {
    //UUID is uuid of the user sending the post request
    const { uuid = '', organization_id = ''} = req.body

    if (!(organization_id && uuid)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Client Error ... Please contact us for support at ....."]
        })
    }

    const result = await leaveOrganizationHandler(organization_id, uuid)
    if (!result.success) { return res.status(401).json(result) }

    return res.status(200).json(result)

}

async function refreshOrganizations(req, res) {
    const {
        uuid = '',
    } = req.body

    if (!(uuid)) {
        return res.status(400).json({
            success: false,
            message: "Client error",
            errors: ["Client Error ... Please contact us for support at ....."]
        })
    }

    const result = await refreshOrganizationsHandler(uuid)

    if (!result.success) { return res.status(401).json(result) }

    return res.status(200).json(result)
}

router.post('/createOrganization', createOrganization)
router.post('/getMyOrganization', getMyOrganization)
router.post('/requestToJoinOrganization', requestToJoinOrganization)
router.post('/answerJoinRequest', answerJoinRequest)
router.post('/deleteMemberFromOrganization', deleteMemberFromOrganization)
router.post('/refreshOrganization', refreshOrganizationData)
router.post('/refreshOrganizations', refreshOrganizations)
router.post('/leaveOrganization', leaveOrganization)

module.exports = router