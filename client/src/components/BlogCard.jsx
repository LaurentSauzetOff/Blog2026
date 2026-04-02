import React from "react";
import { Link } from "react-router-dom"; // 1. On remplace useNavigate par Link
import PropTypes from "prop-types";

const BlogCard = ({ blog }) => {
  const { title, description = "", category, image, _id } = blog;

  return (
    <Link
      to={`/blog/${_id}`} // 2. Plus besoin de onClick, on utilise 'to'
      className="block w-full cursor-pointer rounded-lg overflow-hidden shadow hover:scale-102 hover:shadow-primary/25 duration-300 no-underline text-inherit"
    >
      {/* 3. Accessibilité : on donne un alt descriptif à l'image */}
      <img
        src={image}
        alt={`Couverture de l'article : ${title}`}
        className="aspect-video"
      />

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
    </Link>
  );
};

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
