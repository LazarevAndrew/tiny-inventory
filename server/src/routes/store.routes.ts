import { Router } from 'express'
import * as controller from '../controllers/store.controller'

const router = Router()
router.get('/', controller.list)
router.get('/summary', controller.summary)
router.get('/:id/summary', controller.summary)
router.get('/:id', controller.get)
router.post('/', controller.create)
router.put('/:id', controller.update)
router.delete('/:id', controller.remove)
export default router
