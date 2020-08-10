require('dotenv').config()

const fs = require('fs')
const util = require('util')
const { query } = require('./query')
const readFileAsync = util.promisify(fs.readFile)

const {
  DB_PROGRAMS,
  DB_SHOT_TYPES,
  DB_ROUTINES,
  DB_ROUTINE_DESCRIPTIONS,
  DB_SHOT_LOCATIONS,
  DB_SHOTS,
  DB_USERS,
  DB_ORGANIZATIONS,
  DB_JOIN_REQUESTS
} = process.env

async function main() {

  console.info('Initializing database')

  await query(`DROP TABLE IF EXISTS
  ${DB_JOIN_REQUESTS},
  ${DB_SHOTS},
  ${DB_SHOT_LOCATIONS},
  ${DB_SHOT_TYPES},
  ${DB_PROGRAMS},
  ${DB_ROUTINES},
  ${DB_ROUTINE_DESCRIPTIONS},
  ${DB_USERS},
  ${DB_ORGANIZATIONS},
  CASCADE
  `)

  console.info('Tables dropped')

  try {
    const shotLocations = await readFileAsync('./database/schemas/shotLocations.sql')
    const shotTypes = await readFileAsync('./database/schemas/shotTypes.sql')
    const shots = await readFileAsync('./database/schemas/shots.sql')
    const programs = await readFileAsync('./database/schemas/programs.sql')
    const routines = await readFileAsync('./database/schemas/routines.sql')
    const routineDescription = await readFileAsync('./database/schemas/routineDescription.sql')
    const organizations = await readFileAsync('./database/schemas/organizations.sql')
    const users = await readFileAsync('./database/schemas/users.sql')
    const joinRequests = await readFileAsync('./database/schemas/joinRequests.sql')

    await query(organizations.toString('utf8'))
    await query(users.toString('utf8'))
    await query(shotLocations.toString('utf8'))
    await query(shotTypes.toString('utf8'))
    await query(shots.toString('utf8'))
    await query(programs.toString('utf8'))
    await query(routines.toString('utf8'))
    await query(routineDescription.toString('utf8'))
    await query(joinRequests.toString('utf8'))

    console.info('Tables created')
  } catch (e) {
    console.error('Error creating tables', e.message)
    return
  }


  try {
    const insert = await readFileAsync('./database/schemas/insert.sql')
    await query(insert.toString('utf8'))

    console.info('Data inserted')
  } catch (e) {
    console.info('Error inserting data', e.message)
  }

}

main().catch((err) => {
  console.error(err);
});