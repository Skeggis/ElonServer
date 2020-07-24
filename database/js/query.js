const { Client, Pool } = require('pg')

async function query(query, values = []) {
  const connectionString = process.env.DATABASE_URL

  const client = new Client({ connectionString })
  await client.connect()

  let result
  try {
    result = await client.query(query, values)
  } catch (err) {
    console.error('Error executing query', err)
    throw err
  } finally {
    await client.end()
  }

  return result
}

async function transaction(callback){
  const connectionString = process.env.DATABASE_URL

  const pool = new Pool({connectionString})
  const client = await pool.connect()

  try{
    await client.query('BEGIN')
    try{
      await callback(client)
      client.query('COMMIT')
      return{
        success: true
      }
    } catch(e){
      console.error('Error in transaction', e)
      client.query('ROLLBACK')
      return {
        success: false
      }
    }
  } finally {
    client.release()
  }
}

module.exports = {
  query,
  transaction
}