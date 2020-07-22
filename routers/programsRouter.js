const express = require('express')
const router = express.Router()

const {
  createProgramHandler,
  getProgramsHandler,
} = require('../handlers/programsHandler')
const { getPrograms } = require('../database/js/repositories/programsRepo')



/**
 * program: {
 *    name: String,
 *    description: String,
 *    author: String,
 *    sets: integer,
 *    timeout: integer, //time between sets in seconds
 *    programDesc: [
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
const createProgramRoute = async (req, res) => {
  const program = req.body.program

  const result = await createProgramHandler(program)
  if(result.success){
    res.status(200).send('created')
  } else {
    res.status(500).send('Something went wrong')
  }
}

const getProgramsRoute = async (req, res) => {
  const result = await getProgramsHandler()
  if(result.success){
    res.status(200).send(result.programs)
  } else {
    res.status(500).send('Something went wrong')
  }
}

router.get('/', getProgramsRoute)
router.post('/', createProgramRoute)

module.exports = router