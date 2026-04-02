import React from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types"; // 1. On importe la validation

const BlogCard = ({ blog }) => {
  // 2. Petite astuce fiabilité : on s'assure que description existe avant de "slicer"
  const { title, description = "", category, image, _id } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full cursor-pointer rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300"
    >
      <img src={image} alt="" className="aspect-video" />
      <span className="ml-5 mt-4 px-3 py-1 inline-block bg-primary/20 rounded-full text-primary text-xs">
        {category}
      </span>
      <div className="p-5">
        <h5 className="mb-2 font-medium text-xs text-foreground-900">
          {title}
        </h5>
        <p
          className="mb-3 text-xs text-foreground-600"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 80) }}
        ></p>
      </div>
    </div>
  );
};

// 3. LA FIX SONARCLOUD : On définit le schéma attendu
BlogCard.propTypes = {
  blog: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    category: PropTypes.string,
    image: PropTypes.string,
    _id: PropTypes.string.isRequired,
  }).isRequired,
};

export default BlogCard;
