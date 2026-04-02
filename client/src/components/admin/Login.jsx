import { useAppContext } from "../../context/AppContext";
import React, { useRef } from "react";
import toast from "react-hot-toast";

const Login = () => {
  const { axios, setToken } = useAppContext();

  const emailRef = useRef(null);
  const passwordRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const { data } = await axios.post("/api/admin/login", {
        email,
        password,
      });

      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
        axios.defaults.headers.common["Authorization"] = data.token;
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 max-md:m-6 border border-primary/30 shadow-xl shadow-primary/15 rounded-lg">
        <div className="flex flex-col items-center justify-center">
          <div className="w-full py-6 text-center">
            <h1 className="text-3xl font-bold">
              <span className="text-primary">Admin</span> login
            </h1>
            <p className="font-light">
              Entrez vos identifiants pour accéder à votre espace administrateur
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 w-full sm:max-w-md text-foreground-600"
          >
            <div className="flex flex-col">
              {/* 1. Liaison du label Email */}
              <label htmlFor="email">Email</label>
              <input
                id="email" // L'id doit correspondre au htmlFor
                ref={emailRef}
                type="email"
                required
                placeholder="Votre adresse mail"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6 focus:border-primary transition-colors"
              />
            </div>

            <div className="flex flex-col">
              {/* 2. Liaison du label Mot de passe */}
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password" // L'id doit correspondre au htmlFor
                ref={passwordRef}
                type="password"
                required
                placeholder="Votre mot de passe"
                className="border-b-2 border-gray-300 p-2 outline-none mb-6 focus:border-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 font-medium bg-primary text-white rounded cursor-pointer hover:bg-primary/90 transition-all active:scale-[0.98]"
            >
              Connexion
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
