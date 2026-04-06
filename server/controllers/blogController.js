import fs from "node:fs";
import mongoose from "mongoose";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";
import main from "../configs/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished, scheduledDate } = JSON.parse(
      req.body.blog,
    );
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.json({
        success: false,
        message: "Tous les champs sont requis",
      });
    }

    if (!isPublished && !scheduledDate) {
      return res.json({
        success: false,
        message: "Veuillez programmer une date de publication ou publier maintenant",
      });
    }

    let fileBuffer;
    try {
      fileBuffer = fs.readFileSync(imageFile.path);
    } catch (err) {
      return res.json({
        success: false,
        message: "Impossible de lire le fichier image",
      });
    }

    let response;
    try {
      response = await imagekit.upload({
        file: fileBuffer,
        fileName: imageFile.originalname,
        folder: "/blog_images",
      });
    } catch (err) {
      // Nettover le fichier temporaire en cas d'erreur d'upload
      try {
        fs.unlinkSync(imageFile.path);
      } catch (cleanupErr) {
        // Ignorer les erreurs de nettoyage
      }
      return res.json({
        success: false,
        message: "Erreur lors de l'upload de l'image. Réessayez.",
      });
    }

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

    try {
      await Blog.create({
        title,
        subTitle,
        description,
        category,
        image,
        isPublished,
        scheduledDate: scheduledDate ? new Date(scheduledDate) : null,
      });
    } catch (err) {
      // Nettoyer le fichier temporaire en cas d'erreur de création
      try {
        fs.unlinkSync(imageFile.path);
      } catch (cleanupErr) {
        // Ignorer les erreurs de nettoyage
      }
      return res.json({
        success: false,
        message: "Erreur lors de la création de l'article. Réessayez.",
      });
    }

    // Nettoyer le fichier temporaire après succès
    try {
      fs.unlinkSync(imageFile.path);
    } catch (cleanupErr) {
      // Ignorer les erreurs de nettoyage
    }

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
    const blogId = req.params.blogId;

    // Valider que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.json({ 
        success: false, 
        message: "Article non trouvé" 
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.json({ success: false, message: "Article non trouvé" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    res.json({ success: false, message: "Article non trouvé" });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const id = req.body.id;

    // Valider que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ 
        success: false, 
        message: "Article non trouvé" 
      });
    }

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
    const id = req.body.id;

    // Valider que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.json({ 
        success: false, 
        message: "Article non trouvé" 
      });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.json({ success: false, message: "Article non trouvé" });

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
    const blogId = req.body.blogId;

    // Valider que l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return res.json({ 
        success: false, 
        message: "Article non trouvé" 
      });
    }

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
