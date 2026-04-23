import useFetchData from '../../hooks/useFetchData.jsx'
import { BASE_URL } from '../../config.js'
import Error from '../../components/Error/Error.jsx'
import Loading from '../../components/Loader/Loading.jsx'
import { formateDate } from '../../utils/formateDate.js'
import convertTime from '../../utils/convertTime.js'
import starIcon from '../../assets/images/Star.png'

const MyBookings = () => {
  const {
    data:appointments, 
    loading, 
    error,
  } = useFetchData(`${BASE_URL}/users/appointments/my-appointments`);

  return (
    <div>
      {loading && !error && <Loading/>}
      {error && !loading && <Error errMessage={error}/>}

      {!loading && !error && Array.isArray(appointments) && appointments.length > 0 && (
        <div className="grid grid-cols-1 gap-5">
          {appointments.map((doctor) => (
            <div key={doctor._id} className="p-3 lg:p-5 rounded-[12px] border border-[#d9dce2]">
              <div className="flex items-center mb-4">
                <img 
                  src={doctor.photo} 
                  alt={doctor.name}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <h3 className="text-[20px] leading-[28px] text-headingColor font-bold">
                  Dr. {doctor.name}
                </h3>
              </div>
              <div className='mt-2 lg:mt-4 flex items-center justify-between'>
                <span className='bg-[#CCF0F3] text-irisBlueColor py-1 px-2 lg:py-2 lg:px-6 text-[12px]
                leading-4 lg:text-[16px] lg:leading-7 font-semibold rounded'>
                    {doctor.specialization}
                </span>
                <div className="flex items-center gap-[6px]">
                    <span className="flex items-center gap-[6px] text-[14px] leading-6 lg:text-[16px]
                    lg:leading-7 font-semibold text-headingColor">
                        <img src={starIcon} alt=''/>
                        {Number(doctor.averageRating).toFixed(2)}
                    </span>
                    <span className="text-[14px] leading-6 lg:text-[16px] lg:leading-7 font-[400] 
                    text-textColor">
                        ({doctor.totalRating})
                    </span>
                </div>   
              </div>
              {doctor.appointmentInfo && (
                <div className="mt-4 p-4 bg-[#fff9ea] rounded-lg">
                  <h3 className="text-[18px] leading-[30px] text-headingColor font-semibold mb-2">
                    Appointment Details
                  </h3>
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-[14px] leading-6 font-medium text-textColor">Date:</p>
                      <p className="text-[16px] leading-6 font-semibold text-headingColor">
                        {formateDate(doctor.appointmentInfo.appointmentDate)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px] leading-6 font-medium text-textColor">Time:</p>
                      <p className="text-[16px] leading-6 font-semibold text-headingColor">
                        {doctor.appointmentInfo.appointmentTime ? 
                          `${convertTime(doctor.appointmentInfo.appointmentTime.startingTime)} - ${convertTime(doctor.appointmentInfo.appointmentTime.endingTime)}` :
                          'Not specified'
                        }
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px] leading-6 font-medium text-textColor">Day:</p>
                      <p className="text-[16px] leading-6 font-semibold text-headingColor">
                        {doctor.appointmentInfo.appointmentTime?.day || 'Not specified'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[14px] leading-6 font-medium text-textColor">Status:</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        doctor.appointmentInfo.status === 'approved' 
                          ? 'bg-green-100 text-green-800'
                          : doctor.appointmentInfo.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {doctor.appointmentInfo.status.charAt(0).toUpperCase() + doctor.appointmentInfo.status.slice(1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-[14px] leading-6 font-medium text-textColor">Price:</p>
                      <p className="text-[16px] leading-6 font-semibold text-headingColor">
                        {doctor.appointmentInfo.ticketPrice} LKR
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {!loading && !error && Array.isArray(appointments) && appointments.length === 0 && (
        <h2 className="mt-5 text-center leading-7 text-[20px] font-semibold text-primaryColor">
          You did not book any doctor yet!
        </h2>
      )}
    </div>
  );
};

export default MyBookings