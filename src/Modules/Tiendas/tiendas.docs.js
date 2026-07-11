/**
 * Documentación Swagger del módulo de tiendas.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a tiendas.routes.js.
 *
 * Nota: este módulo no usa el wrapper { success, data }; los errores se
 * propagan con next(error) hacia el manejador global, que responde con
 * { message }, así que reutiliza un schema de error propio: StoreError.
 *
 * Nota: hay tres grupos de rutas con permisos distintos:
 * - Públicas (sin autenticación): /public, /public/map, /public/:id
 * - Del tendero sobre su propia tienda: /me (requiere isGrocer)
 * - De administrador sobre cualquier tienda: /, /:id, /delete/:id, /restore/:id (requiere IsAdmin)
 */

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: Gestión de tiendas, catálogo público y perfil del tendero
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     StoreError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Tienda no encontrada
 *
 *     StoreStatus:
 *       type: string
 *       enum: [Pending, Active, Inactive, Incomplete, Rejected]
 *       description: Estado de la tienda
 *
 *     StoreAdminListItem:
 *       type: object
 *       description: Vista de tienda para el listado de administrador
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *         address:
 *           type: string
 *           example: Calle 10 # 5-20
 *         neighborhood:
 *           type: string
 *           nullable: true
 *           example: Centro
 *         longitude:
 *           type: number
 *           nullable: true
 *           example: -74.2973
 *         latitude:
 *           type: number
 *           nullable: true
 *           example: 4.5709
 *         description:
 *           type: string
 *           nullable: true
 *         photo:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/StoreStatus'
 *         storeCategoryId:
 *           type: integer
 *           example: 2
 *         userId:
 *           type: integer
 *           example: 8
 *
 *     StoreAdminDetail:
 *       type: object
 *       description: Vista de tienda para consulta individual de administrador
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *         address:
 *           type: string
 *           example: Calle 10 # 5-20
 *         neighborhood:
 *           type: string
 *           nullable: true
 *         longitude:
 *           type: number
 *           nullable: true
 *         latitude:
 *           type: number
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         logo:
 *           type: string
 *           nullable: true
 *         photo:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/StoreStatus'
 *         storeCategoryId:
 *           type: integer
 *           example: 2
 *         userId:
 *           type: integer
 *           example: 8
 *         onboardingStep:
 *           type: string
 *           nullable: true
 *           example: completed
 *
 *     MyStore:
 *       type: object
 *       description: Vista de la tienda propia del tendero autenticado
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *         address:
 *           type: string
 *           example: Calle 10 # 5-20
 *         neighborhood:
 *           type: string
 *           nullable: true
 *         longitude:
 *           type: number
 *           nullable: true
 *         latitude:
 *           type: number
 *           nullable: true
 *         description:
 *           type: string
 *           nullable: true
 *         logo:
 *           type: string
 *           nullable: true
 *         photo:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         status:
 *           $ref: '#/components/schemas/StoreStatus'
 *         storeCategoryId:
 *           type: integer
 *           example: 2
 *         onboardingStep:
 *           type: string
 *           nullable: true
 *           example: completed
 *
 *     StoreScheduleItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         weekDay:
 *           type: string
 *           example: Lunes
 *         startTime:
 *           type: string
 *           example: "08:00"
 *         endTime:
 *           type: string
 *           example: "18:00"
 *         status:
 *           type: string
 *           example: Active
 *
 *     StorePublicListItem:
 *       type: object
 *       description: Tienda para el catálogo público (campos definidos en storeSelect)
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *         address:
 *           type: string
 *           example: Calle 10 # 5-20
 *         neighborhood:
 *           type: string
 *           nullable: true
 *         photo:
 *           type: string
 *           nullable: true
 *         phone:
 *           type: string
 *           nullable: true
 *         latitude:
 *           type: number
 *           nullable: true
 *         longitude:
 *           type: number
 *           nullable: true
 *
 *     StoreCategoryRef:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Tienda de barrio
 *
 *     StorePublicDetailProduct:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *           example: Arroz 500g
 *         price:
 *           type: number
 *           example: 2500
 *         description:
 *           type: string
 *           nullable: true
 *         photo:
 *           type: string
 *           nullable: true
 *         currentStock:
 *           type: integer
 *           example: 40
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         referenceCode:
 *           type: string
 *           nullable: true
 *           example: ARR-500
 *         productCategory:
 *           $ref: '#/components/schemas/StoreCategoryRef'
 *         unitOfMeasure:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 2
 *             name:
 *               type: string
 *               example: Unidad
 *
 *     StorePublicDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 3
 *             name:
 *               type: string
 *               example: Tienda El Ahorro
 *             address:
 *               type: string
 *               example: Calle 10 # 5-20
 *             neighborhood:
 *               type: string
 *               nullable: true
 *             description:
 *               type: string
 *               nullable: true
 *             logo:
 *               type: string
 *               nullable: true
 *             photo:
 *               type: string
 *               nullable: true
 *             phone:
 *               type: string
 *               nullable: true
 *             status:
 *               $ref: '#/components/schemas/StoreStatus'
 *             latitude:
 *               type: number
 *               nullable: true
 *             longitude:
 *               type: number
 *               nullable: true
 *             storeCategory:
 *               $ref: '#/components/schemas/StoreCategoryRef'
 *             schedules:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StoreScheduleItem'
 *             products:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/StorePublicDetailProduct'
 *             categories:
 *               type: array
 *               description: Categorías de producto disponibles en la tienda, sin filtrar (para botones de filtro)
 *               items:
 *                 $ref: '#/components/schemas/StoreCategoryRef'
 *         meta:
 *           type: object
 *           description: Paginación de la lista de productos incluida en la respuesta
 *           properties:
 *             total:
 *               type: integer
 *               example: 45
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 5
 *
 *     StoreListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StoreAdminListItem'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 30
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 3
 *
 *     StorePublicListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/StorePublicListItem'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 30
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 3
 *
 *     StoresForMapResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           description: Hasta 1000 tiendas que cumplan el filtro, sin paginar
 *           items:
 *             $ref: '#/components/schemas/StorePublicListItem'
 *
 *     StoreAdminDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/StoreAdminDetail'
 *
 *     MyStoreResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/MyStore'
 *
 *     CreateMyStoreInput:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - neighborhood
 *         - storeCategoryId
 *       properties:
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *         address:
 *           type: string
 *           example: Calle 10 # 5-20
 *         neighborhood:
 *           type: string
 *           example: Centro
 *         longitude:
 *           type: number
 *           example: -74.2973
 *         latitude:
 *           type: number
 *           example: 4.5709
 *         description:
 *           type: string
 *           example: Tienda de barrio con productos de la canasta familiar
 *         phone:
 *           type: string
 *           example: "3001234567"
 *         storeCategoryId:
 *           type: integer
 *           example: 2
 *         photo:
 *           type: string
 *           format: binary
 *           description: Foto de la tienda (opcional)
 *
 *     UpdateMyStoreInput:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - neighborhood
 *       properties:
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *         address:
 *           type: string
 *           example: Calle 10 # 5-20
 *         neighborhood:
 *           type: string
 *           example: Centro
 *         longitude:
 *           type: number
 *           example: -74.2973
 *         latitude:
 *           type: number
 *           example: 4.5709
 *         description:
 *           type: string
 *           example: Tienda de barrio con productos de la canasta familiar
 *         phone:
 *           type: string
 *           example: "3001234567"
 *         storeCategoryId:
 *           type: integer
 *           example: 2
 *         photo:
 *           type: string
 *           format: binary
 *           description: Nueva foto de la tienda (opcional). Si se envía, reemplaza y elimina la anterior.
 *
 *     CreateMyStoreResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/MyStore'
 *         message:
 *           type: string
 *           example: Tienda registrada correctamente, está pendiente de aprobación
 *
 *     UpdateMyStoreResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/MyStore'
 *         message:
 *           type: string
 *           example: Tienda actualizada correctamente
 *
 *     CreateStoreInput:
 *       type: object
 *       description: >
 *         Creación de tienda por un administrador para un usuario existente.
 *         A diferencia de /me, requiere indicar explícitamente el userId propietario.
 *       required:
 *         - name
 *         - address
 *         - storeCategoryId
 *         - userId
 *       properties:
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *         address:
 *           type: string
 *           example: Calle 10 # 5-20
 *         neighborhood:
 *           type: string
 *           example: Centro
 *         longitude:
 *           type: number
 *           example: -74.2973
 *         latitude:
 *           type: number
 *           example: 4.5709
 *         description:
 *           type: string
 *           example: Tienda de barrio con productos de la canasta familiar
 *         phone:
 *           type: string
 *           example: "3001234567"
 *         storeCategoryId:
 *           type: integer
 *           example: 2
 *         userId:
 *           type: integer
 *           example: 8
 *         photo:
 *           type: string
 *           format: binary
 *           description: Foto de la tienda (opcional)
 *
 *     UpdateStoreInput:
 *       type: object
 *       required:
 *         - name
 *         - address
 *       properties:
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *         address:
 *           type: string
 *           example: Calle 10 # 5-20
 *         neighborhood:
 *           type: string
 *           example: Centro
 *         longitude:
 *           type: number
 *           example: -74.2973
 *         latitude:
 *           type: number
 *           example: 4.5709
 *         description:
 *           type: string
 *           example: Tienda de barrio con productos de la canasta familiar
 *         phone:
 *           type: string
 *           example: "3001234567"
 *         storeCategoryId:
 *           type: integer
 *           example: 2
 *         photo:
 *           type: string
 *           format: binary
 *           description: Foto de la tienda (opcional)
 *
 *     CreateStoreResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/StoreAdminDetail'
 *         message:
 *           type: string
 *           example: Tienda creada correctamente
 *
 *     UpdateStoreResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/StoreAdminDetail'
 *         message:
 *           type: string
 *           example: Tienda editada exitosamente
 *
 *     StoreStatusChangeResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/StoreAdminDetail'
 *         message:
 *           type: string
 *           example: Tienda eliminada correctamente
 */

/**
 * @swagger
 * /stores/public:
 *   get:
 *     summary: Lista tiendas para el catálogo público, con filtros y paginación
 *     description: >
 *       Endpoint público (sin autenticación). Los filtros disponibles
 *       dependen de la implementación de `buildStoreWhere`.
 *     tags: [Stores]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Tiendas encontradas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorePublicListResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/public/map:
 *   get:
 *     summary: Lista todas las tiendas que cumplan el filtro, sin paginar, para mostrar en un mapa
 *     description: >
 *       Endpoint público (sin autenticación). Retorna hasta 1000
 *       resultados como tope de seguridad. Usa los mismos filtros que
 *       `/stores/public` vía `buildStoreWhere`.
 *     tags: [Stores]
 *     responses:
 *       200:
 *         description: Tiendas para el mapa obtenidas correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoresForMapResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/public/{id}:
 *   get:
 *     summary: Obtiene el perfil público de una tienda con su catálogo de productos
 *     description: >
 *       Endpoint público (sin autenticación). Retorna los datos de la
 *       tienda, sus horarios, sus productos activos paginados (con
 *       filtro opcional por categoría) y las categorías disponibles
 *       para filtrar.
 *     tags: [Stores]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tienda
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página de productos
 *       - in: query
 *         name: productCategoryId
 *         schema:
 *           type: integer
 *         description: Filtro por categoría de producto
 *     responses:
 *       200:
 *         description: Tienda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StorePublicDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: Tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/me:
 *   get:
 *     summary: Obtiene la tienda del tendero autenticado
 *     description: Requiere rol de tendero.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tienda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MyStoreResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: Aún no tienes una tienda registrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/me:
 *   post:
 *     summary: Registra la tienda del tendero autenticado
 *     description: >
 *       Crea la tienda asociada al usuario autenticado con estado inicial
 *       `Pending` (pendiente de aprobación). Falla si el usuario ya tiene
 *       una tienda registrada. Acepta una foto opcional vía
 *       multipart/form-data. Registra la acción en el log de auditoría.
 *       Requiere rol de tendero.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateMyStoreInput'
 *     responses:
 *       201:
 *         description: Tienda registrada correctamente, pendiente de aprobación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateMyStoreResponse'
 *       400:
 *         description: >
 *           Campos obligatorios faltantes, categoría no enviada, o el
 *           usuario ya tiene una tienda registrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: La categoría de tienda no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/me:
 *   put:
 *     summary: Actualiza la tienda del tendero autenticado
 *     description: >
 *       Actualiza los datos de la tienda propia y, opcionalmente,
 *       reemplaza su foto (eliminando la anterior del disco). Registra
 *       el cambio en el log de auditoría con valores previos y nuevos.
 *       Requiere rol de tendero.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateMyStoreInput'
 *     responses:
 *       200:
 *         description: Tienda actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateMyStoreResponse'
 *       400:
 *         description: Campos obligatorios faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: No tienes una tienda registrada, o la categoría enviada no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/me/visibility:
 *   patch:
 *     summary: Pausa o reactiva la visibilidad de la tienda propia en el directorio público
 *     description: >
 *       Permite al propietario ocultar temporalmente su tienda del
 *       directorio público, el mapa y el acceso directo por link, sin
 *       eliminar ningún dato (RF-43). Es independiente del campo `status`,
 *       que controla el administrador. Solo puede cambiarse cuando la
 *       tienda está en estado Active; si está Pending, Inactive,
 *       Incomplete o Rejected, se rechaza la solicitud. Requiere rol de
 *       tendero y tener una tienda asociada.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [isVisible]
 *             properties:
 *               isVisible:
 *                 type: boolean
 *                 description: true para reactivar, false para pausar
 *     responses:
 *       200:
 *         description: Visibilidad actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                 message:
 *                   type: string
 *       400:
 *         description: isVisible faltante/no booleano, o la tienda aún está pendiente de aprobación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de tendero, o la tienda no está activa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: No tienes una tienda asociada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores:
 *   get:
 *     summary: Obtiene el listado paginado de todas las tiendas del sistema
 *     description: Requiere rol de administrador.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *     responses:
 *       200:
 *         description: Listado de tiendas obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/{id}:
 *   get:
 *     summary: Obtiene una tienda específica por su ID
 *     description: Requiere rol de administrador.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tienda
 *     responses:
 *       200:
 *         description: Tienda encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreAdminDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: Tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores:
 *   post:
 *     summary: Crea una tienda para un usuario existente (administración)
 *     description: >
 *       A diferencia de `/stores/me`, requiere indicar explícitamente el
 *       `userId` propietario y valida que no tenga ya una tienda
 *       asociada. La tienda se crea con estado `Active` directamente
 *       (sin pasar por aprobación). Requiere rol de administrador.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateStoreInput'
 *     responses:
 *       201:
 *         description: Tienda creada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateStoreResponse'
 *       400:
 *         description: >
 *           Campos obligatorios faltantes, categoría o usuario no
 *           enviados, o el usuario ya tiene una tienda asociada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: El usuario propietario o la categoría de tienda no existen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/{id}:
 *   put:
 *     summary: Actualiza una tienda existente (administración)
 *     description: Requiere rol de administrador.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tienda a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateStoreInput'
 *     responses:
 *       200:
 *         description: Tienda editada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateStoreResponse'
 *       400:
 *         description: ID inválido o campos obligatorios faltantes
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: Tienda no encontrada, o la categoría enviada no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/delete/{id}:
 *   put:
 *     summary: Desactiva (elimina lógicamente) una tienda
 *     description: >
 *       Marca la tienda como Inactive. No elimina el registro
 *       físicamente. Requiere rol de administrador.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tienda a desactivar
 *     responses:
 *       200:
 *         description: Tienda eliminada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreStatusChangeResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: Tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */

/**
 * @swagger
 * /stores/restore/{id}:
 *   put:
 *     summary: Restablece (reactiva) una tienda previamente desactivada
 *     description: >
 *       Marca la tienda como Active. Requiere rol de administrador.
 *     tags: [Stores]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la tienda a restablecer
 *     responses:
 *       200:
 *         description: Tienda restablecida correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreStatusChangeResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       404:
 *         description: Tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreError'
 */
