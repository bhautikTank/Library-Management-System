import React, { useEffect } from 'react'
import AOS from "aos";
import "aos/dist/aos.css";

const AboutSection = (props) => {

  useEffect(()=>{
    AOS.init({duration:1000})
  }, [])

  return (
    <div data-aos="fade-up" className={`flex flex-col md:flex-row ${
        props.reverse ? "md:flex-row-reverse" : ""
      } items-center gap-10 mb-16`}
      >

      {/* for images in the aboutsec */}
      <div className="w-full md:w-1/2">
        <img className="w-full h-64 md:h-80 object-cover rounded-2xl shadow-xl" src={props.image} alt={props.title} />
      </div>

      {/* for title and description in about section */}
      
      <div className="w-full md:w-1/2 text-left">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">{props.title}</h2>
        <p className="text-gray-200 leading-relaxed">{props.description}</p>
      </div>


    </div>
  )
}

export default AboutSection