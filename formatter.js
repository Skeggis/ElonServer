const formatProgram = program => {
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    author: program.author,
    sets: program.sets,
    timeout: program.timeout,
    numShots: program.num_shots,
    totalTime: program.total_time,
  }
}

const formatPrograms = programs => {
  let formattedPrograms = []
  programs.forEach(program => {
    formattedPrograms.push(formatProgram(program))
  })
  return formattedPrograms
}

const formatRoutine = routine => {
  const formattedRoutineDesc = formatRoutineDesc(routine.routineDesc)
  return {
    id: routine.id,
    rounds: routine.rounds,
    timeout: routine.timeout,
    ordering: routine.ordering,
    programId: routine.programId,
    created: routine.created,
    routineDesc: formattedRoutineDesc
  }
}


const formatRoutineDesc = routineDesc => {
  let formattedRoutineDesc = []
  routineDesc.forEach(desc => {
    const shot = formatShot(desc.shot)
    formattedRoutineDesc.push({
      id: desc.id,
      shotType: desc.shot_type,
      timeout: desc.timeout,
      ordering: desc.ordering,
      created: desc.created,
      shot
    })
  })
  return formattedRoutineDesc
}

const formatShot = shot => {
  return {
    id: shot.id,
    name: shot.name,
    horizontal: shot.horizontal,
    vertical: shot.vertical,
    power: shot.power,
    image: shot.image
  }
}

module.exports = {
  formatProgram,
  formatPrograms,
  formatRoutine,
  formatRoutineDesc,
  formatShot
}