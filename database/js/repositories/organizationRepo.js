const { query } = require('../query')

const {
    DB_ORGANIZATIONS,
    DB_USERS,
    DB_JOIN_REQUESTS
} = process.env

const createOrganization = async (organization = { owner_id: '', name: '', image_url: '' }, client = null) => {
    console.log("Inserting new organization")
    console.log(`Insert into ${DB_ORGANIZATIONS} (owner_id, name, image_url) values('${organization.owner_id}', '${organization.name}', '${organization.image_url}') returning *`)
    const organizationQuery = `Insert into ${DB_ORGANIZATIONS} (owner_id, name, image_url) values($1,$2,$3) returning *`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [organization.owner_id, organization.name, organization.image_url])
    } else {
        result = await query(organizationQuery, [organization.owner_id, organization.name, organization.image_url])
    }
    return result
}

const updateUsersOrganizationMembership = async (user_id, organization_id, client = null) => {
    console.log("Updating users organization membership")
    console.log(`update ${DB_USERS} set organization_id = '${organization_id}' where uuid = ${user_id} returning *`)
    const organizationQuery = `update ${DB_USERS} set organization_id = $1 where uuid = $2 returning *`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [organization_id, user_id])
    } else {
        result = await query(organizationQuery, [organization_id, user_id])
    }
    return result
}

const getAllOrganizations = async (client = null) => {
    console.log("Get all organization")
    console.log(`Select * from ${DB_ORGANIZATIONS}`)
    const organizationQuery = `Select * from ${DB_ORGANIZATIONS}`
    let result;
    if (client) {
        result = await client.query(organizationQuery)
    } else {
        result = await query(organizationQuery)
    }
    return result
}

const getOrganizationFromId = async (organization_id, client = null) => {
    console.log("Get organization from id: " + organization_id)
    console.log(`Select * from ${DB_ORGANIZATIONS} where id=${organization_id}`)
    const organizationQuery = `Select * from ${DB_ORGANIZATIONS} where id=$1`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [organization_id])
    } else {
        result = await query(organizationQuery, [organization_id])
    }
    return result

}

const getMembersOfOrganization = async (organization_id, client = null) => {
    console.log(`Get members of organization with id: ${organization_id}`)
    console.log(`Select * from ${DB_USERS} where organization_id=${organization_id}`)
    const organizationQuery = `Select * from ${DB_USERS} where organization_id=$1`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [organization_id])
    } else {
        result = await query(organizationQuery, [organization_id])
    }
    return result
}

//Todo: change to join, so joinRequests table joins users table on user_id.
const getJoinRequestsForOrganization = async (organization_id, client = null) => {
    console.log(`Get join requests for org_id: ${organization_id}`)
    console.log(`Select * from ${DB_JOIN_REQUESTS} where organization_id=${organization_id}`)
    const organizationQuery = `Select * from ${DB_JOIN_REQUESTS} where organization_id=$1`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [organization_id])
    } else {
        result = await query(organizationQuery, [organization_id])
    }
    return result
}

const getRequestToJoinOrganizationFromUUID = async (uuid, client = null) => {
    console.log('Get My Request To Join Organization')
    console.log(`Select * from ${DB_JOIN_REQUESTS} where user_uuid = '${uuid}'`)
    const organizationQuery = `Select * from ${DB_JOIN_REQUESTS} where user_uuid = $1`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [uuid])
    } else {
        result = await query(organizationQuery, [uuid])
    }
    return result
}

const insertRequestToJoinOrganization = async (uuid, organization_id, client = null) => {
    console.log('Inserting request to join organization')
    console.log(`Insert into ${DB_JOIN_REQUESTS} (user_uuid, organization_id) values('${uuid}', ${organization_id}) returning *`)
    const organizationQuery = `Insert into ${DB_JOIN_REQUESTS} (user_uuid, organization_id) values($1,$2) returning *`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [uuid, organization_id])
    } else {
        result = await query(organizationQuery, [uuid, organization_id])
    }
    return result
}

const removeJoinRequest = async (user_uuid, organization_id, client=null) => {
    console.log("Remove join request")
    console.log(`Delete from ${DB_JOIN_REQUESTS} where user_uuid = '${user_uuid}' and organization_id = ${organization_id}`)
    const organizationQuery = `Delete from ${DB_JOIN_REQUESTS} where user_uuid = $1 and organization_id = $2`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [user_uuid, organization_id])
    } else {
        result = await query(organizationQuery, [user_uuid, organization_id])
    }
    return result
}

const deleteMemberFromOrganization = async (user_uuid, organization_id, client=null) => {
    console.log("Delete member from organization")
    console.log(`Update ${DB_USERS} set organization_id = NULL where uuid = '${user_uuid}' returning *`)
    const organizationQuery = `Update ${DB_USERS} set organization_id = NULL where uuid = $1 returning *`
    let result;
    if (client) {
        result = await client.query(organizationQuery, [user_uuid])
    } else {
        result = await query(organizationQuery, [user_uuid])
    }
    return result
}





module.exports = {
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
}