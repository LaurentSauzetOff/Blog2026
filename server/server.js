import "dotenv/config";
import express from "express";
import cors from "cors";
import connectedDB from "./configs/db.js";
import adminRouter from "./routes/adminRoutes.js";
import blogRouter from "./routes/blogRoutes.js";
import { startScheduler } from "./utils/scheduler.js";

const app = express();

app.disable("x-powered-by");

await connectedDB();

// Démarrer le scheduler pour les publications programmées
startScheduler();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "https://blog2026-omega.vercel.app",
]);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Accès refusé par la politique CORS de Laurent"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
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
