import process from 'node:process'
import app from './app'

const PORT = process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 3001
app.listen(PORT, () => {
  console.warn(`Server listening on port ${PORT}`)
})
