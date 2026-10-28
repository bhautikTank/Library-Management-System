import React from 'react'

const TestimonialsSection = (props) => {
  return (
    <div className="shrink-0 flex flex-nowrap">

                {/* card div */}
                 <div className="shrink-0 bg-white w-full max-w-sm p-6 rounded-xl duration-300 hover:scale-[1.02]">
                    {/* Top part of the card */}
                    <div className="flex justify-center items-center gap-6 pb-6">
                        <img src={props.image} alt="/"
                        className="h-30 w-30 object-cover rounded-full" />
                        <h1 className="text-2xl font-bold">{props.name}</h1>
                    </div>
                    {/* Bottom part of the card */}
                    <div className="flex flex-col px-6 items-center gap-10">
                        <p className="leading-relaxed text-gray-500 pb-10">{props.review}</p>
                        <button className="px-5 py-2 text-2xl text-white font-semibold bg-blue-950 hover:bg-blue-900 cursor-pointer rounded-lg">{props.status}</button>
                    </div>
                </div>

    </div>
  )
}

export default TestimonialsSection