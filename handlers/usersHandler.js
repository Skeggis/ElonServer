const {
    getUserByEmail,
    insertUser,
} = require('../database/js/repositories/usersRepo')

const {
    formatUser
} = require('../formatter')
const { transaction } = require('../database/js/query')

const isEmailRegistered = async (email) => {
    const result = await getUserByEmail(email)
    return result.rowCount > 0
}

const getUserByEmailHandler = async (email) => {
    const result = await getUserByEmail(email)

    if (!result.rows[0]) {
        return {
            success: false,
            errors: ["Email or password are incorrect"]
        }
    }

    return {
        success: true,
        user: formatUser(result.rows[0])
    }
}

const createUserHandler = async (user = { email, uuid, password }) => {
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

module.exports = { isEmailRegistered, createUserHandler, getUserByEmailHandler }