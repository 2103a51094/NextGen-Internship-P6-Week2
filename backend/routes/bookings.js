import express from 'express'
import { createBooking, getAllBooking, getBooking, getUserBookings,deleteBooking, updateBooking } from '../controllers/bookingController.js'
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'
// import { verifyUser } from '../utils/verifyToken.js'




const router = express.Router()
router.post('/',verifyUser,createBooking)
router.get('/:id',verifyUser,getBooking)
router.get('/',verifyAdmin,getAllBooking)
router.get('/my-bookings',verifyUser,getUserBookings)
router.delete('/:id', verifyUser, deleteBooking)
router.put('/:id', verifyUser, updateBooking)
export default router