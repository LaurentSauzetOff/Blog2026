import { comments_data } from "assets/assets";
import CommentTableItem from "components/admin/CommentTableItem";
import React, { useEffect, useState } from "react";

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [filter, setFilter] = useState("not approved");

  const fetchComments = async () => {
    setComments(comments_data);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center max-w-3xl">
        <h1>Commentaires</h1>
        <div className="flex gap-3">
          <button
            onClick={() => setFilter("Approved")}
            className="{`shadow-custom-sm border rounded-full px-4 py-1 curssor-pointer text-xs ${filter === 'Approved' ? 'text-primary' : 'text-gray-700'}`}"
          >
            Validé
          </button>
          <button
            onClick={() => setFilter("Not Approved")}
            className="{`shadow-custom-sm border rounded-full px-4 py-1 curssor-pointer text-xs ${filter === 'Not Approved' ? 'text-primary' : 'text-gray-700'}`}"
          >
            Non validé
          </button>
        </div>
      </div>

      <div className="relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white">
        <table className="w-full text-sm text-gray-500">
          <thead className="text-xs text-gray-700 text-left uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Titre de l'article et commentaires
              </th>
              <th scope="col" className="px-6 py-3 max-sm:hidden">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {comments.filter((comment) => {
              if (filter === "Approved") return comment.isApproved === true;
              return comment.isApproved === false;
            }).map((comment) => <CommentTableItem key={comment._id} comment={comment} fetchComments={fetchComments}/>)}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
