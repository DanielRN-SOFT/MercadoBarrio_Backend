import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import authRouter from "./src/Auth/auth.routes.js";
import errorHandler from "./src/middlewares/ErrorMiddleware.js";

// Config
const port = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRouter);
app.use(errorHandler);

// Servidor
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
