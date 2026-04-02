import React from "react";
import { assets } from "./../assets/assets";
import { Link } from "react-router-dom"; // 1. On utilise Link pour la navigation
import { useAppContext } from "../context/AppContext";

const Navbar = () => {
  const { token } = useAppContext(); // On n'a plus besoin de 'navigate' pour le logo

  return (
    <nav className="flex justify-between items-center py-5 px-8 sm:mx-20 xl:mx-32">
      {/* 2. On enveloppe le logo ET le titre dans un Link pour une meilleure UX */}
      <Link
        to="/"
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        aria-label="Retour à l'accueil"
      >
        <h1 className="text-3xl tracking-tight font-bold">PopCultureQuest</h1>
      </Link>

      {/* 3. Pour le bouton Admin, Link est aussi préférable à onClick pour le SEO */}
      <Link
        to="/admin"
        className="flex items-center gap-2 rounded-full text-sm bg-primary text-dark-text px-10 py-2.5 hover:bg-primary/90 transition-all active:scale-95"
      >
        {token ? "Tableau de bord" : "Login"}
        <img src={assets.arrow} className="w-3" alt="" />
      </Link>
    </nav>
  );
};

export default Navbar;
