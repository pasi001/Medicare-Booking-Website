import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'

export const updateDoctor = async (req,res) => {
    const id = req.params.id

    try {
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, {$set: req.body}, {new:true}).select("-password")

        res.status(200).json({success:true, message:'Successfully Updated', data:updatedDoctor})

    } catch (error) {
        res.status(500).json({success:false, message:'Failed to Updated'})
    }
}

export const deleteDoctor = async (req,res) => {
    const id = req.params.id

    try {
        await Doctor.findByIdAndDelete(id)

        res.status(200).json({success:true, message:'Successfully Deleted'})

    } catch (error) {
        res.status(500).json({success:false, message:'Failed to Delete'})
    }
}

export const getSingleDoctor = async (req,res) => {
    const id = req.params.id

    try {
        const doctor = await Doctor.findById(id).populate('reviews').select('-password')

        res.status(200).json({success:true, message:'Doctor Found', data:doctor})

    } catch (error) {
        res.status(404).json({success:false, message:'No Doctor found'})
    }
}

export const getAllDoctors = async (req,res) => {
    try {
        const {query} = req.query;
        let doctors;

        if(query){
            doctors = await Doctor.find({
                isApproved: 'approved', 
                $or: [
                    {name: {$regex: query, $options: 'i'}},
                    {specialization: {$regex: query, $options: 'i'}},
                ],
            }).select('-password')
        }else{
            doctors = await Doctor.find({isApproved:'approved'})
        }
        
        res.status(200).json({success:true, message:'Doctor Found', data:doctors})

    } catch (error) {
        res.status(404).json({success:false, message:'Not found'})
    }
}

export const getDoctorProfile = async (req,res) => {
    const doctorId = req.userId;

    try {
        const doctor =  await Doctor.findById(doctorId).select('-password')

        if(!doctor){
            return res.status(404).json({success:false, message:'Doctor not found'})
        }

        const appointments = await Booking.find({doctor: doctorId}).populate({
            path: 'user',
            select: 'name email photo gender'
        });

        res.status(200).json({success:true, message:'Profile info is getting', data:{doctor, appointments}})

    } catch (error) {
        res.status(500).json({success:false, message:'Something went wrong, cannot get'})
    }
}