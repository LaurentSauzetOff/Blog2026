import { assets } from "assets/assets";
import { useAppContext } from "context/AppContext";
import React, { useState } from "react"; // On ajoute useState
import toast from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { axios } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false); // État pour la modale

  // 1. Cette fonction ouvre juste la modale (Action ultra rapide pour Vercel)
  const openConfirm = () => setIsModalOpen(true);

  // 2. La vraie logique de suppression
  const confirmDelete = async () => {
    setIsModalOpen(false); // On ferme la modale
    try {
      const { data } = await axios.post("/api/blog/delete", { id: blog._id });
      if (data.success) {
        toast.success(data.message);
        await fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Erreur lors de la suppression");
    }
  };

  return (
    <>
      <tr className="border-y border-gray-300">
        <th className="px-2 py-4">{index}</th>
        <td className="px-2 py-4">{blog.title}</td>
        <td className="px-2 py-4 max-sm:hidden">
          {new Date(blog.createdAt).toDateString()}
        </td>
        <td className="px-2 py-4 max-sm:hidden text-center">
          <button
            onClick={openConfirm} // On appelle l'ouverture de la modale
            className="hover:scale-110 transition-all cursor-pointer"
          >
            <img src={assets.cross_icon} className="w-8" alt="Supprimer" />
          </button>
        </td>
      </tr>

      {/* MODALE DE CONFIRMATION PERSONNALISÉE */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full mx-4 text-dark-text">
            <h2 className="text-xl font-bold text-gray-800">Confirmation</h2>
            <p className="mt-2 text-gray-600">
              Êtes-vous sûr de vouloir supprimer cet article ? <br />
              <span className="text-xs italic text-gray-400">
                "Non mais allo quoi !"
              </span>
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BlogTableItem;
