import cors from 'cors'
import express from 'express'
import morgan from 'morgan'
import productRoutes from './routes/product.routes'
import storeRoutes from './routes/store.routes'

const app = express()
app.use(cors())
app.use(express.json())
app.use(morgan('dev'))
app.get('/health', (_req, res) => res.json({ ok: true }))
app.use('/api/products', productRoutes)
app.use('/api/stores', storeRoutes)
app.use((req, res) => {
  res.status(404).json({ error: { message: 'Route not found' } })
})
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err)
  res.status(500).json({ error: { message: 'Internal Server Error' } })
})
export default app
