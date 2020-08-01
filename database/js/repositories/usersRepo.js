const { query } = require('../query')

const {
  DB_USERS,
  DB_ORGANIZATIONS
} = process.env

const getUserByEmail = async (email) => {
    const usersQuery = `SELECT * FROM ${DB_USERS} where email = $1`
    const result = await query(usersQuery, [email.toLowerCase()])
    return result
}


const insertUser = async (user = {email, uuid, password}) => {
    console.log("USER: ", user)
    const usersQuery = `INSERT INTO ${DB_USERS} (email, uuid, password) = ($1,$2,$3) returning *`
    const result = await query(usersQuery, [user.email.toLowerCase(), user.uuid, user.password])
    return result
}

module.exports = {
  getUserByEmail,
  insertUser
}