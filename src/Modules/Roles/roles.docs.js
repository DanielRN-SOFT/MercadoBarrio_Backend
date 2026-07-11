/**
 * Documentación Swagger del módulo de roles.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a roles.routes.js.
 *
 * Nota: este módulo no usa el wrapper { success, data }; los errores se
 * propagan con next(error) hacia el manejador global, que responde con
 * { message }, así que reutiliza un schema de error propio: RoleError.
 *
 * Nota: todas las rutas requieren rol de administrador (IsAdmin).
 * deleteRole es un borrado físico (prisma.role.delete), no lógico, y
 * está bloqueado si hay algún usuario activo asociado al rol.
 */

/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: Gestión de roles del sistema (solo administradores)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     RoleError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Rol no encontrado
 *
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Tendero
 *
 *     RoleFull:
 *       type: object
 *       description: Registro completo del rol (incluye status), retornado por create/update/delete
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Tendero
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           example: Active
 *
 *     RoleListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Role'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 4
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 1
 *
 *     RoleDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Role'
 *
 *     CreateRoleInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Supervisor
 *
 *     UpdateRoleInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           example: Supervisor
 *
 *     CreateRoleResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/RoleFull'
 *         message:
 *           type: string
 *           example: Rol creado correctamente
 *
 *     UpdateRoleResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/RoleFull'
 *         message:
 *           type: string
 *           example: Rol actualizado correctamente
 *
 *     DeleteRoleResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/RoleFull'
 *         message:
 *           type: string
 *           example: Rol eliminado correctamente
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtiene el listado paginado de roles
 *     description: >
 *       Retorna los roles del sistema, con filtro opcional de búsqueda
 *       parcial por nombre. Requiere rol de administrador.
 *     tags: [Roles]
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
 *         description: Búsqueda parcial por nombre del rol
 *     responses:
 *       200:
 *         description: Listado de roles obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 */

/**
 * @swagger
 * /roles/{id}:
 *   get:
 *     summary: Obtiene un rol específico por su ID
 *     description: Requiere rol de administrador.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol
 *     responses:
 *       200:
 *         description: Rol encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       404:
 *         description: Rol no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 */

/**
 * @swagger
 * /roles:
 *   post:
 *     summary: Crea un nuevo rol
 *     description: Requiere rol de administrador. El nombre debe ser único.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleInput'
 *     responses:
 *       201:
 *         description: Rol creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateRoleResponse'
 *       400:
 *         description: El campo `name` no fue enviado o no es un string válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       409:
 *         description: Ya existe un rol con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 */

/**
 * @swagger
 * /roles/{id}:
 *   put:
 *     summary: Actualiza el nombre de un rol existente
 *     description: Requiere rol de administrador. El nombre debe ser único.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleInput'
 *     responses:
 *       200:
 *         description: Rol actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateRoleResponse'
 *       400:
 *         description: ID inválido, o el campo `name` no fue enviado o no es válido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       404:
 *         description: Rol no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       409:
 *         description: Ya existe un rol con ese nombre
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 */

/**
 * @swagger
 * /roles/{id}:
 *   delete:
 *     summary: Elimina físicamente un rol
 *     description: >
 *       Borra el registro del rol de la base de datos (no es borrado
 *       lógico). La operación se bloquea si existe al menos un usuario
 *       activo asociado al rol. Requiere rol de administrador.
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del rol a eliminar
 *     responses:
 *       200:
 *         description: Rol eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DeleteRoleResponse'
 *       400:
 *         description: ID inválido, o existe un usuario activo asociado al rol
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       404:
 *         description: Rol no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RoleError'
 */
