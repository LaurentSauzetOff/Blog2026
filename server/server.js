import "dotenv/config";
import express from "express";
import cors from "cors";
import connectedDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

const app = express();

app.disable('x-powered-by');

await connectedDB();

const allowedOrigins = ["http://localhost:5173", "https://blog2026-vercel.app"];

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      // On autorise les requêtes sans origine (comme Postman ou les outils serveurs)
      // ou si l'origine est dans notre liste blanche
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Accès refusé par la politique CORS de Laurent"));
      }
    },
    credentials: true, // Utile si tu gères des cookies ou des sessions plus tard
    methods: ["GET", "POST", "PUT", "DELETE"], // On limite les verbes HTTP autorisés
  }),
);
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is working"));
app.use("/api/admin", adminRouter);
app.use("/api/blog", blogRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is coucou on port ${PORT}`);
});

export default app;
