import React from 'react'
import {formateDate} from '../../utils/formateDate.js'
import convertTime from '../../utils/convertTime.js'

const Appointments = ({appointments}) => {
  // Filter out overdue appointments and sort by appointment date
  const filteredAndSortedAppointments = appointments
    ?.filter(item => {
      // Remove appointments where the date has passed
      const appointmentDate = new Date(item.appointmentDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to start of today
      return appointmentDate >= today;
    })
    ?.sort((a, b) => {
      // Sort by appointment date ascending (earliest first)
      return new Date(a.appointmentDate) - new Date(b.appointmentDate);
    });

  return (
    <table className="w-full text-left text-sm text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
                <th scope='col' className="px-6 py-3">
                    Name
                </th>
                <th scope='col' className="px-6 py-3">
                    Gender
                </th>
                <th scope='col' className="px-6 py-3">
                    Payment
                </th>
                <th scope='col' className="px-6 py-3">
                    Price
                </th>
                <th scope='col' className="px-6 py-3">
                    Appointment Date
                </th>
                <th scope='col' className="px-6 py-3">
                    Time Slot
                </th>
                <th scope='col' className="px-6 py-3">
                    Booked on
                </th>
            </tr>
        </thead>

        <tbody>
            {filteredAndSortedAppointments?.map(item => (
                <tr key={item._id}>
                    <th 
                      scope='row'
                      className='flex items-center px-6 py-4 text-gray-900 whitespace-nowrap'>
                        <img 
                          src={item.user.photo} 
                          className='w-10 h-10 rounded-full' 
                          alt="" 
                        />
                        <div className="pl-3">
                            <div className="text-base font-semibold">{item.user.name}</div>
                            <div className="text-normal text-gray-500">{item.user.email}</div>
                        </div>
                    </th>
                    <td className='px-6 py-4'>{item.user.gender}</td>
                    <td className="px-6 py-4">
                        {item.isPaid && (
                            <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-green-500 mr-2"></div>
                                Paid
                            </div>
                        )}

                        {!item.isPaid && (
                            <div className="flex items-center">
                                <div className="h-2.5 w-2.5 rounded-full bg-red-500 mr-2"></div>
                                Unpaid
                            </div>
                        )}
                    </td>
                    <td className="px-6 py-4">{item.ticketPrice}</td>
                    <td className="px-6 py-4">{formateDate(item.appointmentDate)}</td>
                    <td className="px-6 py-4">
                        <div className="text-sm">
                            <div className="font-semibold">{item.appointmentTime?.day}</div>
                            <div>{convertTime(item.appointmentTime?.startingTime)} - {convertTime(item.appointmentTime?.endingTime)}</div>
                        </div>
                    </td>
                    <td className="px-6 py-4">{formateDate(item.createdAt)}</td>
                </tr>
            ))}
        </tbody>
    </table>
  )
}

export default Appointments