import { assets } from "assets/assets";
import { useAppContext } from "context/AppContext";
import React from "react";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { axios } = useAppContext();

  // Déstructuration sécurisée
  const { blog, createdAt, _id, name, content, isApproved } = comment;
  const BlogDate = new Date(createdAt);

  const approveComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/approve-comment", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const deleteComment = async () => {
    try {
      const confirm = globalThis.confirm(
        "Êtes-vous sûr de vouloir supprimer ce commentaire ?",
      );
      if (!confirm) return;

      const { data } = await axios.post("/api/admin/delete-comment", {
        id: _id,
      });
      if (data.success) {
        toast.success(data.message);
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <tr className="border-y border-gray-300">
      <td className="px-6 py-4">
        <b className="font-medium text-foreground-600">Article</b> :{" "}
        {blog.title}
        <br />
        <br />
        <b className="font-medium text-foreground-600">Nom</b> : {name}
        <br />
        <b className="font-medium text-foreground-600">Commentaire</b> :{" "}
        {content}
      </td>
      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>
      <td className="px-6 py-4">
        <div className="inline-flex items-center gap-4">
          {/* FIX SONARCLOUD : On retire le '!' et on inverse les blocs */}
          {isApproved ? (
            <p className="text-xs border border-green-600 bg-green-100 text-green-600 rounded-full px-3 py-1">
              Validé
            </p>
          ) : (
            <button
              onClick={approveComment}
              className="cursor-pointer hover:scale-110 transition-all p-1"
              title="Approuver le commentaire"
              aria-label="Approuver le commentaire"
            >
              <img src={assets.tick_icon} className="w-5" alt="" />
            </button>
          )}

          <button
            onClick={deleteComment}
            className="cursor-pointer hover:scale-110 transition-all p-1"
            title="Supprimer le commentaire"
            aria-label="Supprimer le commentaire"
          >
            <img src={assets.bin_icon} className="w-5 invert" alt="" />
          </button>
        </div>
      </td>
    </tr>
  );
};

CommentTableItem.propTypes = {
  comment: PropTypes.shape({
    blog: PropTypes.shape({
      title: PropTypes.string.isRequired,
    }).isRequired,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]).isRequired,
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    isApproved: PropTypes.bool.isRequired,
  }).isRequired,
  fetchComments: PropTypes.func.isRequired,
};

export default CommentTableItem;
