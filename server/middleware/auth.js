import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  // Petite amélioration bonus : vérifier la présence du token avant le try/catch
  if (!token) {
    return res.json({ success: false, message: "Token manquant" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY);
    next();
  } catch (error) {
    // FIX SONARCLOUD : On logue l'erreur pour ne pas l'ignorer
    console.error("Erreur de vérification JWT :", error.message);

    res.json({ success: false, message: "Token invalide" });
  }
};

export default auth;
