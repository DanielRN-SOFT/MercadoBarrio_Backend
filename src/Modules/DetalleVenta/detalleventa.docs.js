/**
 * Documentación Swagger del módulo de detalle de venta.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * @swagger que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a detalleventa.routes.js.
 *
 * Todos los endpoints requieren rol de tendero: los resultados se filtran
 * siempre por la tienda del usuario autenticado (sale.storeId === req.store.id).
 */

/**
 * @swagger
 * tags:
 *   name: SaleDetails
 *   description: Consulta de los renglones (líneas de producto) de las ventas de una tienda
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 501
 *         saleId:
 *           type: integer
 *           example: 120
 *         productId:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: integer
 *           example: 3
 *         unitPrice:
 *           type: number
 *           example: 4500
 *         subtotal:
 *           type: number
 *           example: 13500
 *     SaleDetailListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleDetail'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 87
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 9
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Mensaje de error
 */

/**
 * @swagger
 * /sale-details:
 *   get:
 *     summary: Lista los detalles de venta de la tienda del tendero autenticado (paginado)
 *     description: >
 *       Retorna los renglones de venta (producto, cantidad, precio, subtotal)
 *       pertenecientes a ventas de la tienda del usuario autenticado. Puede
 *       filtrarse por una venta específica usando el query param `saleId`.
 *     tags: [SaleDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: saleId
 *         schema:
 *           type: integer
 *         description: Filtra los detalles pertenecientes a una venta específica
 *     responses:
 *       200:
 *         description: Listado paginado de detalles de venta
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleDetailListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /sale-details/{id}:
 *   get:
 *     summary: Obtiene un detalle de venta por su ID
 *     description: >
 *       Solo retorna el detalle si pertenece a una venta de la tienda del
 *       tendero autenticado.
 *     tags: [SaleDetails]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del detalle de venta
 *     responses:
 *       200:
 *         description: Detalle de venta encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/SaleDetail'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Detalle de venta no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
