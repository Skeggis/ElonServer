const {
  createProgram,
  getPrograms,
  getProgramDesc,
  getRoutineDesc
} = require('../database/js/repositories/programsRepo')

const { formatProgram } = require('../formatter')

const createProgramHandler = async (program) => {
  const result = await createProgram(program)
  return result
}

const getProgramsHandler = async () => {
  const result = await getPrograms()
  const programs = result.rows
  let returnPrograms = []

  for (let i = 0; i < programs.length; i++) {
    let currentProgram = programs[i]
    const programDescResult = await getProgramDesc(currentProgram.program_desc_table_name)
    const programDesc = programDescResult.rows

    for (let i = 0; i < programDesc.length; i++) {
      const routineDescResult = await getRoutineDesc(programDescResult.rows[i].routine_desc_table_name)
      const routineDesc = routineDescResult.rows
      programDesc[i].routineDesc = routineDesc
    }

    currentProgram.programDesc = programDesc
    returnPrograms.push(formatProgram(currentProgram))
  }


  return {
    success: true,
    programs: returnPrograms
  }
}

module.exports = {
  createProgramHandler,
  getProgramsHandler
}