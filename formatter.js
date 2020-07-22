const formatProgram = program => {

  const formattedProgramDesc = formatProgramDesc(program.programDesc)
  return {
    name: program.name,
    description: program.description,
    author: program.description,
    sets: program.sets,
    timeout: program.timeout,
    numShots: program.num_shots,
    totalTime: program.total_time,
    programDesc: formattedProgramDesc
  }
}

const formatProgramDesc = programDesc => {
  let formattedProgramDesc = []
  programDesc.forEach(desc => {
    const formattedRoutineDesc = formatRoutineDesc(desc.routineDesc)
    formattedProgramDesc.push({
      rounds: desc.rounds,
      timeout: desc.timeout,
      routineDesc: formattedRoutineDesc
    })
  })
  return formattedProgramDesc
}

const formatRoutineDesc = routineDesc => {
  let formattedRoutineDesc = []
  routineDesc.forEach(desc => {
    formattedRoutineDesc.push({
      shotType: desc.shot_type,
      timeout: desc.timeout
    })
  })
  return formattedRoutineDesc
}

module.exports = {
  formatProgram,
  formatProgramDesc,
  formatRoutineDesc
}