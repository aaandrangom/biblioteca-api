// swaggerConfig.js
const swaggerJsdoc = require("swagger-jsdoc");

// Opciones de configuración de Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Biblioteca API",
      version: "1.0.0",
      description: "Una API simple para gestionar libros en una biblioteca",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
