import { createContext, useContext, useEffect, useState, useMemo } from "react"; // Ajout de useMemo
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [input, setInput] = useState("");

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      if (data.success) {
        setBlogs(data.blogs);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      axios.defaults.headers.common["Authorization"] = `${storedToken}`;
    }
    fetchBlogs();
  }, []);

  // --- FIX SONARCLOUD : Mémorisation de l'objet value ---
  const value = useMemo(
    () => ({
      axios,
      navigate,
      token,
      setToken,
      blogs,
      setBlogs,
      input,
      setInput,
    }),
    [token, blogs, input, navigate],
  );
  // On liste les dépendances qui, si elles changent, doivent mettre à jour le contexte.
  // -----------------------------------------------------

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

AppProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAppContext = () => {
  return useContext(AppContext);
};
