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
import attendanceScheduleRouter from "./src/Modules/HorariosAtencion/horariosatencion.routes.js";
import movementRouter from "./src/Modules/Movimientos/movimientos.routes.js";
import storeRouter from "./src/Modules/Tiendas/tiendas.routes.js";
import productRouter from "./src/Modules/Productos/productos.routes.js";
import saleRouter from "./src/Modules/Ventas/ventas.routes.js";
import saleDetailRouter from "./src/Modules/DetalleVenta/detalleventa.routes.js";
import dashboardRouter from "./src/Modules/Dashboard/dashboard.routes.js";

// Config
const port = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true}));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/users", userRouter);
app.use("/api/roles", roleRouter);
app.use("/api/product-categories", productCategoryRouter);
app.use("/api/store-categories", storeCategoryRouter);
app.use("/api/unit-measures", unitOfMeasureRouter);
app.use("/api/attendance-schedule", attendanceScheduleRouter);
app.use("/api/movements", movementRouter);
app.use("/api/stores", storeRouter);
app.use("/api/products", productRouter);
app.use("/api/sales", saleRouter);
app.use("/api/sale-details", saleDetailRouter);
app.use(errorHandler);

// Servidor
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
