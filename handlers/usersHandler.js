const {
    getUserByEmail,
    insertUser,
    updateUserByEmailAndGoogleId,
    getUserByUUID
} = require('../database/js/repositories/usersRepo')

const {
    getRequestToJoinOrganizationFromUUID, getOrganizationFromId
} = require('../database/js/repositories/organizationRepo')

const { v4: uuidv4 } = require('uuid');

const {
    formatUser
} = require('../formatter')
const { transaction } = require('../database/js/query')

const isEmailRegistered = async (email) => {
    const result = await getUserByEmail(email)
    return result.rowCount > 0
}

const signInWithGoogleHandler = async (user = { email, googleId, photoUrl, name }) => {

    let result;
    const transactionResult = await transaction(async client => {

        result = await updateUserByEmailAndGoogleId(user, client)

        if (!result.rows[0]) {
            user.uuid = uuidv4()
            result = await insertUser(user, client)
        }
    })

    if (transactionResult.success) {
        if (!result.rows[0]) {
            return {
                success: false,
                errors: ["Error trying to create the user"]
            }
        }

        return {
            success: true,
            user: formatUser(result.rows[0])
        }

    } else {
        return {
            success: false,
            erros: ["Error trying to create user"]
        }
    }

}

const getUserByEmailHandler = async (email) => {
    const result = await getUserByEmail(email)

    if (!result.rows[0]) {
        return {
            success: false,
            errors: ["Email or password are incorrect"]
        }
    }

    const joinResult = getRequestToJoinOrganizationFromUUID(result.rows[0].uuid)
    if (joinResult.rows.length > 0) {
        result.rows[0].requestOrganization = getOrganizationFromId(joinResult.rows[0].organization_id)
    }

    return {
        success: true,
        user: formatUser(result.rows[0])
    }
}

const getUSerByUUIDHandler = async (UUID) => {
    const result = await getUserByUUID(UUID)

    if (!result.rows[0]) {
        return {
            success: false,
            errors: ["You do not exist"]
        }
    }

    const joinResult = await getRequestToJoinOrganizationFromUUID(UUID)
    if (joinResult.rows.length > 0) {
        const organizationResult = await getOrganizationFromId(joinResult.rows[0].organization_id)
        result.rows[0].requestOrganization = organizationResult.rows[0]
    }

    return {
        success: true,
        user: formatUser(result.rows[0])
    }
}

const createUserHandler = async (user = { email, name, uuid, password }) => {
    const result = await insertUser(user)
    if (result.rowCount == 0) {
        return {
            success: false,
            errors: ["Error trying to create the user"]
        }
    }

    return {
        success: true,
        user: formatUser(result.rows[0])
    }
}

module.exports = {
    isEmailRegistered, 
    createUserHandler, 
    getUserByEmailHandler, 
    signInWithGoogleHandler, 
    getUSerByUUIDHandler,
}