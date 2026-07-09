import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Mercado Barrio API",
      version: "1.0.0",
      description: "API para gestión de directorio local, tiendas e inventario",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5500}/api`,
        description: "Desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "jwt", // coincide con req.cookies.jwt en tu authMiddleware
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  // Aquí le decimos dónde buscar los comentarios JSDoc
  apis: ["./src/Modules/**/*.routes.js", "./src/Modules/**/*.docs.js"],
};

export const swaggerSpec = swaggerJsdoc(options);
