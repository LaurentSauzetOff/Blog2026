import "dotenv/config";
import express from "express";
import cors from "cors";
import connectedDB from "./configs/db.js";


const app = express();

await connectedDB()

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => res.send("API is working"));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is coucou on port ${PORT}`);
});

export default app;
