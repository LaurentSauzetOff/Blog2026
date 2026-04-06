import { assets, blogCategories } from "assets/assets";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Quill from "quill";
import { useAppContext } from "context/AppContext";
import toast from "react-hot-toast";
import { parse } from "marked";

const AddBlog = () => {
  const navigate = useNavigate();
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
  const [scheduledDate, setScheduledDate] = useState("");

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
        scheduledDate: isPublished ? null : scheduledDate,
      };

      const formData = new FormData();
      formData.append("blog", JSON.stringify(blog));
      formData.append("image", image);

      const { data } = await axios.post("/api/blog/add", formData);

      if (data.success) {
        toast.success(data.message);
        setImage(null); // Changé de false à null pour la cohérence
        setTitle("");
        setSubTitle("");
        quillRef.current.root.innerHTML = "";
        setCategory("Startup");
        navigate("/admin");
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
        {/* SECTION IMAGE */}
        <label htmlFor="image" className="block cursor-pointer">
          <p className="mb-2">Ajouter une image</p>
          <img
            src={image ? URL.createObjectURL(image) : assets.upload_area}
            alt="Couverture de l'article"
            className="h-16 rounded object-cover"
          />
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            required
          />
        </label>

        {/* SECTION TITRE */}
        <div className="mt-4">
          <label htmlFor="title" className="block font-medium">
            Titre de l'article
          </label>
          <input
            id="title"
            type="text"
            placeholder="Ecrivez ici..."
            required
            className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded text-foreground"
            onChange={(e) => setTitle(e.target.value)}
            value={title}
          />
        </div>

        {/* SECTION SOUS-TITRE */}
        <div className="mt-4">
          <label htmlFor="subtitle" className="block font-medium">
            Sous-titre de l'article
          </label>
          <input
            id="subtitle"
            type="text"
            placeholder="Ecrivez ici..."
            required
            className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
            onChange={(e) => setSubTitle(e.target.value)}
            value={subTitle}
          />
        </div>

        {/* SECTION DESCRIPTION (QUILL) */}
        <div className="mt-4">
          <p className="font-medium">Description</p>
          <div className="max-w-lg h-74 pb-16 sm:pb-10 pt-2 relative">
            <div ref={editorRef}></div>
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/10 mt-2 z-10">
                <div className="w-8 h-8 rounded-full border-2 border-t-primary animate-spin"></div>
              </div>
            )}
            <button
              disabled={loading}
              type="button"
              onClick={generateContent}
              className="absolute bottom-1 right-2 ml-2 text-xs text-dark-text bg-primary/70 px-4 py-1.5 rounded hover:underline cursor-pointer z-20"
            >
              Générer avec l'IA
            </button>
          </div>
        </div>

        {/* SECTION CATÉGORIE */}
        <div className="mt-4">
          <label htmlFor="category" className="block font-medium">
            Catégorie
          </label>
          <select
            id="category"
            onChange={(e) => setCategory(e.target.value)}
            value={category}
            name="category"
            className="mt-2 px-3 py-2 border text-dark-text border-gray-300 outline-none rounded text-foreground"
          >
            <option className="bg-background" value="">
              Sélectionner une catégorie
            </option>
            {blogCategories.map((item, index) => (
              <option className="bg-background" value={item} key={item + index}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* SECTION PUBLICATION */}
        <div className="flex items-center gap-2 mt-4">
          <label htmlFor="publish" className="cursor-pointer">
            Publier maintenant
          </label>
          <input
            id="publish"
            type="checkbox"
            checked={isPublished}
            className="scale-125 cursor-pointer"
            onChange={(e) => setIsPublished(e.target.checked)}
          />
        </div>

        {!isPublished && (
          <div className="mt-4">
            <label htmlFor="scheduledDate" className="block font-medium">
              Programmer la publication
            </label>
            <input
              id="scheduledDate"
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="mt-2 p-2 border border-gray-300 outline-none rounded text-foreground"
              min={new Date().toISOString().slice(0, 16)}
              required={!isPublished}
            />
            <p className="text-sm text-gray-500 mt-1">
              L'article sera automatiquement publié à la date et heure choisies
            </p>
          </div>
        )}

        <button
          disabled={isAdding}
          type="submit"
          className="mt-8 w-40 h-10 bg-primary text-dark-text rounded cursor-pointer text-sm font-bold active:scale-95 transition-transform"
        >
          {isAdding ? "Ajout..." : "Ajouter l'article"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
