import User from '../models/UserSchema.js'
import Booking from '../models/BookingSchema.js'
import Doctor from '../models/DoctorSchema.js'

export const updateUser = async (req,res) => {
    const id = req.params.id

    try {
        const updatedUser = await User.findByIdAndUpdate(id, {$set: req.body}, {new:true}).select("-password")

        res.status(200).json({success:true, message:'Successfully Updated', data:updatedUser})

    } catch (error) {
        res.status(500).json({success:false, message:'Failed to Updated'})
    }
}

export const deleteUser = async (req,res) => {
    const id = req.params.id

    try {
        await User.findByIdAndDelete(id)

        res.status(200).json({success:true, message:'Successfully Deleted'})

    } catch (error) {
        res.status(500).json({success:false, message:'Failed to Delete'})
    }
}

export const getSingleUser = async (req,res) => {
    const id = req.params.id

    try {
        const user = await User.findById(id).select("-password")

        res.status(200).json({success:true, message:'User Found', data:user})

    } catch (error) {
        res.status(404).json({success:false, message:'No user found'})
    }
}

export const getAllUsers = async (req,res) => {
    try {
        const users = await User.find({}).select("-password")

        res.status(200).json({success:true, message:'User Found', data:users})

    } catch (error) {
        res.status(404).json({success:false, message:'Not found'})
    }
}

export const getUserProfile = async (req,res) => {
    const userId = req.userId;

    try {
        const user =  await User.findById(userId).select('-password')

        if(!user){
            return res.status(404).json({success:false, message:'User not found'})
        } 

        //const {password, ...rest} = req._doc;

        res.status(200).json({success:true, message:'Profile info is getting', data:user})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false, message:'Something went wrong, cannot get'})
    }
}

export const getMyAppointments = async (req,res) => {
    try {
        //step 01 - retrieve appointments from booking for specific user with populated doctor data
        const bookings = await Booking.find({user: req.userId}).populate({
            path: 'doctor',
            select: '-password'
        });
        
        // Extract doctor data from bookings
        const doctors = bookings.map(booking => ({
            ...booking.doctor._doc,
            appointmentInfo: {
                appointmentDate: booking.appointmentDate,
                appointmentTime: booking.appointmentTime,
                status: booking.status,
                ticketPrice: booking.ticketPrice,
                bookingId: booking._id
            }
        }));

        res.status(200).json({success:true, message:'Appointments are getting', data:doctors})

    } catch (error) {
        console.log(error.message)
        res.status(500).json({success:false, message:'Something went wrong, cannot get'})
    }
}