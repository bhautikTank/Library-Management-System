import Logo from '../../assets/Logo.png'
import 'remixicon/fonts/remixicon.css'

const Footer = () => {
  return (
    <div className="bg-gray-950 text-gray-400">

      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-0 h-auto sm:h-16 py-4 sm:py-0 px-4 sm:px-6 lg:px-8">

        {/* logo and copyright */}
        <div className="flex flex-col sm:flex-row items-center font-medium text-lg gap-3 sm:gap-4">
          <img className="h-10 sm:h-12 w-auto" src={Logo} alt="bunnyBookLogo" />
          <p className="text-base sm:text-lg">&copy; 2026 BunnyBook <span className="text-gray-500">All rights reserved.</span></p>
        </div>

          {/* social links */}
        <div className="flex gap-5 sm:gap-6 text-xl sm:text-2xl">
          <div className="hover:text-gray-100 cursor-pointer transition-colors">
            <i className="ri-facebook-fill"></i>
          </div>
          <div className="hover:text-gray-100 cursor-pointer transition-colors">
            <i className="ri-instagram-fill"></i>
          </div>
          <div className="hover:text-gray-100 cursor-pointer transition-colors">
            <i className="ri-twitter-fill"></i>
          </div>
          <div className="hover:text-gray-100 cursor-pointer transition-colors">
            <i className="ri-reddit-2-fill"></i> 
          </div>
          <div className="hover:text-gray-100 cursor-pointer transition-colors">
            <i className="ri-linkedin-fill"></i>     
          </div>
        </div>

      </div>

    </div>
  )
}

export default Footer