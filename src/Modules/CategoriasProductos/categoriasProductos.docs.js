/**
 * Documentación Swagger del módulo de categorías de producto.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a categoriasProductos.routes.js.
 */

/**
 * @swagger
 * tags:
 *   name: ProductCategories
 *   description: Gestión de categorías de productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductCategory:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Lácteos
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           example: Active
 *     ProductCategorySummary:
 *       type: object
 *       description: Versión resumida usada en listados públicos y de tienda (sin status)
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         name:
 *           type: string
 *           example: Lácteos
 *     ProductCategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Lácteos
 *     ProductCategoryListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductCategory'
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
 *     ProductCategoryResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ProductCategory'
 *         message:
 *           type: string
 *           example: Categoria de producto creada correctamente
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Mensaje de error
 */

/**
 * @swagger
 * /product-categories/public/search:
 *   get:
 *     summary: Lista categorías con productos activos y con stock disponible
 *     description: >
 *       Endpoint público para el buscador de productos. Solo retorna categorías
 *       activas que tengan al menos un producto activo, con stock disponible
 *       y perteneciente a una tienda activa.
 *     tags: [ProductCategories]
 *     responses:
 *       200:
 *         description: Listado de categorías disponibles para búsqueda
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductCategorySummary'
 */

/**
 * @swagger
 * /product-categories/store/mine:
 *   get:
 *     summary: Lista las categorías usadas por la tienda del tendero autenticado
 *     description: >
 *       Retorna las categorías que tienen al menos un producto (activo o inactivo)
 *       asociado a la tienda del usuario autenticado.
 *     tags: [ProductCategories]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de categorías usadas en el catálogo del tendero
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/ProductCategorySummary'
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
 * /product-categories:
 *   get:
 *     summary: Lista todas las categorías de productos (paginado)
 *     description: Endpoint de lectura pública, usado también por el buscador de productos.
 *     tags: [ProductCategories]
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
 *               $ref: '#/components/schemas/ProductCategoryListResponse'
 *   post:
 *     summary: Crea una nueva categoría de producto
 *     description: Requiere rol de administrador. La categoría se crea con estado Active.
 *     tags: [ProductCategories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProductCategoryInput'
 *     responses:
 *       201:
 *         description: Categoria de producto creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponse'
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
 * /product-categories/{id}:
 *   get:
 *     summary: Obtiene una categoría de producto por su ID
 *     tags: [ProductCategories]
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
 *                   $ref: '#/components/schemas/ProductCategory'
 *       404:
 *         description: Categoria de producto no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Edita el nombre de una categoría de producto
 *     description: Requiere rol de administrador.
 *     tags: [ProductCategories]
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
 *             $ref: '#/components/schemas/ProductCategoryInput'
 *     responses:
 *       200:
 *         description: Categoria de producto editada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponse'
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
 *         description: Categoria de producto no encontrada
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
 * /product-categories/delete/{id}:
 *   put:
 *     summary: Elimina (desactiva) una categoría de producto
 *     description: >
 *       Requiere rol de administrador. Es un borrado lógico: cambia el estado
 *       a Inactive. Falla si la categoría está asociada a algún producto activo.
 *     tags: [ProductCategories]
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
 *         description: Categoria de producto eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponse'
 *       400:
 *         description: Esa categoria está asociada a un producto activo
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
 *         description: Categoria de producto no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /product-categories/restore/{id}:
 *   put:
 *     summary: Restablece (reactiva) una categoría de producto
 *     description: Requiere rol de administrador. Cambia el estado a Active.
 *     tags: [ProductCategories]
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
 *         description: Categoria de producto restablecida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductCategoryResponse'
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
 *         description: Categoria de producto no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
