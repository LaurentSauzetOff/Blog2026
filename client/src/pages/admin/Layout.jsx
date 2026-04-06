import React from "react";
import { assets } from "../../assets/assets";
import { Outlet, Link } from "react-router-dom"; // 1. On utilise Link
import Sidebar from "../../components/admin/Sidebar";
import { useAppContext } from "context/AppContext";

const Layout = () => {
  const { axios, setToken, navigate } = useAppContext();

  const logout = () => {
    localStorage.removeItem("token");
    axios.defaults.headers.common["Authorization"] = null;
    setToken(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* 2. Utilisation de la balise <header> pour la sémantique */}
      <header className="flex items-center justify-between py-5 px-8 sm:px-12 border-b border-gray-200 bg-background">
        {/* 3. On enveloppe le logo et le texte dans un seul Link */}
        <Link
          to="/"
          className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-opacity"
          aria-label="Retour à l'accueil du site"
        >
          <img
            src={assets.logo}
            alt="" // Alt vide car le titre juste après est explicite
            className="w-16 h-16 sm:w-20 sm:h-20 object-contain"
          />
          {/* Style du logo textuel comme demandé précédemment */}
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            PopCultureQuest
          </h1>
        </Link>

        <button
          onClick={logout}
          className="text-sm px-8 py-2 bg-primary text-dark-text rounded-full cursor-pointer hover:bg-primary/90 transition-colors font-medium"
        >
          Logout
        </button>
      </header>

      {/* 4. Contenu principal avec la Sidebar */}
      <div className="flex h-[calc(100vh-100px)]">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
