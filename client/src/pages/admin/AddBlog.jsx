import { assets, blogCategories } from "assets/assets";
import React, { useEffect, useRef, useState } from "react";
import Quill from "quill";
import { useAppContext } from "context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";
import { div } from "motion/react-client";

const AddBlog = () => {
  const { axios } = useAppContext();
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef(null);
  const quillRef = useRef(null);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  const generateContent = async () => {
    if (!title) return toast.error("Vous devez entrer un titre");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", {
        prompt: title,
      });
      if (data.success) {
        quillRef.current.root.innerHTML = parse(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

 /*  const generateContent = async () => {
    if (!title) return toast.error("Vous devez entrer un titre");
    try {
      setLoading(true);
      const { data } = await axios.post("/api/blog/generate", {
        prompt: title,
      });

      console.log("Réponse du serveur :", data); // <--- AJOUTE CECI

      if (data.success) {
        const htmlContent = parse(data.content);
        console.log("HTML parsé :", htmlContent); // <--- ET CECI

        if (quillRef.current) {
          quillRef.current.clipboard.dangerouslyPasteHTML(htmlContent);
        }
      } else {
        // Si on arrive ici, c'est que le backend a dit success: false
        toast.error(data.message || "Le serveur a refusé la génération");
      }
    } catch (error) {
      console.error("Erreur Axios :", error);
      toast.error("Problème de connexion au serveur");
    } finally {
      setLoading(false);
    }
  }; */

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      const blog = {
        title,
        subTitle,
        description: quillRef.current.root.innerHTML,
        category,
        isPublished,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(false);
        setTitle("");
        quillRef.current.root.innerHMLT = "";
        setCategory("Startup");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, { theme: "snow" });
    }
  }, []);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-background-50/50 text-dark-text h-full overflow-scroll"
    >
      <div className="bg-background text-foreground w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Ajouter une image</p>
        <label htmlFor="image">
          <img
            src={!image ? assets.upload_area : URL.createObjectURL(image)}
            alt=""
            className="mt-2 h-16 rounded cursor-pointer"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        <p className="mt-4">Titre de l'article</p>
        <input
          type="text"
          placeholder="Ecrivez ici..."
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded text-foreground"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className="mt-4">Sous-titre de l'article</p>
        <input
          type="text"
          placeholder="Ecrivez ici..."
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className="mt-4">Description</p>
        <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
          <div ref={editorRef}></div>
          {loading && (
            <div className="absolute right-0 top-0 bottom-0 left-0 flex items-center justify-center bg-red mt-2"> 
              <div className="w-8 h-8 rounded-full border-2 border-t-white animate-spin">

              </div>
            </div>
          )}
          <button
            disabled={loading}
            type="button"
            onClick={generateContent}
            className="absolute bottom-1 right-2 ml-2 text-xs text-dark-text bg-primary/70 px-4 py-1.5 rounded hover:underline cursor-pointer"
          >
            Générer avec l'IA
          </button>
        </div>

        <p className="mt-4">Catégorie</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          name="category"
          className="mt-2 px-3 py-2 border text-dark-text border-gray-300 outline-none rounded text-foreground"
        >
          <option className="bg-background" value="">
            Sélectionner une catégorie
          </option>
          {blogCategories.map((item, index) => {
            return (
              <option className="bg-background" value={item} key={index}>
                {item}
              </option>
            );
          })}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publier maintenant</p>
          <input
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-dark-text rounded cursor-pointer text-sm"
        >
          {isAdding ? "Ajout..." : "Ajouter l'article"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
