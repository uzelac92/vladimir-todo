import "dotenv/config";
import express from "express";
import routes from "./routes.js";

const app = express();

app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Todo app is running...");
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Server listening on port ${port}`));
