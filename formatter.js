const formatProgram = program => {
  return {
    id: program.id,
    name: program.name,
    description: program.description,
    author: program.author,
    sets: program.sets,
    timeout: program.set_timeout,
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
  return {
    id: routine.routine_id,
    rounds: routine.rounds,
    timeout: routine.rounds_timeout,
  }
}




const formatShot = shot => {
  return {
    typeName: shot.type_name,
    locationName: shot.location_name,
    locationId: shot.shot_location_id,
    horizontal: shot.horizontal,
    vertical: shot.vertical,
    power: shot.power,
    timeout: shot.shot_timeout
  }
}

module.exports = {
  formatProgram,
  formatPrograms,
  formatRoutine,
  formatShot
}