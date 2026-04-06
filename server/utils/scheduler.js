import Blog from "../models/Blog.js";

// Fonction pour publier les articles programmés
export const publishScheduledBlogs = async () => {
  try {
    const now = new Date();

    // Trouver tous les articles non publiés avec une date programmée passée
    const blogsToPublish = await Blog.find({
      isPublished: false,
      scheduledDate: { $lte: now }
    });

    if (blogsToPublish.length > 0) {
      // Publier tous les articles trouvés
      await Blog.updateMany(
        {
          _id: { $in: blogsToPublish.map(blog => blog._id) }
        },
        {
          isPublished: true,
          scheduledDate: null // Supprimer la date programmée
        }
      );

      console.log(`${blogsToPublish.length} article(s) publié(s) automatiquement à ${now.toISOString()}`);
    } else {
      console.log(`Vérification scheduler: ${now.toISOString()} - Aucun article à publier`);
    }
  } catch (error) {
    console.error("Erreur lors de la publication automatique :", error);
  }
};

// Fonction pour démarrer le scheduler
export const startScheduler = () => {
  // Vérifier toutes les 1 minute
  setInterval(publishScheduledBlogs, 1 * 60 * 1000);

  // Vérifier au démarrage
  publishScheduledBlogs();
};