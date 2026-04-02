import React from "react";
import { assets } from "./../assets/assets";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

const Navbar = () => {

  const {navigate, token} = useAppContext()
  return (
    <div className="flex justify-between items-center py-5 px-8 sm:mx-20 xl:mx-32 ">
      <div className="flex items-center">
        <img
          onClick={() => navigate("/")}
          src={assets.logo}
          alt="Logo"
          className="w-32 sm:w-44 cursor-pointer"
        />
        <h1>PopCultureQuest</h1>
      </div>
      <button
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-dark-text px-10 py-2.5"
      >
        {token ? 'Tableau de bord' : 'Login'}
        <img src={assets.arrow} className="w-3 text-dark-text" alt="arrow" />
      </button>
    </div>
  );
};

export default Navbar;
