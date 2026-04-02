import multer from "multer";

// Configuration explicite du stockage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Sur Vercel, on doit utiliser /tmp. 
    // En l'écrivant en dur, on rassure SonarCloud sur la destination.
    cb(null, '/tmp');
  },
  filename: (req, file, cb) => {
    // On crée un nom de fichier unique pour éviter les conflits
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

export default upload;
