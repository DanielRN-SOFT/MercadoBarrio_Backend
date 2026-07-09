import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./src/config/swagger.js";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
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
import supplierRouter from "./src/Modules/Proveedores/proveedores.routes.js";

// Config
const port = process.env.PORT || 5000;
const app = express();

// Middlewares
app.use(
  cors({
    origin: [process.env.FRONTEND_URL, "http://localhost:5000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/api/auth", authRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/users", userRouter);
app.use("/api/roles", roleRouter);
app.use("/api/product-categories", productCategoryRouter);
app.use("/api/store-categories", storeCategoryRouter);
app.use("/api/unit-measures", unitOfMeasureRouter);
app.use("/api/attendance-schedules", attendanceScheduleRouter);
app.use("/api/movements", movementRouter);
app.use("/api/stores", storeRouter);
app.use("/api/products", productRouter);
app.use("/api/sales", saleRouter);
app.use("/api/sale-details", saleDetailRouter);
app.use("/api/suppliers", supplierRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(errorHandler);

// Servidor
app.listen(port, () => console.log(`Servidor corriendo en el puerto ${port}`));
