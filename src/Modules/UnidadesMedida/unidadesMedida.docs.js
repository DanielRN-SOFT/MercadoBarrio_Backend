/**
 * Documentación Swagger del módulo de unidades de medida.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * @swagger que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a unidadesMedida.routes.js.
 *
 * Nota: este módulo no usa el wrapper { success, data }; los errores se
 * propagan con next(error) hacia el manejador global, que responde con
 * { message }, así que reutiliza un schema de error propio: UnitOfMeasureError.
 *
 * Nota: GET / y GET /:id solo requieren estar autenticado (protect).
 * create/update/delete/restore requieren además rol de administrador
 * (IsAdmin).
 */

/**
 * @swagger
 * tags:
 *   name: UnitsOfMeasure
 *   description: Gestión de unidades de medida para productos
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UnitOfMeasureError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Unidad de medida no encontrada
 *
 *     UnitOfMeasureStatus:
 *       type: string
 *       enum: [Active, Inactive]
 *       description: Estado de la unidad de medida
 *
 *     UnitOfMeasure:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Kilogramo
 *         status:
 *           $ref: '#/components/schemas/UnitOfMeasureStatus'
 *
 *     UnitOfMeasureListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UnitOfMeasure'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 8
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 1
 *
 *     UnitOfMeasureDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UnitOfMeasure'
 *
 *     CreateUnitOfMeasureInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Kilogramo
 *
 *     UpdateUnitOfMeasureInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Kilogramo
 *
 *     CreateUnitOfMeasureResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UnitOfMeasure'
 *         message:
 *           type: string
 *           example: Unidad de medida creada correctamente
 *
 *     UpdateUnitOfMeasureResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UnitOfMeasure'
 *         message:
 *           type: string
 *           example: Unidad de medida editada exitosamente
 *
 *     UnitOfMeasureStatusChangeResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UnitOfMeasure'
 *         message:
 *           type: string
 *           example: Unidad de medida eliminada correctamente
 */

/**
 * @swagger
 * /unit-measures:
 *   get:
 *     summary: Obtiene el listado paginado de unidades de medida
 *     description: >
 *       Permite búsqueda parcial por nombre y filtro por estado.
 *       Requiere estar autenticado.
 *     tags: [UnitsOfMeasure]
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
 *         description: Búsqueda parcial por nombre
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/UnitOfMeasureStatus'
 *         description: Filtro por estado de la unidad de medida
 *     responses:
 *       200:
 *         description: Listado de unidades de medida obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureListResponse'
 *       400:
 *         description: Estado inválido en el filtro `status`
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 */

/**
 * @swagger
 * /unit-measures/{id}:
 *   get:
 *     summary: Obtiene una unidad de medida específica por su ID
 *     description: Requiere estar autenticado.
 *     tags: [UnitsOfMeasure]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la unidad de medida
 *     responses:
 *       200:
 *         description: Unidad de medida encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       404:
 *         description: Unidad de medida no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 */

/**
 * @swagger
 * /unit-measures:
 *   post:
 *     summary: Crea una nueva unidad de medida
 *     description: Requiere rol de administrador. El nombre debe ser único.
 *     tags: [UnitsOfMeasure]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUnitOfMeasureInput'
 *     responses:
 *       201:
 *         description: Unidad de medida creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUnitOfMeasureResponse'
 *       400:
 *         description: El campo `name` no fue enviado o no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       409:
 *         description: Ese nombre ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 */

/**
 * @swagger
 * /unit-measures/{id}:
 *   put:
 *     summary: Actualiza el nombre de una unidad de medida existente
 *     description: Requiere rol de administrador. El nombre debe ser único.
 *     tags: [UnitsOfMeasure]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la unidad de medida a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUnitOfMeasureInput'
 *     responses:
 *       200:
 *         description: Unidad de medida editada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUnitOfMeasureResponse'
 *       400:
 *         description: ID inválido, o el campo `name` no fue enviado o no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       404:
 *         description: Unidad de medida no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       409:
 *         description: Ese nombre ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 */

/**
 * @swagger
 * /unit-measures/delete/{id}:
 *   put:
 *     summary: Desactiva (elimina lógicamente) una unidad de medida
 *     description: >
 *       Marca la unidad de medida como Inactive. No elimina el registro
 *       físicamente. La operación se bloquea si hay algún producto
 *       activo asociado a la unidad de medida. Requiere rol de
 *       administrador.
 *     tags: [UnitsOfMeasure]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la unidad de medida a desactivar
 *     responses:
 *       200:
 *         description: Unidad de medida eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureStatusChangeResponse'
 *       400:
 *         description: >
 *           ID inválido, o la unidad de medida está asociada a un
 *           producto activo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       404:
 *         description: Unidad de medida no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 */

/**
 * @swagger
 * /unit-measures/restore/{id}:
 *   put:
 *     summary: Restablece (reactiva) una unidad de medida previamente desactivada
 *     description: >
 *       Marca la unidad de medida como Active. Requiere rol de
 *       administrador.
 *     tags: [UnitsOfMeasure]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la unidad de medida a restablecer
 *     responses:
 *       200:
 *         description: Unidad de medida restablecida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureStatusChangeResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       404:
 *         description: Unidad de medida no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UnitOfMeasureError'
 */
