const express = require('express')
const router = express.Router()

const {
  insertProgramHandler,
  getProgramsHandler,
  getProgramHandler,
  checkIfProgramExists,
  getShotsByLocationHandler
} = require('../handlers/programsHandler')



/**
 * program: {
 *    name: String,
 *    description: String,
 *    author: String,
 *    sets: integer,
 *    timeout: integer, //time between sets in seconds
 *    routines: [
 *      {
 *        rounds: integer,
 *        timeout: integer, //time in seconds between rounds
 *        routineDesc: [
 *          shotType: integer // the id of the shot type,
 *          timeout: integer // delay after the shot in seconds
 *        ]
 *      }
 *    ]
 * }
 */
const insertProgramRoute = async (req, res) => {
  const program = req.body.program

  const result = await insertProgramHandler(program)
  if(result.success){
    res.status(200).json(result)
  } else {
    res.status(500).json(result)
  }
}

const getProgramsRoute = async (req, res) => {
  const result = await getProgramsHandler()
  if(result.success){
    console.log('her')
    console.log(result)
    res.status(200).json(result)
  } else {
    res.status(500).json({
      success: false,
      message: 'Something went wrong'
    })
  }
}

const getProgramRoute = async (req, res) => {
  const programId = req.params.id
  const result = await getProgramHandler(programId)

  if(result.success){
    res.status(200).json(result)
  } else {
    res.status(404).json(result)
  }
}

const getShotsRoute = async (req, res) => {
  const result = await getShotsByLocationHandler()

  if(result.success){
    res.status(200).json(result)
  } else {
    res.status(500).json(result)
  }
}

router.get('/', getProgramsRoute)
router.post('/', insertProgramRoute)
router.get('/shots', getShotsRoute)
router.get('/:id', getProgramRoute)

module.exports = router