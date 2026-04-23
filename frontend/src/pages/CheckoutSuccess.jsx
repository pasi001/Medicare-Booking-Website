import {Link} from 'react-router-dom'

const CheckoutSuccess = () => {
    return (
        <div className="bg-gray-100 h-screen">
            <div className="bg-white p-6 md:mx-auto">
                <svg
                  viewBox='0 0 24 24'
                  className='text-green-600 w-16 h-16 mx-auto my-6'
                >
                    <path
                      fill='currentColor'
                      d='M 12 2 C 6.4830714 2 2 6.4830754 2 12 C 2 17.516925 6.4830714 22 12 22 C 17.516929 22 22 17.516925 22 12 C 22 6.4830754 17.516929 2 12 2 z M 16.498047 9 C 16.626047 9 16.754063 9.0489844 16.851562 9.1464844 C 17.046563 9.3414844 17.048516 9.6575156 16.853516 9.8535156 L 10.853516 15.853516 C 10.755516 15.950516 10.628 16 10.5 16 C 10.372 16 10.244484 15.950516 10.146484 15.853516 L 7.1464844 12.853516 C 6.9514844 12.658516 6.9514844 12.341484 7.1464844 12.146484 C 7.3414844 11.951484 7.6585156 11.951484 7.8535156 12.146484 L 10.498047 14.792969 L 16.144531 9.1464844 C 16.242031 9.0489844 16.370047 9 16.498047 9 z'>
                    </path>
                </svg>
                <div className="text-center">
                    <h3 className="md:text-2xl text-base text-gray-900 font-semibold text-center">
                        Payment Done!
                    </h3>
                    <p className="text-gray-600 my-2">
                        Thank you for completing your secure online payment. 
                    </p>
                    <p>Have a great day!</p>
                    <div className="py-10 text-center">
                        <Link
                          to='/home'
                          className="px-12 bg-buttonBgColor text-white font-semibold py-3"
                        >
                            Go Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CheckoutSuccess