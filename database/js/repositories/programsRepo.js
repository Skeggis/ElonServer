const util = require('util')
const fs = require('fs')
const path = require('path')
const readFileAsync = util.promisify(fs.readFile)
const { query } = require('../query')

const {
  DB_PROGRAMS
} = process.env

const createProgram = async (program) => {

  try {
    await query('BEGIN')
    console.log('Begin transaction')

    const insertProgramString = `INSERT INTO ${DB_PROGRAMS}
    (name, description, author, sets, timeout, total_time, num_shots)
    VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`

    let numShots = 0
    let totalTime = 0
    program.programDesc.forEach(programDesc => {
      
      let routineTime = 0
      programDesc.routineDesc.forEach(routineDesc => {
        routineTime += routineDesc.timeout
      })

      totalTime += (routineTime*programDesc.rounds + programDesc.timeout)
      numShots += programDesc.routineDesc.length*programDesc.rounds
    });

    totalTime = (totalTime + program.timeout) * program.sets
    numShots *= program.sets


    const insertProgramValues = [
      program.name,
      program.description,
      program.author,
      program.sets,
      program.timeout,
      totalTime,
      numShots
    ]
    const insertProgramResult = await query(insertProgramString, insertProgramValues)
    if (insertProgramResult.rowCount === 0) {
      return { success: false, message: 'Creating program failed' }
    }

    const programDescTableName = await createProgramDesc(insertProgramResult.rows[0])
    await insertProgramDesc(program.programDesc, programDescTableName, insertProgramResult.rows[0].id)


    const insertTableNameQueryString = `UPDATE ${DB_PROGRAMS} SET program_desc_table_name = $1 WHERE id = $2`
    const insertTableNameValues = [programDescTableName, insertProgramResult.rows[0].id]
    const insertTableNameResult = await query(insertTableNameQueryString, insertTableNameValues)

    await query('COMMIT')
  } catch (e) {
    console.log('Rollback', e)
    await query('ROLLBACK')
    return { success: false }
  }
  return {success: true}
}

const createProgramDesc = async (sqlRow) => {
  const programDescColumns = await readFileAsync(path.join(__dirname, '../../schemas/programDescColumns.sql'))
  
  const programDescTableName = `program_desc_${sqlRow.id}`
  const createTableQueryString = `CREATE TABLE ${programDescTableName} ${programDescColumns.toString('utf8')}`
  console.log(createTableQueryString)
  
  await query(createTableQueryString)
  console.log('programDescTable created')

  return programDescTableName
}

const insertProgramDesc = async (programDesc, tableName, programId) => {
  for (let i = 0; i < programDesc.length; i++) {
    const currentProgram = programDesc[i]
    const insertQueryString = `INSERT INTO ${tableName} (rounds, timeout) VALUES ($1, $2) RETURNING *`
    const insertValues = [currentProgram.rounds, currentProgram.timeout]
    const insertResult = await query(insertQueryString, insertValues)

    const routineTableName = await createRoutineDesc(insertResult.rows[0].id, programId)
    const updateTableNameQueryString = `UPDATE ${tableName} SET routine_desc_table_name = $1 WHERE id = $2`
    const updateTableNameValues = [routineTableName, insertResult.rows[0].id]
    await query(updateTableNameQueryString, updateTableNameValues)
    await insertRoutineDesc(routineTableName, currentProgram.routineDesc)
  }
}

const createRoutineDesc = async (routineId, programId) => {
  const routineTableName = `routine_desc_${routineId}_for_program_${programId}`
  const routineDescColumn = await readFileAsync(path.join(__dirname, '../../schemas/routineDescColumns.sql'))
  const createRoutineQueryString = `CREATE TABLE ${routineTableName} ${routineDescColumn.toString('utf8')}`
  await query(createRoutineQueryString)

  return routineTableName
}

const insertRoutineDesc = async (routineTableName, routineDesc) => {
  let insertQuery = `INSERT INTO ${routineTableName} (shot_type, timeout) VALUES `
  let insertValues = []
  for (let i = 0; i < routineDesc.length; i++) {
    const currentRoutine = routineDesc[i]
    if (i === routineDesc.length - 1) {
      insertQuery = insertQuery.concat(`($${i*2 + 1}, $${i*2 + 2})`)
    } else {
      insertQuery = insertQuery.concat(`($${i*2 + 1}, $${i*2 + 2}), `)
    }
    insertValues.push(currentRoutine.shotType, currentRoutine.timeout)
  }
  await query(insertQuery, insertValues)
}


const getPrograms = async () => {
  const programQuery = `SELECT * FROM ${DB_PROGRAMS} `
  const programResult = await query(programQuery)

  return programResult
}

const getProgramDesc = async tableName => {
  const queryString = `SELECT * FROM ${tableName}`
  console.log(queryString)
  const result = await query(queryString)

  return result
}

const getRoutineDesc = async tableName => {
  const queryString = `SELECT * FROM ${tableName}`
  const result = await query(queryString)

  return result
}

module.exports = {
  createProgram,
  getPrograms,
  getProgramDesc,
  getRoutineDesc
}