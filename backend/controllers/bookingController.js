import Booking from '../models/Booking.js'

// create new booking
export const createBooking = async (req,res)=>{
    const newBooking = new Booking(req.body)
    
    try {
        const savedBooking = await newBooking.save()
        res.status(200).json({success:true ,message:'your tour is booked',data:savedBooking})
    } catch (err) {
        res.status(500).json({success:false ,message:'internal server error'})
    }
};

// get single booking
export const getBooking = async(req,res)=>{
    const id = req.params.id
    try {
        const book = await Booking.findById(id)
        res
        .status(200)
        .json({
            success:true,
            message:'booking found',data:book})
    } catch (err) {
        res
        .status(404)
        .json({success:false,message:'booking not found'})
    }
}

// get all booking
export const getAllBooking = async(req,res)=>{
    
    try {
        const books = await Booking.find(id)
        res
        .status(200)
        .json({
            success:true,
            message:'booking found',
            data:books,})
    } catch (err) {
        res
        .status(500)
        .json({success:false,message:'internal server errr'})
    }
}
// Show all tours that the user has booked
export const getUserBookings = async (req, res) => {
    try {
        // Assuming the logged-in user's id is in req.user.id
        const bookings = await Booking.find({ userId: req.user.id }).populate('tourName');
        
        if (!bookings) {
            return res.status(404).json({ success: false, message: 'No bookings found for this user.' });
        }

        res.status(200).json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// Delete a user's booking
export const deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You are not authorized to delete this booking.' });
        }

        await booking.remove(); // Delete the booking

        res.status(200).json({ success: true, message: 'Booking deleted successfully.' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}
// Update a user's booking
export const updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({ success: false, message: 'Booking not found.' });
        }

        // Only the user who booked the tour or an admin can update the booking
        if (booking.userId !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ success: false, message: 'You are not authorized to update this booking.' });
        }

        // Update only the fields that the user can change (example: guest size, bookAt, etc.)
        booking.guestSize = req.body.guestSize || booking.guestSize;
        booking.bookAt = req.body.bookAt || booking.bookAt;
        
        // Save updated booking
        await booking.save();

        res.status(200).json({ success: true, message: 'Booking updated successfully.', booking });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}



