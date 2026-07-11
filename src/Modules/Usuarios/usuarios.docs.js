/**
 * Documentación Swagger del módulo de usuarios.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a usuarios.routes.js.
 *
 * Nota: este módulo no usa el wrapper { success, data }; los errores se
 * propagan con next(error) hacia el manejador global, que responde con
 * { message }, así que reutiliza un schema de error propio: UserError.
 *
 * Nota: todas las rutas requieren rol de administrador (IsAdmin).
 * getUsers excluye siempre al usuario autenticado de los resultados
 * (where.NOT = { id: req.user.id }).
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Gestión de usuarios del sistema (solo administradores)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UserError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Usuario no encontrado
 *
 *     UserStatus:
 *       type: string
 *       enum: [Active, Inactive]
 *       description: Estado del usuario
 *
 *     RoleRef:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Tendero
 *
 *     UserListItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: juan@example.com
 *         phone:
 *           type: string
 *           example: "3001234567"
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
 *         role:
 *           $ref: '#/components/schemas/RoleRef'
 *
 *     UserDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: juan@example.com
 *         phone:
 *           type: string
 *           example: "3001234567"
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
 *         roleId:
 *           type: integer
 *           example: 2
 *
 *     UserListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/UserListItem'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 57
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 6
 *
 *     UserDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserDetail'
 *
 *     CreateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *         - password
 *         - roleId
 *       properties:
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: juan@example.com
 *         phone:
 *           type: string
 *           example: "3001234567"
 *         password:
 *           type: string
 *           format: password
 *           example: contraseñaSegura123
 *         roleId:
 *           type: integer
 *           example: 2
 *
 *     UpdateUserInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - phone
 *       properties:
 *         name:
 *           type: string
 *           example: Juan Pérez
 *         email:
 *           type: string
 *           example: juan@example.com
 *         phone:
 *           type: string
 *           example: "3001234567"
 *
 *     CreateUserResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserDetail'
 *         message:
 *           type: string
 *           example: Usuario creado exitosamente
 *
 *     UpdateUserResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserDetail'
 *         message:
 *           type: string
 *           example: Usuario editado exitosamente
 *
 *     UserStatusChangeResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/UserDetail'
 *         message:
 *           type: string
 *           example: Usuario eliminado correctamente
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Obtiene el listado paginado de usuarios del sistema
 *     description: >
 *       Retorna todos los usuarios excepto el usuario autenticado, con
 *       filtros opcionales por estado, rol y búsqueda de texto (nombre,
 *       email o teléfono). Requiere rol de administrador.
 *     tags: [Users]
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
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/UserStatus'
 *         description: Filtro por estado del usuario
 *       - in: query
 *         name: roleId
 *         schema:
 *           type: integer
 *         description: Filtro por ID de rol
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Búsqueda parcial por nombre, email o teléfono
 *     responses:
 *       200:
 *         description: Listado de usuarios obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       400:
 *         description: Estado inválido en el filtro `status`
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 */

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Crea un nuevo usuario en el sistema
 *     description: >
 *       Registra un usuario validando que el rol indicado exista y
 *       hasheando la contraseña antes de guardarla. Requiere rol de
 *       administrador.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserInput'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateUserResponse'
 *       400:
 *         description: Campos obligatorios faltantes o rol inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       404:
 *         description: El rol indicado no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       409:
 *         description: El email ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Obtiene un usuario específico por su ID
 *     description: Requiere rol de administrador.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 */

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Actualiza los datos básicos de un usuario
 *     description: >
 *       Actualiza nombre, email y teléfono. No permite cambiar la
 *       contraseña ni el rol desde este endpoint. Requiere rol de
 *       administrador.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserInput'
 *     responses:
 *       200:
 *         description: Usuario editado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateUserResponse'
 *       400:
 *         description: ID inválido o campos obligatorios faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       409:
 *         description: El email ya está registrado en el sistema
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 */

/**
 * @swagger
 * /users/delete/{id}:
 *   put:
 *     summary: Desactiva (elimina lógicamente) un usuario
 *     description: >
 *       Marca el usuario como Inactive. No elimina el registro
 *       físicamente. Requiere rol de administrador.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a desactivar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatusChangeResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 */

/**
 * @swagger
 * /users/restore/{id}:
 *   put:
 *     summary: Restablece (reactiva) un usuario previamente desactivado
 *     description: >
 *       Marca el usuario como Active. Requiere rol de administrador.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del usuario a restablecer
 *     responses:
 *       200:
 *         description: Usuario restablecido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserStatusChangeResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserError'
 */
