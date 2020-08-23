const { query } = require('../query')

const {
  DB_USERS,
  DB_ORGANIZATIONS,
  DB_JOIN_REQUESTS,
} = process.env

const getUserByUUID = async (uuid, client=null) => {
  console.log("GETTING USER BY UUID")
  console.log(`SELECT * FROM ${DB_USERS} where uuid = '${uuid}'`)
  const usersQuery = `SELECT * FROM ${DB_USERS} where uuid = $1`

  let result;
  if(client){
    result = await client.query(usersQuery, [uuid])
  } else {
    result = await query(usersQuery, [uuid])
  }
  return result
}

const getUserByEmail = async (email, client=null) => {
    console.log("GETTING USER BY EMAIL")
    console.log(`SELECT * FROM ${DB_USERS} where email = '${email.toLowerCase()}'`)
    const usersQuery = `SELECT * FROM ${DB_USERS} where email = $1`

    let result;
    if(client){
      result = await client.query(usersQuery, [email.toLowerCase()])
    } else {
      result = await query(usersQuery, [email.toLowerCase()])
    }
    return result
}


const insertUser = async (user = {email, uuid, password, googleId, name, photoUrl}, client=null) => {
    console.log("USER: ", user)
    console.log(`INSERT INTO ${DB_USERS} (email, uuid, password, google_id, name, photo_url) = ('${user.email.toLowerCase()}', ${user.uuid}, ${user.password}, ${user.googleId}, ${user.name}, ${user.photoUrl}) returning *`)
    const usersQuery = `INSERT INTO ${DB_USERS} (email, uuid, password, google_id, name, photo_url)  VALUES ($1,$2,$3,$4,$5,$6) returning *`

    let result;
    if(client){
      result = await client.query(usersQuery, [user.email.toLowerCase(), user.uuid, user.password, user.googleId, user.name, user.photoUrl])
    } else {
      result = await query(usersQuery, [user.email.toLowerCase(), user.uuid, user.password, user.googleId, user.name, user.photoUrl])
    }
    return result
}


//TODO: Only update photo and name if this is first time logging in with Google!
const updateUserByEmailAndGoogleId = async ( user = {email, googleId, photoUrl, name},client=null) => {
  console.log("THings: ", user.email, user.googleId)
  console.log(`update ${DB_USERS} set photo_url=${user.photoUrl}, name=${user.name} where email=${user.email} and google_id=${user.googleId}`);

  const usersQuery = `update ${DB_USERS} set photo_url=$1, name=$2,google_id=$3 where email=$4 returning *`;
  let result;

  if(client){
    result = await client.query(usersQuery, [user.photoUrl, user.name, user.googleId, user.email.toLowerCase()])
  } else {
    result = await query(usersQuery, [user.photoUrl, user.name, user.googleId, user.email.toLowerCase()])
  }
  return result
}

module.exports = {
  getUserByEmail,
  insertUser,
  updateUserByEmailAndGoogleId,
  getUserByUUID,
}