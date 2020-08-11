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
    timeout: routine.round_timeout,
  }
}

const formatShotTypes = (shots) => {
  let result = []
  shots.forEach(shot => {
    result.push({
      id: shot.id,
      name: shot.name
    })
  })
  return result
}


const formatShot = shot => {
  return {
    id: shot.shot_id,
    shotType: {
      id: shot.shot_type_id,
      name: shot.type_name
    },
    locationName: shot.location_name,
    locationId: shot.shot_location_id,
    horizontal: shot.horizontal,
    vertical: shot.vertical,
    power: shot.power,
    timeout: shot.shot_timeout
  }
}

const formatOrganizations = organizations => {
  let formattedOrganizations = []
  organizations.forEach(organization => {
    formattedOrganizations.push(formatOrganization(organization))
  })
  return formattedOrganizations
}

const formatOrganization = organization => {
  return {
    id: organization.id,
    name: organization.name,
    owner_id: organization.owner_id,
    image_url: organization.image_url,
    members: organization.members ? organization.members:[],
    join_requests: organization.join_requests ? organization.join_requests: []
  }
}

const formatJoinRequests = joinRequests => {
  let formattedJoinRequests = []
  joinRequests.forEach(joinRequest => {
    formattedJoinRequests.push(formatJoinRequest(joinRequest))
  })
  return formattedJoinRequests
}

const formatJoinRequest = joinRequest => {
  return {
    ...formatMember(joinRequest),
    uuid: joinRequest.user_uuid ? joinRequest.user_uuid.toUpperCase():"",
  }
}

const formatMembers = members => {
  let formattedMembers = []
  members.forEach(member => {
    formattedMembers.push(formatMember(member))
  })
  return formattedMembers
}

const formatMember = member => {
  return {
    uuid: member.uuid ? member.uuid.toUpperCase():'',
    id: member.id,
    name: member.name,
    photo_url:member.photo_url,
    organization_id: member.organization_id,
  }
}

const formatUser = user => {
  return {
    uuid: user.uuid ? user.uuid.toUpperCase():'',
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password, //hashed
    organization_id: user.organization_id,
    photo_url: user.photo_url,
    google_id: user.google_id,
    created: user.created
  }
}

const formatShotLocation = location => {
  return {
    id: location.shot_location_id,
    name: location.location_name,
  }
}


module.exports = {
  formatProgram,
  formatPrograms,
  formatRoutine,
  formatShot,
  formatShotTypes,
  formatUser,
  formatShotLocation,
  formatOrganization,
  formatOrganizations,
  formatMember,
  formatMembers,
  formatJoinRequest,
  formatJoinRequests,
}