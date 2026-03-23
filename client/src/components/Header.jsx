import React from "react";
import { assets } from "../assets/assets";

const Header = () => {
  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative">
      <div className="text-center mt-20 mb-8">
        <div className="inline-flex items-center justify-center gap-4 px-6 py-1.5 mb-4 border border-primary/40 bg-primary/10 rounded-full text-sm">
          <p>Nouveauté: fonctionnalité IA intégrée</p>
          <img src={assets.star_icon} className="w-2.5" alt="" />
        </div>

        <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-16 text-gray-700">
          LE blog sur la culture <br />{" "}
          <span style={{ color: "#00FF00" }}> pop </span> !
        </h1>

        <p className="my-6 sm:my-8 max-w-2xl m-auto max-sm:text-xs text-gray-500">
          PopCultureQuest est votre destination ultime pour tout ce qui concerne
          la culture pop. Plongez dans un univers de divertissement, de
          tendances et de découvertes avec nous !
        </p>

        <form className="flex justify-between max-w-lg max-sm:scale-75 mx-auto border border-gray-300 bg-white rounded overflow-hidden">
          <input
            type="text"
            className="w-full pl-4 outline-none"
            placeholder="Rechercher un article..."
            required
          />
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2 m-1.5 rounded hover:scale-105 transition-all cursor-pointer"
          >
            Rechercher
          </button>
        </form>
      </div>

      <img
        src={assets.gradientBackground}
        alt=""
        className="absolute -top-50 -z-1 opacity-50"
      />
    </div>
  );
};

export default Header;
