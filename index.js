import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
import authRouter from "./src/Modules/Auth/auth.routes.js";
import userRouter from "./src/Modules/Usuarios/usuarios.routes.js";
import errorHandler from "./src/middlewares/ErrorMiddleware.js";
import roleRouter from "./src/Modules/Roles/roles.routes.js";
import productCategoryRouter from "./src/Modules/CategoriasProductos/categoriasProductos.routes.js";
import unitOfMeasureRouter from "./src/Modules/UnidadesMedida/unidadesmedida.routes.js";
import storeCategoryRouter from "./src/Modules/CategoriasTiendas/categoriasTiendas.routes.js";

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
app.use("/api/users", userRouter);
app.use("/api/roles", roleRouter);
app.use("/api/product-categories", productCategoryRouter);
app.use("/api/store-categories", router);
app.use("/api/unit-measures", storeCategoryRouter);
app.use(errorHandler);

// Servidor
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
