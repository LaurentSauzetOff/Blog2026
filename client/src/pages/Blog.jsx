import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { assets, blog_data } from "../assets/assets";
import Moment from "moment";

const Blog = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const fetchBlogData = async () => {
    const data = blog_data.find((item) => item._id === id);
    setData(data);
  };
  useEffect(() => {
    fetchBlogData();
  }, []);
  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        className="absolute -top-50 -z-1 opacity-50"
        alt=""
      />
      <Navbar />
      <div>
        <p>Publié le {Moment(data.CreatedAt).format("DD/MMMM/YYYY")}</p>
        <h1>{data.title}</h1>
        <h2>{data.subtitle}</h2>
        <p>Laurent Sauzet</p>
      </div>
      <div></div>
    </div>
  ) : (
    <div>Loading...</div>
  );
};

export default Blog;
