import User from '../models/UserSchema.js';
import Doctor from '../models/DoctorSchema.js'
import Booking from '../models/BookingSchema.js'
import Stripe from 'stripe'

export const getCheckoutSession = async(req,res) => {
    try {

        //get currently booked doctor
        const doctor = await Doctor.findById(req.params.doctorId);
        const user = await User.findById(req.userId);

        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

        //create stripe checkout session
        const session = await stripe.checkout.sessions.create({
            payment_method_types:['card'],
            mode:'payment',
            success_url:`${process.env.CLIENT_SITE_URL}/checkout-success`,
            cancel_url:`${req.protocol}://${req.get('host')}/doctors/${doctor.id}`,
            customer_email:user.email,
            client_reference_id:req.params.doctorId,
            line_items:[
                {
                    price_data:{
                        currency:'bdt',
                        unit_amount:doctor.ticketPrice * 100,
                        product_data:{
                            name:doctor.name,
                            description:doctor.bio,
                            images:[doctor.photo]
                        }
                    },
                    quantity:1
                }
            ]
        })

        //create new booking
        const booking = new Booking({
            doctor:doctor._id,
            user:user._id,
            ticketPrice:doctor.ticketPrice,
            session:session.id
        })

        await booking.save()

        res.status(200).json({success:true, message:'Successfully paid', session})

    } catch (err) {
        console.log(err)
        res.status(500).json({success:false, message:'Error creating checkout session'})
        
    }
}

export const bookAppointment = async(req, res) => {
    try {
        const { appointmentDate, timeSlot, ticketPrice } = req.body;
        const doctorId = req.params.doctorId;
        const userId = req.userId;

        // Validate input
        if (!appointmentDate || !timeSlot || !ticketPrice) {
            return res.status(400).json({ 
                success: false, 
                message: 'All fields are required: appointmentDate, timeSlot, ticketPrice' 
            });
        }

        // Parse time slot
        const [day, startingTime, endingTime] = timeSlot.split('|');
        
        if (!day || !startingTime || !endingTime) {
            return res.status(400).json({ 
                success: false, 
                message: 'Invalid time slot format' 
            });
        }

        // Get doctor and user details
        const doctor = await Doctor.findById(doctorId);
        const user = await User.findById(userId);

        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Verify the selected time slot exists in doctor's available slots
        const isValidSlot = doctor.timeSlots.some(slot => 
            slot.day.toLowerCase() === day.toLowerCase() &&
            slot.startingTime === startingTime &&
            slot.endingTime === endingTime
        );

        if (!isValidSlot) {
            return res.status(400).json({ 
                success: false, 
                message: 'Selected time slot is not available for this doctor' 
            });
        }

        // Parse and validate appointment date
        const appointmentDateObj = new Date(appointmentDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (appointmentDateObj < today) {
            return res.status(400).json({ 
                success: false, 
                message: 'Cannot book appointment for past dates' 
            });
        }

        // Check if appointment already exists for the same date and time slot
        const existingAppointment = await Booking.findOne({
            doctor: doctorId,
            appointmentDate: appointmentDateObj,
            'appointmentTime.day': day,
            'appointmentTime.startingTime': startingTime,
            'appointmentTime.endingTime': endingTime,
            status: { $ne: 'cancelled' }
        });

        if (existingAppointment) {
            return res.status(400).json({ 
                success: false, 
                message: 'This time slot is already booked for the selected date' 
            });
        }

        // Create new booking
        const booking = new Booking({
            doctor: doctorId,
            user: userId,
            ticketPrice: ticketPrice,
            appointmentDate: appointmentDateObj,
            appointmentTime: {
                day: day,
                startingTime: startingTime,
                endingTime: endingTime
            },
            status: 'approved',
            isPaid: true
        });

        await booking.save();

        res.status(200).json({
            success: true, 
            message: 'Appointment booked successfully',
            data: booking
        });

    } catch (err) {
        console.log(err);
        res.status(500).json({ 
            success: false, 
            message: 'Error booking appointment' 
        });
    }
}