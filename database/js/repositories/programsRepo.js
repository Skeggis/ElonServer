const { query } = require('../query')

const {
  DB_PROGRAMS,
  DB_ROUTINES,
  DB_ROUTINE_DESCRIPTION
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
  let insertQuery = `INSERT INTO ${DB_ROUTINE_DESCRIPTION} (shot_type, timeout, routine_id, ordering) VALUES `
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
  const queryString = `SELECT * FROM ${DB_ROUTINES} WHERE id = $1 ORDER BY ordering`
  const result = await query(queryString, [programId])

  return result
}

const getRoutineDescriptionByRoutineId = async routineId => {
  const queryString = `SELECT * FROM ${DB_ROUTINE_DESCRIPTION} WHERE id = $1`
  const result = await query(queryString, [routineId])
}

const getShotsByRoutineId = async routineId => {
  const queryString = `SELECT * FROM ${DB_ROUTINE_DESCRIPTION} WHERE routine_id = $1 ORDER BY ordering`
}

const getProgramById = async programId => {
  const queryString = `SELECT * FROM ${DB_PROGRAMS} WHERE id = $1`
  const result = await query(queryString, [programId])
  return result
}

module.exports = {
  insertProgram,
  insertRoutines,
  insertRoutinesDesc,
  getPrograms,
  getProgramById,
  getRoutinesByProgramId,
  getRoutineDescriptionByRoutineId
}