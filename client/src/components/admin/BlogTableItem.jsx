import { assets } from "assets/assets";
import { useAppContext } from "context/AppContext";
import React, { useState } from "react";
import toast from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { axios } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { title, createdAt, isPublished, _id } = blog;
  const BlogDate = new Date(createdAt);

  // Fonction pour changer le statut de publication
  const togglePublish = async () => {
    try {
      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Logique de suppression avec modale
  const confirmDelete = async () => {
    setIsModalOpen(false);
    try {
      const { data } = await axios.post("/api/blog/delete", { id: _id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <tr className="border-y border-gray-300">
        <th className="px-2 py-4">{index}</th>
        <td className="px-2 py-4">{title}</td>

        {/* Colonne Date */}
        <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>

        {/* Colonne Statut (Celle qui manquait !) */}
        <td className="px-2 py-4 max-sm:hidden">
          <p
            className={`${isPublished ? "text-green-600" : "text-orange-700"} font-medium`}
          >
            {isPublished ? "Published" : "Unpublished"}
          </p>
        </td>

        {/* Colonne Actions (Toggle + Delete) */}
        <td className="px-2 py-4 flex items-center text-xs gap-3">
          <button
            onClick={togglePublish}
            className="border px-2 py-0.5 rounded cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>

          <img
            onClick={() => setIsModalOpen(true)}
            src={assets.cross_icon}
            className="w-8 hover:scale-110 transition-all cursor-pointer"
            alt="Supprimer"
          />
        </td>
      </tr>

      {/* Ma modale de validation (Invisible par défaut) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="bg-white p-6 rounded-lg shadow-2xl max-w-sm w-full mx-4 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800">Attention !</h2>
            <p className="mt-2 text-gray-600 leading-relaxed">
              Êtes-vous sûr de vouloir supprimer cet article ? <br />
              <span className="text-sm font-medium text-primary">
                "Non mais allo quoi !"
              </span>
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm transition-colors"
              >
                Confirmer la suppression
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogTableItem;
