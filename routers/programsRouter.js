const express = require('express')
const router = express.Router()

const {
  insertProgramHandler,
  getProgramsHandler,
  getRoutinesForProgram,
  checkIfProgramExists
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
    res.json(result.programs)
  } else {
    res.status(500).send('Something went wrong')
  }
}

const getRoutinesForProgramRoute = async (req, res) => {
  const programId = req.params.id
  const checkResult = await checkIfProgramExists(programId)

  if(!checkResult){
    return res.send(404).json({
      result: false,
      message: 'Program not found'
    })
  }
  const result = await getRoutinesForProgram(programId)

  if(result.success){
    res.send(200).json({
      success: true,
      result: result.routines
    })
  } else {
    res.send(404).json({
      success: false,
      message: 'Routine not found'
    })
  }
}

router.get('/', getProgramsRoute)
router.post('/', insertProgramRoute)
router.get('/:id', getRoutinesForProgramRoute)

module.exports = router