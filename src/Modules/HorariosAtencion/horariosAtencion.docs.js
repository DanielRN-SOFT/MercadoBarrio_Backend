/**
 * Documentación Swagger del módulo de horarios de atención.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * @swagger que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a horariosAtencion.routes.js.
 *
 * Todos los endpoints requieren rol de tendero: los horarios pertenecen a la
 * tienda del usuario autenticado (storeId = req.store.id), no a un usuario
 * directamente.
 */

/**
 * @swagger
 * tags:
 *   name: AttendanceSchedules
 *   description: Gestión de los horarios de atención de una tienda
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AttendanceSchedule:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         weekDay:
 *           type: string
 *           enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *           example: Monday
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T08:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T17:00:00.000Z"
 *         status:
 *           type: string
 *           enum: [Active, Inactive]
 *           example: Active
 *     AttendanceScheduleInput:
 *       type: object
 *       required:
 *         - weekDay
 *         - startTime
 *         - endTime
 *       properties:
 *         weekDay:
 *           type: string
 *           enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *           example: Monday
 *         startTime:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T08:00:00.000Z"
 *         endTime:
 *           type: string
 *           format: date-time
 *           example: "2026-01-01T17:00:00.000Z"
 *     AttendanceScheduleListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/AttendanceSchedule'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 12
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 2
 *     AttendanceScheduleResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/AttendanceSchedule'
 *         message:
 *           type: string
 *           example: Horario de tienda creado correctamente
 *     Error:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Mensaje de error
 */

/**
 * @swagger
 * /attendance-schedules:
 *   get:
 *     summary: Lista los horarios de atención de la tienda del tendero autenticado (paginado)
 *     description: >
 *       Los resultados se ordenan por día de la semana (Monday a Sunday).
 *       Puede filtrarse por día y/o estado.
 *     tags: [AttendanceSchedules]
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
 *         name: weekDay
 *         schema:
 *           type: string
 *           enum: [Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday]
 *         description: Filtra por día de la semana
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [Active, Inactive]
 *         description: Filtra por estado del horario
 *     responses:
 *       200:
 *         description: Listado paginado de horarios de atención, ordenado por día
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceScheduleListResponse'
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
 *   post:
 *     summary: Crea un nuevo horario de atención para la tienda
 *     description: >
 *       El horario se crea con estado Active. Falla si `endTime` no es mayor
 *       a `startTime`, o si se cruza con otro horario activo del mismo día.
 *     tags: [AttendanceSchedules]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceScheduleInput'
 *     responses:
 *       201:
 *         description: Horario de tienda creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceScheduleResponse'
 *       400:
 *         description: >
 *           El horario de salida no es mayor al de entrada, o se cruza con
 *           un horario activo existente del mismo día
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
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance-schedules/{id}:
 *   get:
 *     summary: Obtiene un horario de atención por su ID
 *     description: Solo retorna el horario si pertenece a la tienda del tendero autenticado.
 *     tags: [AttendanceSchedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del horario
 *     responses:
 *       200:
 *         description: Horario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/AttendanceSchedule'
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
 *         description: Horario de tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *   put:
 *     summary: Edita un horario de atención existente
 *     description: >
 *       Falla si `endTime` no es mayor a `startTime`, o si se cruza con otro
 *       horario activo del mismo día (excluyendo el propio horario editado).
 *     tags: [AttendanceSchedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del horario
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AttendanceScheduleInput'
 *     responses:
 *       200:
 *         description: Horario de tienda actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceScheduleResponse'
 *       400:
 *         description: >
 *           El horario de salida no es mayor al de entrada, o se cruza con
 *           un horario activo existente del mismo día
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
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Horario de tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance-schedules/delete/{id}:
 *   put:
 *     summary: Elimina (desactiva) un horario de atención
 *     description: Borrado lógico, cambia el estado a Inactive.
 *     tags: [AttendanceSchedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del horario
 *     responses:
 *       200:
 *         description: Horario de atención eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceScheduleResponse'
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
 *         description: Horario de tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /attendance-schedules/restore/{id}:
 *   put:
 *     summary: Restablece (reactiva) un horario de atención
 *     description: Cambia el estado a Active.
 *     tags: [AttendanceSchedules]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID numérico del horario
 *     responses:
 *       200:
 *         description: Horario de atencion restablecido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AttendanceScheduleResponse'
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
 *         description: Horario de atencion no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
