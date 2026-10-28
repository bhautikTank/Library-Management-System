import React from 'react'
import img1 from "../../assets/images/about-us1.jpg"
import img2 from "../../assets/images/about-us2.jpg"
import img3 from "../../assets/images/about-us3.jpg"
import AboutSection from './AboutSection'

const Aboutus = () => {

    const aboutData = [
        {
            "image": img1,
            "title": "Our Mission",
            "description": "We provide a quiet and productive environment for students. Our goal is to make reading and learning accessible to everyone."
        },
        {
            "image": img2,
            "title": "Our Environment",
            "description": "We maintain a hygienic, peaceful and modern study space with supportive staff and updated resources.",
            "reverse": "true"
        },
        {
            "image": img3,
            "title": "Our Community",
            "description": "BunnyBook connects readers, learners and knowledge seekers in a friendly and inspiring atmosphere."
        },

    ]

    return (
        <div className="w-full bg-[#05051B] py-20" id="about">

            <div className='max-w-7xl mx-auto px-6 md:px-12'>

                <h1 className="text-center text-white text-3xl md:text-5xl font-bold mb-16">About Us</h1>

                {
                    aboutData.map(
                        (elem, idx) => {
                            return <div key={idx}>
                                <AboutSection image={elem.image} title={elem.title} description={elem.description} reverse={elem.reverse} />
                            </div>
                        }
                    )
                }

            </div>
        </div>
    )
}

export default Aboutus