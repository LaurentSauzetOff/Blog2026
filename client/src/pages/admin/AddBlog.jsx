import { assets } from "assets/assets";
import React, {useState} from "react";

const AddBlog = () => {

const [image, setImage] = useState(false);
const [title, setTitle] = useState('');
const [subTitle, setSubTitle] = useState('');
const [category, setCategory] = useState('Startup');
const [isPublished, setIsPublished] = useState(false);

const onSubmitHandler = async (e) => {
  e.preventDefault();
}



  return (
    <form onSubmit={onSubmitHandler} className="flex-1 bg-blue-50/50 text-dark-text h-full overflow-scroll">
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Ajouter une image</p>
        <label htmlFor="image">
          <img src={assets.upload_area} alt=""  className="mt-2 h-16 rounded cursor-pointer"/>
          <input type="file" id="image"  hidden required/>
        </label>
      </div>
    </form>
  );
};

export default AddBlog;
