import express from 'express'
import {authenticate} from './../auth/verifyToken.js'
import {getCheckoutSession, bookAppointment} from '../Controlls/bookingController.js'

const router = express.Router()

router.post('/checkout-session/:doctorId', authenticate, getCheckoutSession)
router.post('/book-appointment/:doctorId', authenticate, bookAppointment)

export default router