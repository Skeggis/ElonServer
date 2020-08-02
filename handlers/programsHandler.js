const _ = require('lodash')

const {
  insertProgram,
  insertRoutines,
  insertRoutinesDesc,
  getPrograms,
  getProgramById,
  getRoutinesByProgramId,
  getShotTypes,
} = require('../database/js/repositories/programsRepo')

const {
  formatPrograms,
  formatRoutine,
  formatProgram,
  formatShot,
  formatShotTypes,
  formatRoutineDesc
} = require('../formatter')

const { query } = require('express')
const { transaction } = require('../database/js/query')
const { groupByArray } = require('../helpers')

const insertProgramHandler = async (program) => {
  const programTime = calculateProgramTime(program)
  const programShots = calculateProgramShots(program)
  program.totalTime = programTime
  program.numShots = programShots


  const transactionResult = await transaction(async client => {
    const insertProgramResult = await insertProgram(client, program)
    const insertRoutinesResult = await insertRoutines(client, program.routines, insertProgramResult.rows[0].id)
    await insertRoutinesDesc(client, program.routines, insertRoutinesResult.rows)
  })

  if (transactionResult.success) {
    return {
      success: transactionResult.success,
      message: 'Successfully created program'
    }
  } else {
    return {
      success: transactionResult.success,
      message: 'Error inserting program'
    }
  }
}

const calculateProgramShots = (program) => {
  let totalShots = 0
  program.routines.forEach(routine => {
    totalShots += routine.rounds * routine.routineDesc.length
  })
  return totalShots * program.sets
}

const calculateProgramTime = (program) => {
  let totalTime = 0
  program.routines.forEach(routine => {
    let routineTime = 0

    routine.routineDesc.forEach(desc => {
      routineTime += desc.timeout
    })

    totalTime += routine.timeout + routine.rounds * routineTime
  });

  return totalTime * program.sets
}

const getProgramsHandler = async () => {
  const programsResult = await getPrograms()

  if (programsResult.rowCount === 0) {
    return {
      success: false,
      message: 'No programs found'
    }
  }

  console.log(programsResult.rows)

  return {
    success: true,
    programs: formatPrograms(programsResult.rows)
  }
}

const getProgramHandler = async (programId) => {
  const programResult = await getProgramById(programId)
  if (programResult.rowCount === 0) {
    return {
      success: false,
      message: 'Program not found'
    }
  }

  const program = formatProgram(programResult.rows[0])

  const routinesResult = await getRoutinesByProgramId(programId)

  const sortedRoutineResult = groupByArray(routinesResult.rows, 'routine_id')

  let routines = []
  sortedRoutineResult.forEach(res => {
    let routineDesc = []
    res.values.forEach(desc => {
      routineDesc.push(formatShot(desc))
    })

    let formattedRoutine = formatRoutine(res.values[0])
    formattedRoutine.routineDesc = routineDesc

    routines.push(formattedRoutine)
  })



  program.routines = routines


  return {
    success: true,
    result: program
  }
}

const checkIfProgramExists = async programId => {
  const programResult = await getProgramById(programId)
  return programResult.rowCount !== 0
}

const getShotTypesHandler = async() => {
  const shotTypesResult = await getShotTypes()
  if(shotTypesResult.rowCount > 0){
    console.log(shotTypesResult.rows)
    return formatShotTypes(shotTypesResult.rows)
  } else {
    return {
      success: false,
      message: 'No shot types found'
    }
  }
}

module.exports = {
  insertProgramHandler,
  getProgramsHandler,
  getProgramHandler,
  checkIfProgramExists,
  getShotTypesHandler
}