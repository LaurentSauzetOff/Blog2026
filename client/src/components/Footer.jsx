import React from "react";
import { assets, footer_data } from "../assets/assets";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3">
      <div className="flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-foreground-500">
        <div>
          <img
            src={assets.logo}
            alt="Logo PopCultureQuest"
            className="w-32 sm:w-44"
          />
          <p className="max-w-[410px] mt-6 text-sm">
            Votre source préférée pour explorer la Pop Culture. Suivez nos
            analyses, critiques et actualités quotidiennement.
          </p>
        </div>

        <div className="flex flex-wrap justify-between w-full md:w-[45%] gap-5">
          {footer_data.map((section, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base text-foreground-900 md:mb-5 mb-2">
                {section.title}
              </h3>
              <ul
                className={`flex ${section.title === "Suivez-nous" ? "flex-row gap-4" : "flex-col space-y-1"}`}
              >
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      className="hover:underline transition hover:text-primary"
                      to="#" // Garde # pour l'instant pour satisfaire SonarCloud
                    >
                      {/* LOGIQUE DE VÉRIFICATION : */}
                      {typeof link === "string" ? (
                        // Si c'est du texte, on l'affiche normalement
                        <span>{link}</span>
                      ) : (
                        // Si c'est une icône (objet/path), on affiche une image
                        <img
                          src={link}
                          alt="Réseau social"
                          className="w-6 h-6"
                        />
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <p className="py-4 text-center text-sm md:text-base text-foreground-500">
        © {new Date().getFullYear()} PopCultureQuest - Tous droits réservés
      </p>
    </footer>
  );
};

export default Footer;
