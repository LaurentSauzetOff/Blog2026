import fs from "fs";
import imagekit from "../configs/imageKit.js";
import path from "path";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog,
    );
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blog_images",
    });

    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "1280", height: "720", crop: "maintain_ratio" },
        { compression: "auto" },
      ],
    });

    const image = optimizedImageUrl;

    await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    res.json({
      success: true,
      message: "Article ajouté avec succès",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({
      success: true,
      blogs,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogById = async (req, res) => {
  try {
    // Sécurisation : on force blogId en chaîne de caractères
    const blogId = String(req.params.blogId);
    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.json({ success: false, message: "Article non trouvé" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    // Sécurisation : on force l'ID en String pour éviter les objets malveillants
    const id = String(req.body.id);

    await Blog.findByIdAndDelete(id);
    // C'est ici que SonarCloud bloquait !
    await Comment.deleteMany({ blog: id });

    res.json({ success: true, message: "Article supprimé avec succès" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const id = String(req.body.id);
    const blog = await Blog.findById(id);
    if (!blog) return res.json({ success: false, message: "Blog non trouvé" });

    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({ success: true, message: "Statut mis à jour" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { blog, name, content } = req.body;
    await Comment.create({ blog, name, content });
    res.json({
      success: true,
      message: "Commentaire ajouté avec succès",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    // Sécurisation ici aussi
    const blogId = String(req.body.blogId);
    const comments = await Comment.find({
      blog: blogId,
      isApproved: true,
    }).sort({ createdAt: -1 });

    res.json({ success: true, comments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    const content = await main(
      prompt +
        "Générez de façon simple un contenu pour cet article au format texte",
    );
    res.json({ success: true, content });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
