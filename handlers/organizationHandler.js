const {
    createOrganization,
    updateUsersOrganizationMembership,
    getAllOrganizations,
    getOrganizationFromId,
    getMembersOfOrganization,
    getJoinRequestsForOrganization,
    insertRequestToJoinOrganization,
    getRequestToJoinOrganizationFromUUID,
    removeJoinRequest,
    deleteMemberFromOrganization
} = require('../database/js/repositories/organizationRepo')

const {
    getUserByUUID
} = require('../database/js/repositories/usersRepo')

const {
    formatUser,
    formatOrganization,
    formatOrganizations,
    formatMembers,
    formatJoinRequests,
    formatJoinRequest
} = require('../formatter')
const { transaction } = require('../database/js/query')

async function createOrganizationHandler(organization = { owner_id:'', name:'', image_url:'' }) {

    const userResult = await getUserByUUID(organization.owner_id);

    if (userResult.rowCount == 0 || userResult.rowCount >= 2) {
        return {
            success: false,
            message: "Client error",
            errors: ["You don't exist in our database."]
        }
    }

    const user = formatUser(userResult.rows[0])
    if (user.organization_id) {
        return {
            success: false,
            message: "Client error",
            errors: ["You are already a member of an organization."]
        }
    }

    let result;
    let createdOrganization;
    const transactionResult = await transaction(async client => {

        result = await createOrganization(organization, client)

        if (result.rows[0]) {
            createdOrganization = formatOrganization(result.rows[0])
            result = await updateUsersOrganizationMembership(organization.owner_id, createdOrganization.id, client)
            if (!result.rows[0]) { throw Error('Error updatingUsersMembership!') }
        }
    })

    if (!transactionResult.success) {
        return {
            success: false,
            message: "Server error",
            errors: ["We made a mistake."]
        }
    }
    return {
        success: true,
        organization: createdOrganization
    }
}


//Returns the organization uuid is a part of, or:
//Returns all organizations if user is not a part of any organization (so he/she can choose an organization to join)
async function getMyOrganizationHandler(uuid = '') {
    const userResult = await getUserByUUID(organization.owner_id);
    if (!userResult[0]) { return { success: false, message: `Could not find this uuid: ${uuid}`, errors: ["Client sent invalid uuid"] } }

    const user = formatUser(userResult.rows[0])
    let result;
    //User is not a member of an organization
    if (!user.organization_id) {
        result = await getAllOrganizations()
        return {
            success: true,
            organizations: formatOrganizations(result.rows)
        }
    }

    let organization;
    const transactionResult = await transaction(async client => {

        result = await getOrganizationFromId(user.organization_id, client)

        if (!result.rows[0]) { throw Error("Could not find organization of client ") }

        organization = formatOrganization(result.rows[0])
        const membersResult = await getMembersOfOrganization(user.organization_id, client)

        if (!membersResult.rows[0]) { throw Error("Could not find organization of client ") }
        organization.members = formatMembers(membersResult.rows)

        let joinRequestsResult;
        if (organization.owner_id == uuid) {
            joinRequestsResult = await getJoinRequestsForOrganization(organization.id, client)
            organization.join_requests = formatJoinRequests(joinRequestsResult.rows)
        }
    })

    if (!transactionResult.success) {
        return {
            success: false,
            message: "Server error",
            errors: ["We made a mistake."]
        }
    }

    return {
        success: true,
        organization
    }
}

async function requestToJoinOrganizationHandler(uuid, organization_id) {
    const userResult = await getUserByUUID(organization.owner_id);
    if (!userResult[0]) { return { success: false, message: `Could not find this uuid: ${uuid}`, errors: ["Client sent invalid uuid"] } }

    const user = formatUser(userResult.rows[0])
    //User is a member of an organization
    if (user.organization_id) {
        return {
            success: false,
            message: 'This user is already a part of an organization ' + uuid,
            errors: ['I failed you, son. You are not worthy.']
        }
    }

    const joinRequesResult = await getRequestToJoinOrganizationFromUUID(uuid)

    //Already request being processed
    if (joinRequesResult.rows[0]) {
        return {
            success: false,
            message: "User has an active join request",
            errors: ["You have an active request. Please delete that request before requesting to join another organization."]
        }
    }

    let organizationResult = await getOrganizationFromId(organization_id)

    if (!organizationResult.rows[0]) {
        return {
            success: false,
            message: "Organization doth not exist",
            errors: ["I am a failure"]
        }
    }
    let result = await insertRequestToJoinOrganization(uuid, organization_id)

    if (!result.rows[0]) {
        return {
            success: false,
            message: "Something failed",
            errors: ["I am a failure"]
        }
    }

    return {
        success: true,
        joinRequest: formatJoinRequest(result.rows[0]),
        organizationRequestedToJoin: formatOrganization(organizationResult.rows[0])
    }
}


//Todo: change this into using the transaction function
async function answerJoinRequestHandler(user_uuid, organization_id, uuid, accept) {
    const organizationResult = await getOrganizationFromId(organization_id)
    if (!organizationResult.rows[0]) {
        return {
            success: false,
            message: "Something failed",
            errors: ["This organization doth not exist"]
        }
    }
    let organization = formatOrganization(organizationResult.rows[0])

    //This user is not the owner of this organization
    if (organization.owner_id != uuid) {
        return {
            success: false,
            message: "Something failed",
            errors: ["You do not have permission to this action."]
        }
    }

    let result = await removeJoinRequest(user_uuid, organization_id)

    if (!result.rows[0]) {
        return {
            success: false,
            message: "Something failed",
            errors: ["Something failed while executing this action."]
        }
    }
    if (accept) {
        result = await updateUsersOrganizationMembership(user_uuid, organization_id)
    }

    const membersResult = await getMembersOfOrganization(organization_id)
    const joinRequesResult = await getJoinRequestsForOrganization(organization_id)

    organization.members = formatMembers(membersResult.rows)
    organization.join_requests = formatJoinRequest(joinRequesResult)

    return {
        success: true,
        organization
    }
}

//Todo: change this into using the transaction function
async function deleteMemberFromOrganizationHandler(user_uuid,organization_id,uuid){
    const organizationResult = await getOrganizationFromId(organization_id)
    if (!organizationResult.rows[0]) {
        return {
            success: false,
            message: "Something failed",
            errors: ["This organization doth not exist"]
        }
    }
    let organization = formatOrganization(organizationResult.rows[0])

    //This user is not the owner of this organization
    if (organization.owner_id != uuid) {
        return {
            success: false,
            message: "Something failed",
            errors: ["You do not have permission to this action."]
        }
    }

    let result = await deleteMemberFromOrganization(user_uuid, organization_id)
    if (!result.rows[0]) {
        return {
            success: false,
            message: "Something failed",
            errors: ["Something failed while executing this action."]
        }
    }

    const membersResult = await getMembersOfOrganization(organization_id)
    const joinRequesResult = await getJoinRequestsForOrganization(organization_id)

    organization.members = formatMembers(membersResult.rows)
    organization.join_requests = formatJoinRequest(joinRequesResult)

    return {
        success: true,
        organization
    }
}

module.exports = { createOrganizationHandler,
     getMyOrganizationHandler,
     requestToJoinOrganizationHandler,
     answerJoinRequestHandler,
     deleteMemberFromOrganizationHandler }