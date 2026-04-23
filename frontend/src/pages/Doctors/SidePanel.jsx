import React, { useContext, useState } from 'react'
import convertTime from '../../utils/convertTime'
import {BASE_URL} from './../../config.js'
import { toast } from 'react-toastify'
import { authContext } from '../../context/authContext.jsx'

const SidePanel = ({doctorId, ticketPrice, timeSlots}) => {
    const { token } = useContext(authContext)
    const [selectedSlot, setSelectedSlot] = useState(null)
    const [appointmentDate, setAppointmentDate] = useState('')
    const [isBooking, setIsBooking] = useState(false)

    const bookingHandler = async() => {
        if (!selectedSlot) {
            toast.error('Please select a time slot')
            return
        }
        
        if (!appointmentDate) {
            toast.error('Please select an appointment date')
            return
        }

        // Check if selected date is not in the past
        const selectedDate = new Date(appointmentDate)
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (selectedDate < today) {
            toast.error('Please select a future date')
            return
        }

        // Check if the selected day matches the time slot day
        const [day] = selectedSlot.split('|')
        const selectedDayName = selectedDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()
        
        if (day.toLowerCase() !== selectedDayName) {
            toast.error(`Selected date should be a ${day}. Please select a ${day}.`)
            return
        }

        setIsBooking(true)
        try {
            const res = await fetch(`${BASE_URL}/bookings/book-appointment/${doctorId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    appointmentDate,
                    timeSlot: selectedSlot,
                    ticketPrice
                })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Failed to book appointment')
            }

            toast.success('Appointment booked successfully!')
            setSelectedSlot(null)
            setAppointmentDate('')
            
        } catch (err) {
            toast.error(err.message)
        } finally {
            setIsBooking(false)
        }
    }
  return (
    <div className='shadow-panelShadow p-3 lg:p-5 rounded-md'>
        <div className="flex items-center justify-between">
            <p className="text__para mt-0 font-semibold">
                Ticket Price
            </p>
            <span className="text-[16px] leading-7 lg:text-[22px] lg:leading-8 text-headingColor
            font-bold">
                {ticketPrice} LKR
            </span>
        </div>

        <div className="mt-[30px]">
            <p className="text__para mt-0 font-semibold text-headingColor">
                Available Time Slots:
            </p>

            <ul className="mt-3">
                {timeSlots?.map((item, index) => (
                    <li key={index} className="flex items-center justify-between mb-2">
                        <p className="text-[15px] leading-6 font-semibold text-textColor">
                            {item.day.charAt(0).toUpperCase() + item.day.slice(1)}
                        </p>
                        <div className="flex items-center">
                            <p className="text-[15px] leading-6 font-semibold text-textColor mr-3">
                                {convertTime(item.startingTime)} - {convertTime(item.endingTime)}
                            </p>
                            <input
                                type="radio"
                                name="timeSlot"
                                value={`${item.day}|${item.startingTime}|${item.endingTime}`}
                                onChange={(e) => setSelectedSlot(e.target.value)}
                                className="w-4 h-4 text-blue-600"
                            />
                        </div>
                    </li>
                ))}
            </ul>
        </div>

        <div className="mt-[30px]">
            <p className="text__para mt-0 font-semibold text-headingColor">
                Select Appointment Date:
            </p>
            <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full mt-3 p-3 border border-gray-300 rounded-md focus:outline-none focus:border-primaryColor"
            />
        </div>

        <button 
            onClick={bookingHandler} 
            disabled={isBooking}
            className="btn px-2 w-full rounded-md mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isBooking ? 'Booking...' : 'Book Appointment'}
        </button>
    </div>
  )
}

export default SidePanel