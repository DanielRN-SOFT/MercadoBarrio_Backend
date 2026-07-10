/**
 * Documentación Swagger del módulo de proveedores.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * @swagger que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a proveedores.routes.js.
 *
 * Nota: este módulo no usa el wrapper { success, data }; los errores se
 * propagan con next(error) hacia el manejador global, que responde con
 * { message }, así que reutiliza un schema de error propio: SupplierError.
 *
 * Nota: todas las rutas requieren autenticación (protect). Solo
 * create/update/delete/restore requieren además rol de administrador
 * (IsAdmin); GET / y GET /:id solo requieren estar autenticado.
 */

/**
 * @swagger
 * tags:
 *   name: Suppliers
 *   description: Gestión de proveedores
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SupplierError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Proveedor no encontrado
 *
 *     SupplierStatus:
 *       type: string
 *       enum: [Active, Inactive]
 *       description: Estado del proveedor
 *
 *     Supplier:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         name:
 *           type: string
 *           example: Distribuidora La Sabana
 *         email:
 *           type: string
 *           example: contacto@lasabana.com
 *         address:
 *           type: string
 *           example: Cra 15 # 20-30
 *         city:
 *           type: string
 *           example: Pereira
 *         phone:
 *           type: string
 *           example: "3109876543"
 *         status:
 *           $ref: '#/components/schemas/SupplierStatus'
 *
 *     SupplierListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Supplier'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 18
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 2
 *
 *     SupplierDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Supplier'
 *
 *     CreateSupplierInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - address
 *         - city
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           example: Distribuidora La Sabana
 *         email:
 *           type: string
 *           example: contacto@lasabana.com
 *         address:
 *           type: string
 *           example: Cra 15 # 20-30
 *         city:
 *           type: string
 *           example: Pereira
 *         phone:
 *           type: string
 *           example: "3109876543"
 *
 *     UpdateSupplierInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - address
 *         - city
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           example: Distribuidora La Sabana
 *         email:
 *           type: string
 *           example: contacto@lasabana.com
 *         address:
 *           type: string
 *           example: Cra 15 # 20-30
 *         city:
 *           type: string
 *           example: Pereira
 *         phone:
 *           type: string
 *           example: "3109876543"
 *
 *     CreateSupplierResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Supplier'
 *         message:
 *           type: string
 *           example: Proveedor creado correctamente
 *
 *     UpdateSupplierResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Supplier'
 *         message:
 *           type: string
 *           example: Proveedor editado correctamente
 *
 *     SupplierStatusChangeResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Supplier'
 *         message:
 *           type: string
 *           example: Proveedor eliminado correctamente
 */

/**
 /**
 * @swagger
 * /suppliers:
 *   get:
 *     summary: Obtiene el listado paginado de proveedores
 *     description: >
 *       Permite búsqueda parcial por nombre, email, ciudad, teléfono o
 *       dirección, y filtro por estado. Requiere estar autenticado.
 *     tags: [Suppliers]
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
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda parcial por nombre, email, ciudad, teléfono o dirección
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/SupplierStatus'
 *         description: Filtro por estado del proveedor
 *     responses:
 *       200:
 *         description: Listado de proveedores obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 */

/**
 * @swagger
 * /suppliers/{id}:
 *   get:
 *     summary: Obtiene un proveedor específico por su ID
 *     description: Requiere estar autenticado.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor
 *     responses:
 *       200:
 *         description: Proveedor encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       404:
 *         description: Proveedor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 */

/**
 * @swagger
 * /suppliers:
 *   post:
 *     summary: Crea un nuevo proveedor
 *     description: Requiere rol de administrador. El email debe ser único.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSupplierInput'
 *     responses:
 *       201:
 *         description: Proveedor creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSupplierResponse'
 *       400:
 *         description: Campos obligatorios faltantes o inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       409:
 *         description: Ese correo ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 */

/**
 * @swagger
 * /suppliers/{id}:
 *   put:
 *     summary: Actualiza un proveedor existente
 *     description: Requiere rol de administrador. El email debe ser único.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateSupplierInput'
 *     responses:
 *       200:
 *         description: Proveedor editado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateSupplierResponse'
 *       400:
 *         description: ID inválido o campos obligatorios faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       404:
 *         description: Proveedor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       409:
 *         description: Ese correo ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 */

/**
 * @swagger
 * /suppliers/delete/{id}:
 *   put:
 *     summary: Desactiva (elimina lógicamente) un proveedor
 *     description: >
 *       Marca el proveedor como Inactive. No elimina el registro
 *       físicamente. La operación se bloquea si el proveedor está
 *       asociado a algún movimiento existente. Requiere rol de
 *       administrador.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor a desactivar
 *     responses:
 *       200:
 *         description: Proveedor eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierStatusChangeResponse'
 *       400:
 *         description: ID inválido, o el proveedor está asociado a un movimiento
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       404:
 *         description: Proveedor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 */

/**
 * @swagger
 * /suppliers/restore/{id}:
 *   put:
 *     summary: Restablece (reactiva) un proveedor previamente desactivado
 *     description: >
 *       Marca el proveedor como Active. Requiere rol de administrador.
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del proveedor a restablecer
 *     responses:
 *       200:
 *         description: Proveedor restablecido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierStatusChangeResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       404:
 *         description: Proveedor no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SupplierError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *               $ref: '#/components/schemas/SupplierError'
 */
