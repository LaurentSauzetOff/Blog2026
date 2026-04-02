import { assets } from "assets/assets";
import { useAppContext } from "context/AppContext";
import React, { useState } from "react";
import PropTypes from "prop-types"; // 1. Import indispensable
import toast from "react-hot-toast";

const BlogTableItem = ({ blog, fetchBlogs, index }) => {
  const { axios } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sécurité : on s'assure que blog existe
  const { title, createdAt, isPublished, _id } = blog;
  const BlogDate = new Date(createdAt);

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

        <td className="px-2 py-4 max-sm:hidden">{BlogDate.toDateString()}</td>

        <td className="px-2 py-4 max-sm:hidden">
          <p
            className={`${isPublished ? "text-green-600" : "text-orange-700"} font-medium`}
          >
            {isPublished ? "Published" : "Unpublished"}
          </p>
        </td>

        <td className="px-2 py-4 flex items-center text-xs gap-3">
          <button
            onClick={togglePublish}
            className="border px-2 py-0.5 rounded cursor-pointer hover:bg-gray-50 transition-colors"
          >
            {isPublished ? "Unpublish" : "Publish"}
          </button>

          {/* 2. Accessibilité : On remplace le onClick sur l'image par un bouton invisible */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="cursor-pointer hover:scale-110 transition-transform p-1"
            title="Supprimer l'article"
            aria-label="Supprimer l'article"
          >
            <img src={assets.cross_icon} className="w-6" alt="" />
          </button>
        </td>
      </tr>

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
                className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-md transition-colors cursor-pointer"
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm transition-colors cursor-pointer"
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

// 3. VALIDATION DES PROPS (La partie que SonarCloud attendait)
BlogTableItem.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
    isPublished: PropTypes.bool.isRequired,
    _id: PropTypes.string.isRequired,
  }).isRequired,
  fetchBlogs: PropTypes.func.isRequired,
  index: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default BlogTableItem;
// it's ok