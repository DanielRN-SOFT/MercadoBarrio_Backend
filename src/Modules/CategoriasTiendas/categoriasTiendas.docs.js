/**
 * Documentación Swagger del módulo de categorías de tienda.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * @swagger que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a categoriasTiendas.routes.js.
 */

/**
 * @swagger
 * tags:
 *   name: StoreCategories
 *   description: Gestión de categorías de tiendas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Panadería
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           example: Active
 *     StoreCategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Panadería
 *     StoreCategoryListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StoreCategory'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 42
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *     StoreCategoryResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/StoreCategory'
 *         message:
 *           type: string
 *           example: Categoría de tienda creada correctamente
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Mensaje de error
 */

/**
 * @swagger
 * /store-categories:
 *   get:
 *     summary: Lista todas las categorías de tienda (paginado)
 *     description: Endpoint de lectura pública.
 *     tags: [StoreCategories]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Filtra categorías cuyo nombre contenga este texto
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: Filtra por estado de la categoría
 *     responses:
 *       200:
 *         description: Listado paginado de categorías
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreCategoryListResponse'
 *       400:
 *         description: El valor de status no coincide con los estados válidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   post:
 *     summary: Crea una nueva categoría de tienda
 *     description: Requiere rol de administrador. La categoría se crea con estado Active.
 *     tags: [StoreCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreCategoryInput'
 *     responses:
 *       201:
 *         description: Categoría de tienda creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreCategoryResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Ese nombre ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /store-categories/{id}:
 *   get:
 *     summary: Obtiene una categoría de tienda por su ID
 *     tags: [StoreCategories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría
 *     responses:
 *       200:
 *         description: Categoría encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/StoreCategory'
 *       404:
 *         description: Categoría de tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Edita el nombre de una categoría de tienda
 *     description: Requiere rol de administrador.
 *     tags: [StoreCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/StoreCategoryInput'
 *     responses:
 *       200:
 *         description: Categoría de tienda editada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreCategoryResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Categoría de tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Ese nombre ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /store-categories/delete/{id}:
 *   put:
 *     summary: Elimina (desactiva) una categoría de tienda
 *     description: >
 *       Requiere rol de administrador. Es un borrado lógico: cambia el estado
 *       a Inactive. Falla si la categoría está asociada a una tienda activa.
 *     tags: [StoreCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría
 *     responses:
 *       200:
 *         description: Categoría de tienda eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreCategoryResponse'
 *       400:
 *         description: Esa categoría está asociada a una tienda activa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Categoría de tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /store-categories/restore/{id}:
 *   put:
 *     summary: Restablece (reactiva) una categoría de tienda
 *     description: Requiere rol de administrador. Cambia el estado a Active.
 *     tags: [StoreCategories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico de la categoría
 *     responses:
 *       200:
 *         description: Categoría de tienda restablecida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreCategoryResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Categoría de tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
