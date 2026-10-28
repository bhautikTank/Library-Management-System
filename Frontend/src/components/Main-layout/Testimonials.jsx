import React from 'react'
import TestimonialsSection from './TestimonialsSection'

const Testimonials = () => {

    let reviewData = [
        {
            image: "https://images.unsplash.com/photo-1716393948658-083fd01656b1?q=80&w=1331&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Emily Carter",
            review: "BunnyBook has completely simplified our library operations. Searching, issuing, and returning books feels seamless and organized. The interface is clean, responsive, and easy to understand, making it very convenient for both students and librarians.",
            status: "Satisfied",
       },
        {
            image: "https://images.unsplash.com/photo-1688829388910-8c43a88d85a2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Rohan Mehta",
            review: "I really appreciate how efficiently BunnyBook manages book records and student data. The dashboard is intuitive and fast. It saves a lot of manual effort and reduces confusion during book issuing and tracking processes. It's a really good place.",
            status: "Excellent",
       },
        {
            image: "https://images.unsplash.com/photo-1623158266748-caaa0f0371fc?q=80&w=883&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Sophia Williams",
            review: "The reservation and fine calculation features in BunnyBook are extremely helpful. Everything works smoothly without errors. It provides a professional and modern experience that makes library management much more structured and reliable.",
            status: "Very Satisfied",
       },
        {
            image: "https://images.unsplash.com/photo-1691366338106-0bba46ae046c?q=80&w=1167&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Isabella Martinez",
            review: "I found BunnyBook very user-friendly and responsive across devices. The layout is clean, and the workflow is logical. It enhances productivity and creates a smooth experience for managing books and student information.",
            status: "Good",
       },
        {
            image: "https://images.unsplash.com/photo-1711185900590-b118146e3988?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            name: "Jenny Lawrence",
            review: "BunnyBook is a well-designed system that improves accuracy in maintaining records. The search functionality is quick and precise. It helps avoid duplication and makes tracking borrowed books very simple and efficient.",
            status: "Satisfied",
       },
    ]

    return (
        <div id="testimonials" className="w-full bg-[#221248] py-20">   

            <h1 className="text-center text-white text-3xl md:text-5xl font-bold mb-16">Testimonials</h1>

            <div className="scrollBarRemover flex flex-nowrap gap-6 md:gap-8 lg:gap-10 overflow-x-auto pb-6 mx-4 sm:mx-8 md:mx-55">

            {
                reviewData.map((elem, idx)=>{
                    return <TestimonialsSection key={idx} image={elem.image} name={elem.name} review={elem.review} status={elem.status}/>
                })
            }
            </div>
        </div>
    )
}

export default Testimonials