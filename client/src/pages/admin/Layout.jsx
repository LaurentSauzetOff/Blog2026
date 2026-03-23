import React from "react";
import { assets } from "../../assets/assets";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const logout = () => {
    navigate("/");
  };

  return (
    <>
      <div className="flex items-center justify-between py-5 px-8 sm:px-12 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <img
            src={assets.logo}
            alt=""
            className="w-32 sm:w-44 cursor-pointer"
            onClick={() => navigate("/")}
          />
          <h1>PopCultureQuest</h1>
        </div>
        <button
          onClick={logout}
          className="text-sm px-8 py-2 bg-primary text-white rounded-full cursor-pointer"
        >
          Logout
        </button>
      </div>
    </>
  );
};

export default Layout;
