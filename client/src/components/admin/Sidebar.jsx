import { assets } from "../../assets/assets";
import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  // Petite astuce : on définit la classe de base une seule fois pour éviter les répétitions
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 py-3.5 px-3 md:px-9 md:min-w-64 cursor-pointer transition-all ${
      isActive
        ? "bg-primary text-dark-text"
        : "text-foreground-600 hover:bg-primary hover:text-dark-text"
    }`;

  return (
    <nav className="flex flex-col border-r border-gray-200 min-h-full pt-6 bg-background">
      {/* 1. Tableau de bord */}
      <NavLink to="/admin" end={true} className={navLinkClass}>
        <img src={assets.home_icon} className="min-w-4 w-5" alt="" />
        <p className="hidden md:inline-block">Tableau de bord</p>
      </NavLink>

      {/* 2. Ajouter article */}
      <NavLink to="/admin/addBlog" className={navLinkClass}>
        <img src={assets.add_icon} className="min-w-4 w-5" alt="" />
        <p className="hidden md:inline-block">Ajouter article</p>
      </NavLink>

      {/* 3. Liste des articles */}
      <NavLink to="/admin/listBlog" className={navLinkClass}>
        <img src={assets.list_icon} className="min-w-4 w-5" alt="" />
        <p className="hidden md:inline-block">Liste des articles</p>
      </NavLink>

      {/* 4. Commentaires */}
      <NavLink to="/admin/comments" className={navLinkClass}>
        <img src={assets.comment_icon} className="min-w-4 w-5" alt="" />
        <p className="hidden md:inline-block">Commentaires</p>
      </NavLink>
    </nav>
  );
};

export default Sidebar;
