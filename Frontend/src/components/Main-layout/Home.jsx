import React from "react";
import library from "../../assets/images/hero.jpg";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="relative w-full h-screen flex items-center justify-center text-center" id="home">
      {/* Library Image */}
      <img
        className="object-cover absolute inset-0 w-full h-full"
        src={library}
        alt="Library Background"
      />

      {/* Dark Overlay for transparent image */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"></div>

      {/* Hero section */}
      <div className="relative z-10 px-4 max-w-4xl mx-auto">
        <h1 className="text-[#D0BCFC] font-bold text-4xl sm:text-6xl md:text-7xl mb-6 tracking-tight">
          Welcome To BunnyBook
        </h1>

        <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Your modern digital sanctuary for discovering timeless books, reserving private reading spaces, and elevating your learning journey.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link to="/search">
            <button className="w-full sm:w-auto bg-[#A99AD3] text-[#05051B] hover:bg-[#C4B5E6] rounded-xl active:scale-95 px-8 py-3.5 font-bold text-lg cursor-pointer transition shadow-xl shadow-[#A99AD3]/20">
              Explore Library Catalog
            </button>
          </Link>
          <Link to="/reserve-slot">
            <button className="w-full sm:w-auto bg-[#05051B]/80 text-[#A99AD3] border border-[#A99AD3]/40 hover:bg-[#755CBB]/30 rounded-xl active:scale-95 px-8 py-3.5 font-bold text-lg cursor-pointer transition backdrop-blur-md">
              Reserve Reading Slot
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
