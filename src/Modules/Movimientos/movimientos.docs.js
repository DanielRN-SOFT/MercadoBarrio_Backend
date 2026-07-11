/**
 * Documentación Swagger del módulo de movimientos.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * @swagger que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a movimientos.routes.js.
 *
 * Nota: a diferencia de dashboard, los endpoints de movimientos no usan
 * el wrapper { success, data }. Los errores se propagan con next(error)
 * hacia el manejador global, que responde solo con { message }, así que
 * usan un schema de error propio: MovementError.
 *
 * Nota: getProductMovementReport es la excepción del módulo: no usa
 * next(error), maneja sus propios try/catch y responde directamente con
 * res.status(...).json({ message }). El shape es igual a MovementError,
 * así que reutiliza el mismo schema.
 */

/**
 * @swagger
 * tags:
 *   name: Movements
 *   description: Gestión de movimientos de inventario (entradas, salidas y ajustes de stock)
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     MovementError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Movimiento no encontrado
 *
 *     MovementType:
 *       type: string
 *       enum: [Entry, Exit, AdjustEntry, AdjustExit]
 *       description: >
 *         Tipo de movimiento. Entry y AdjustEntry suman al stock del producto;
 *         Exit y AdjustExit lo restan.
 *
 *     MovementStatus:
 *       type: string
 *       enum: [Active, Cancelled]
 *       description: Estado actual del movimiento
 *
 *     MovementDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 45
 *         movementId:
 *           type: integer
 *           example: 12
 *         productId:
 *           type: integer
 *           example: 5
 *         quantity:
 *           type: number
 *           example: 10
 *         unitCost:
 *           type: number
 *           nullable: true
 *           example: 2500
 *
 *     MovementDetailWithProduct:
 *       description: >
 *         Detalle de movimiento con el nombre del producto anidado. Se usa
 *         únicamente en el listado (GET /movements), donde el controller
 *         incluye product: { select: { name: true } } en cada detalle.
 *       allOf:
 *         - $ref: '#/components/schemas/MovementDetail'
 *         - type: object
 *           properties:
 *             product:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: Arroz 500g
 *
 *     Movement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         date:
 *           type: string
 *           format: date-time
 *         status:
 *           $ref: '#/components/schemas/MovementStatus'
 *         type:
 *           $ref: '#/components/schemas/MovementType'
 *         reason:
 *           type: string
 *           nullable: true
 *           example: "Ajuste por conteo físico"
 *         userId:
 *           type: integer
 *           example: 2
 *         storeId:
 *           type: integer
 *           example: 3
 *         supplierId:
 *           type: integer
 *           nullable: true
 *           example: 7
 *         cancellationDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     MovementWithDetails:
 *       description: >
 *         Movimiento con su detalle completo de productos. Usado en la
 *         respuesta de GET /movements/{id}.
 *       allOf:
 *         - $ref: '#/components/schemas/Movement'
 *         - type: object
 *           properties:
 *             details:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovementDetail'
 *
 *     MovementListItem:
 *       description: >
 *         Movimiento tal como aparece en el listado de GET /movements:
 *         incluye el detalle con nombre de producto y el proveedor completo.
 *       allOf:
 *         - $ref: '#/components/schemas/Movement'
 *         - type: object
 *           properties:
 *             details:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/MovementDetailWithProduct'
 *             supplier:
 *               type: object
 *               nullable: true
 *               description: Datos completos del proveedor asociado, si aplica
 *
 *     MovementProductInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           example: 5
 *         quantity:
 *           type: number
 *           example: 10
 *         unitCost:
 *           type: number
 *           example: 2500
 *
 *     CreateMovementInput:
 *       type: object
 *       required:
 *         - type
 *       properties:
 *         type:
 *           $ref: '#/components/schemas/MovementType'
 *         reason:
 *           type: string
 *           example: "Ajuste por conteo físico"
 *         supplierId:
 *           type: integer
 *           example: 3
 *         products:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MovementProductInput'
 *
 *     MovementListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/MovementListItem'
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
 *
 *     MovementDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/MovementWithDetails'
 *
 *     CreateMovementResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Movement'
 *         message:
 *           type: string
 *           example: Movimiento registrado correctamente
 *
 *     CancelMovementResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Movimiento cancelado correctamente
 *
 *     ProductMovementMetrics:
 *       type: object
 *       description: >
 *         Métricas de un producto dentro del rango de fechas consultado.
 *         Solo incluye productos que tuvieron al menos un movimiento activo
 *         (no cancelado) en el período.
 *       properties:
 *         id:
 *           type: integer
 *           example: 5
 *         name:
 *           type: string
 *           example: Arroz 500g
 *         referenceCode:
 *           type: string
 *           example: ARR-500
 *         currentStock:
 *           type: integer
 *           example: 12
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         entradas:
 *           type: number
 *           description: Suma de cantidades de movimientos Entry y AdjustEntry en el período
 *           example: 50
 *         salidas:
 *           type: number
 *           description: Suma de cantidades de movimientos Exit y AdjustExit en el período
 *           example: 38
 *         totalMovimientos:
 *           type: number
 *           description: Suma total de unidades movidas (entradas + salidas) en el período
 *           example: 88
 *         nivelRotacion:
 *           type: string
 *           enum: [Baja, Media, Alta]
 *           description: "Alta si salidas >= 100, Media si salidas >= 30, Baja en cualquier otro caso"
 *           example: Media
 *         requiereReabastecimiento:
 *           type: boolean
 *           description: true si currentStock <= lowStockThreshold
 *           example: false
 *         sugerenciaCompra:
 *           type: number
 *           description: >
 *             Si requiereReabastecimiento es true, es max(salidas - currentStock, 0);
 *             de lo contrario es 0.
 *           example: 0
 *
 *     ProductMovementMetricsWithPercentage:
 *       description: >
 *         Igual a ProductMovementMetrics, pero incluye el porcentaje que
 *         representan las salidas de este producto sobre el total de
 *         salidas del período. Solo aparece en reporteCompletoPorProducto.
 *       allOf:
 *         - $ref: '#/components/schemas/ProductMovementMetrics'
 *         - type: object
 *           properties:
 *             porcentajeRotacion:
 *               type: number
 *               description: (salidas del producto / total de salidas del período) * 100, redondeado a 2 decimales. 0 si no hubo salidas en el período.
 *               example: 18.75
 *
 *     MovementReportResponse:
 *       type: object
 *       properties:
 *         periodo:
 *           type: object
 *           properties:
 *             startDate:
 *               type: string
 *               format: date-time
 *             endDate:
 *               type: string
 *               format: date-time
 *         resumenGeneral:
 *           type: object
 *           properties:
 *             totalProductosConMovimiento:
 *               type: integer
 *               example: 24
 *             totalUnidadesEntrantes:
 *               type: number
 *               example: 320
 *             totalUnidadesSalientes:
 *               type: number
 *               example: 275
 *         productosMayorRotacion:
 *           type: array
 *           description: Top 5 productos con más salidas en el período (salidas > 0), ordenados de mayor a menor
 *           items:
 *             $ref: '#/components/schemas/ProductMovementMetrics'
 *         productosMenorRotacion:
 *           type: array
 *           description: Top 5 productos con menos salidas en el período (incluye productos con 0 salidas), ordenados de menor a mayor
 *           items:
 *             $ref: '#/components/schemas/ProductMovementMetrics'
 *         reporteCompletoPorProducto:
 *           type: array
 *           description: Listado completo de todos los productos con movimiento en el período, con el porcentaje de rotación incluido
 *           items:
 *             $ref: '#/components/schemas/ProductMovementMetricsWithPercentage'
 */

/**
 * @swagger
 * /movements/reporte-resumen:
 *   get:
 *     summary: Genera un reporte resumido de rotación de inventario por producto
 *     description: >
 *       Analiza todos los movimientos ACTIVOS (no cancelados) de la tienda
 *       dentro del rango de fechas indicado, y calcula por producto el total
 *       de entradas, salidas, nivel de rotación (Baja/Media/Alta según las
 *       salidas), si requiere reabastecimiento (currentStock <=
 *       lowStockThreshold) y una sugerencia de cantidad a comprar. También
 *       retorna el Top 5 de productos con mayor y menor rotación, y un
 *       resumen general del período. Requiere rol de tendero.
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango a analizar (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango a analizar (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementReportResponse'
 *       400:
 *         description: >
 *           startDate o endDate no fueron enviados, no son fechas válidas,
 *           o startDate es mayor que endDate
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       500:
 *         description: Error interno del servidor al compilar el reporte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 */

/**
 * @swagger
 * /movements:
 *   get:
 *     summary: Obtiene el listado paginado de movimientos de la tienda
 *     description: >
 *       Retorna los movimientos registrados en la tienda del usuario autenticado,
 *       incluyendo sus detalles (con el nombre del producto) y, si aplica, el
 *       proveedor asociado. Admite filtros por rango de fechas, tipo de
 *       movimiento y producto. Requiere rol de tendero.
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página a consultar (se ignora si all=true)
 *       - in: query
 *         name: all
 *         schema:
 *           type: boolean
 *           default: false
 *         description: >
 *           Si es "true", omite la paginación y retorna todos los resultados
 *           que coincidan con los filtros. Pensado para exportar a Excel.
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango de búsqueda (YYYY-MM-DD)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango de búsqueda (YYYY-MM-DD)
 *       - in: query
 *         name: type
 *         schema:
 *           $ref: '#/components/schemas/MovementType'
 *         description: Filtro por tipo de movimiento
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filtro por producto involucrado en el movimiento
 *     responses:
 *       200:
 *         description: Listado de movimientos obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementListResponse'
 *       400:
 *         description: La fecha inicial (startDate) es mayor que la fecha final (endDate)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 */

/**
 * @swagger
 * /movements/{id}:
 *   get:
 *     summary: Obtiene un movimiento específico por su ID
 *     description: >
 *       Retorna el movimiento solicitado junto con su detalle completo de
 *       productos, siempre que pertenezca a la tienda del usuario
 *       autenticado. Requiere rol de tendero.
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del movimiento
 *     responses:
 *       200:
 *         description: Movimiento encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       403:
 *         description: El movimiento pertenece a otra tienda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 */

/**
 * @swagger
 * /movements:
 *   post:
 *     summary: Crea un nuevo movimiento y ajusta el stock de los productos involucrados
 *     description: >
 *       Registra un movimiento de tipo Entry, Exit, AdjustEntry o AdjustExit.
 *       Para movimientos de salida (Exit/AdjustExit) valida que exista stock
 *       suficiente antes de aplicar el cambio. La operación es transaccional:
 *       si falla el ajuste de stock de cualquier producto, se revierte todo
 *       el movimiento. Requiere rol de tendero.
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateMovementInput'
 *     responses:
 *       201:
 *         description: Movimiento registrado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateMovementResponse'
 *       400:
 *         description: >
 *           Tipo de movimiento inválido, cantidades inválidas en los productos,
 *           o stock insuficiente para completar una salida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 */

/**
 * @swagger
 * /movements/delete/{id}:
 *   post:
 *     summary: Cancela un movimiento existente y revierte su efecto en el stock
 *     description: >
 *       Revierte el efecto sobre el stock que tuvo el movimiento al crearse
 *       (si fue una salida, devuelve el stock; si fue una entrada, lo resta)
 *       y marca el movimiento como cancelado. Falla si el movimiento ya está
 *       cancelado o si no hay stock suficiente para revertir una entrada.
 *       Requiere rol de tendero.
 *     tags: [Movements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del movimiento a cancelar
 *     responses:
 *       200:
 *         description: Movimiento cancelado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CancelMovementResponse'
 *       400:
 *         description: >
 *           ID inválido, el movimiento ya está cancelado, o no hay stock
 *           suficiente para revertirlo
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       404:
 *         description: Movimiento no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MovementError'
 */
