const { Client } = require('pg')

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

module.exports = {
  query
}