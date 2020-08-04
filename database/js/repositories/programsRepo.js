const { query } = require('../query')

const {
  DB_PROGRAMS,
  DB_ROUTINES,
  DB_ROUTINE_DESCRIPTIONS,
  DB_SHOT_TYPES,
  DB_SHOT_LOCATIONS,
  DB_SHOTS
} = process.env


const insertProgram = async (client = null, program) => {
  const insertQuery = `INSERT INTO ${DB_PROGRAMS}
    (name, description, author, total_time, num_shots, sets, timeout)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`
  const insertValues = [
    program.name,
    program.description,
    program.author,
    program.totalTime,
    program.numShots,
    program.sets,
    program.timeout
  ]

  let result
  if (client) {
    result = await client.query(insertQuery, insertValues)
  } else {
    result = await query(insertQuery, insertValues)
  }
  return result
}

const insertRoutines = async (client = null, routines, programId) => {
  let insertQuery = `INSERT INTO ${DB_ROUTINES} (rounds, timeout, ordering, program_id) VALUES `
  const insertValues = []
  for (let i = 0; i < routines.length; i++) {
    const currRoutine = routines[i]
    if (i === routines.length - 1) {
      insertQuery = insertQuery.concat(`($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4})`)
    } else {
      insertQuery = insertQuery.concat(`($${i * 4 + 1}, $${i * 4 + 2}, $${i * 4 + 3}, $${i * 4 + 4}), `)
    }
    insertValues.push(currRoutine.rounds, currRoutine.timeout, i + 1, programId)
  }
  insertQuery = insertQuery.concat('RETURNING *')

  let result
  if (client) {
    result = await client.query(insertQuery, insertValues)
  } else {
    result = await query(insertQuery, insertValues)
  }
  return result
}

const insertRoutinesDesc = async (client = null, routines, routinesRows) => {
  let insertQuery = `INSERT INTO ${DB_ROUTINE_DESCRIPTIONS} (shot_type, timeout, routine_id, ordering) VALUES `
  let insertValues = []
  let counter = 0
  for (let i = 0; i < routines.length; i++) {
    const currRoutine = routines[i]
    const routineId = routinesRows[i].id
    for (let j = 0; j < currRoutine.routineDesc.length; j++) {
      const currDesc = currRoutine.routineDesc[j]
      if (i === routines.length - 1 && j === currRoutine.routineDesc.length - 1) {
        insertQuery = insertQuery.concat(`($${counter + 1}, $${counter + 2}, $${counter + 3}, $${counter + 4})`)
      } else {
        insertQuery = insertQuery.concat(`($${counter + 1}, $${counter + 2}, $${counter + 3}, $${counter + 4}), `)
      }
      insertValues.push(currDesc.shotType, currDesc.timeout, routineId, j + 1)
      counter += 4
    }
  }
  insertQuery = insertQuery.concat(' RETURNING *')

  let result
  if (client) {
    result = await client.query(insertQuery, insertValues)
  } else {
    result = await query(insertQuery, insertValues)
  }
  return result
}


const getPrograms = async () => {
  const programQuery = `SELECT * FROM ${DB_PROGRAMS} `
  const programResult = await query(programQuery)

  return programResult
}

const getRoutinesByProgramId = async programId => {
  const queryString = 
    `SELECT t.name as type_name, l.name as location_name, * FROM 
      ${DB_ROUTINES} r INNER JOIN ${DB_ROUTINE_DESCRIPTIONS} d
      ON r.id = d.routine_id
      INNER JOIN ${DB_SHOTS} s
      ON d.shot_id = s.id
      INNER JOIN ${DB_SHOT_LOCATIONS} l
      ON s.shot_location_id = l.id
      INNER JOIN ${DB_SHOT_TYPES} t
      ON s.shot_type_id = t.id
      WHERE r.program_id = $1 ORDER BY r.ordering, d.ordering`
  const result = await query(queryString, [programId])

  return result
}

const getRoutineDescriptionByRoutineId = async routineId => {
  const queryString = `SELECT * FROM ${DB_ROUTINE_DESCRIPTIONS} WHERE routine_id = $1`
  const result = await query(queryString, [routineId])

  return result
}

const getShotsByRoutineId = async routineId => {
  const queryString = `SELECT * FROM ${DB_ROUTINE_DESCRIPTIONS} WHERE routine_id = $1 ORDER BY ordering`
}

const getProgramById = async programId => {
  const queryString = `SELECT * FROM ${DB_PROGRAMS} WHERE id = $1`
  const result = await query(queryString, [programId])
  return result
}

const getShotById = async shotId => {
  const queryString = `SELECT * FROM ${DB_SHOT_TYPES} WHERE id = $1`
  const result = await query(queryString, [shotId])
  return result
}

const getShotLocation = async locationId => {
  const queryString = `SELECT * FROM ${DB_SHOT_LOCATIONS} WHERE id = $1`
  const result = await query(queryString, [locationId])
  return result
}

const getShots = async () => {
  const queryString = `
  SELECT locations.name AS location_name, types.name AS type_name, * FROM ${DB_SHOTS} AS shots 
  INNER JOIN ${DB_SHOT_LOCATIONS} AS locations
  ON shots.shot_location_id = locations.id
  INNER JOIN ${DB_SHOT_TYPES} types 
  ON shots.shot_type_id = types.id
  `
  const result = await query(queryString)
  return result
}

module.exports = {
  insertProgram,
  insertRoutines,
  insertRoutinesDesc,
  getPrograms,
  getProgramById,
  getRoutinesByProgramId,
  getRoutineDescriptionByRoutineId,
  getShotById,
  getShotLocation,
  getShots
}