/**
 * Documentación Swagger del módulo de dashboard.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * @swagger que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a dashboard.routes.js.
 *
 * Nota: a diferencia de otros módulos, los endpoints de dashboard responden
 * siempre con la forma { success, data } o { success, message } (nunca solo
 * { message }), así que usan un schema de error propio: DashboardError.
 */

/**
 * @swagger
 * tags:
 *   name: Dashboard
 *   description: Métricas y gráficas para los paneles de administrador y tendero
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     DashboardError:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: Error interno del servidor.
 *
 *     ActorRef:
 *       type: object
 *       description: Referencia resumida a una tienda o usuario
 *       properties:
 *         id:
 *           type: integer
 *           example: 3
 *         name:
 *           type: string
 *           example: Tienda El Ahorro
 *
 *     RecentSale:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 120
 *         date:
 *           type: string
 *           format: date-time
 *         total:
 *           type: number
 *           example: 45900
 *         status:
 *           type: string
 *           example: Completed
 *         store:
 *           $ref: '#/components/schemas/ActorRef'
 *         user:
 *           $ref: '#/components/schemas/ActorRef'
 *
 *     RecentMovement:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 87
 *         type:
 *           type: string
 *           example: Entry
 *         date:
 *           type: string
 *           format: date-time
 *         status:
 *           type: string
 *           example: Active
 *         store:
 *           $ref: '#/components/schemas/ActorRef'
 *         user:
 *           $ref: '#/components/schemas/ActorRef'
 *         supplier:
 *           $ref: '#/components/schemas/ActorRef'
 *
 *     DailySalesPoint:
 *       type: object
 *       description: Punto de la serie de ventas de los últimos 30 días
 *       properties:
 *         date:
 *           type: string
 *           format: date
 *           example: "2026-07-09"
 *         count:
 *           type: integer
 *           example: 4
 *         revenue:
 *           type: number
 *           example: 132500
 *
 *     NameValuePair:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Activo
 *         value:
 *           type: integer
 *           example: 12
 *
 *     AdminDashboardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 58
 *                 active:
 *                   type: integer
 *                   example: 50
 *                 inactive:
 *                   type: integer
 *                   example: 8
 *             stores:
 *               type: object
 *               description: >
 *                 Conteo de tiendas por estado. Los estados usan las etiquetas
 *                 tal como están almacenadas (Activo, Inactivo, Pendiente,
 *                 Incompleto, Rechazado).
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 30
 *                 active:
 *                   type: integer
 *                   example: 22
 *                 inactive:
 *                   type: integer
 *                   example: 3
 *                 pending:
 *                   type: integer
 *                   example: 2
 *                 incomplete:
 *                   type: integer
 *                   example: 2
 *                 rejected:
 *                   type: integer
 *                   example: 1
 *             products:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 340
 *                 lowStock:
 *                   type: integer
 *                   example: 15
 *             suppliers:
 *               type: object
 *               properties:
 *                 active:
 *                   type: integer
 *                   example: 12
 *             movements:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 900
 *                 thisMonth:
 *                   type: integer
 *                   example: 75
 *             sales:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 610
 *                 today:
 *                   type: integer
 *                   example: 9
 *                 thisMonth:
 *                   type: integer
 *                   example: 140
 *                 revenueToday:
 *                   type: number
 *                   example: 320000
 *                 revenueThisMonth:
 *                   type: number
 *                   example: 5400000
 *             recentActivity:
 *               type: object
 *               properties:
 *                 sales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecentSale'
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecentMovement'
 *
 *     AdminChartsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             dailySales:
 *               type: array
 *               description: Serie de los últimos 30 días
 *               items:
 *                 $ref: '#/components/schemas/DailySalesPoint'
 *             storesByStatus:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NameValuePair'
 *             movementsByType:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Entry
 *                   count:
 *                     type: integer
 *                     example: 40
 *             topStoresByRevenue:
 *               type: array
 *               description: Top 5 tiendas por ingresos del mes actual
 *               items:
 *                 type: object
 *                 properties:
 *                   storeId:
 *                     type: integer
 *                     example: 3
 *                   name:
 *                     type: string
 *                     example: Tienda El Ahorro
 *                   revenue:
 *                     type: number
 *                     example: 980000
 *             usersByRole:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NameValuePair'
 *
 *     StoreDashboardResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             store:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 3
 *                 name:
 *                   type: string
 *                   example: Tienda El Ahorro
 *                 status:
 *                   type: string
 *                   example: Activo
 *             products:
 *               type: object
 *               properties:
 *                 total:
 *                   type: integer
 *                   example: 45
 *                 lowStock:
 *                   type: integer
 *                   example: 3
 *                 lowStockList:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 12
 *                       name:
 *                         type: string
 *                         example: Arroz 500g
 *                       currentStock:
 *                         type: integer
 *                         example: 2
 *                       lowStockThreshold:
 *                         type: integer
 *                         example: 5
 *             sales:
 *               type: object
 *               properties:
 *                 today:
 *                   type: integer
 *                   example: 6
 *                 thisMonth:
 *                   type: integer
 *                   example: 80
 *                 lastMonth:
 *                   type: integer
 *                   example: 70
 *                 revenueToday:
 *                   type: number
 *                   example: 210000
 *                 revenueThisMonth:
 *                   type: number
 *                   example: 3100000
 *                 revenueLastMonth:
 *                   type: number
 *                   example: 2800000
 *                 revenueVariationPercent:
 *                   type: number
 *                   nullable: true
 *                   description: >
 *                     Variación porcentual de ingresos vs. el mes anterior.
 *                     null si el mes anterior no tuvo ingresos.
 *                   example: 10.71
 *             movements:
 *               type: object
 *               properties:
 *                 entriesThisMonth:
 *                   type: integer
 *                   example: 18
 *                 exitsThisMonth:
 *                   type: integer
 *                   example: 22
 *             topProducts:
 *               type: array
 *               description: Top 5 productos más vendidos del mes actual
 *               items:
 *                 type: object
 *                 properties:
 *                   productId:
 *                     type: integer
 *                     example: 12
 *                   productName:
 *                     type: string
 *                     example: Arroz 500g
 *                   quantitySold:
 *                     type: integer
 *                     example: 130
 *                   revenue:
 *                     type: number
 *                     example: 260000
 *             recentActivity:
 *               type: object
 *               properties:
 *                 sales:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecentSale'
 *                 movements:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/RecentMovement'
 *
 *     StoreChartsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: object
 *           properties:
 *             dailySales:
 *               type: array
 *               description: Serie de los últimos 30 días para la tienda
 *               items:
 *                 $ref: '#/components/schemas/DailySalesPoint'
 *             movementsByType:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/NameValuePair'
 *             topProducts:
 *               type: array
 *               description: Top 5 productos más vendidos del mes actual
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Arroz 500g
 *                   quantitySold:
 *                     type: integer
 *                     example: 130
 *                   revenue:
 *                     type: number
 *                     example: 260000
 *             salesByWeekDay:
 *               type: array
 *               description: Ventas agregadas por día de la semana (Dom a Sáb) del mes actual
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: Lun
 *                   count:
 *                     type: integer
 *                     example: 12
 *                   revenue:
 *                     type: number
 *                     example: 340000
 */

/**
 * @swagger
 * /dashboard/admin:
 *   get:
 *     summary: Métricas generales del sistema (panel de administrador)
 *     description: >
 *       Retorna conteos y totales de usuarios, tiendas, productos, proveedores,
 *       movimientos y ventas, junto con actividad reciente. Requiere rol de administrador.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas del panel de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminDashboardResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 */

/**
 * @swagger
 * /dashboard/admin/charts:
 *   get:
 *     summary: Datos para las gráficas del panel de administrador
 *     description: >
 *       Retorna la serie de ventas de los últimos 30 días, distribución de tiendas
 *       por estado, movimientos por tipo del mes actual, top 5 tiendas por ingresos
 *       y distribución de usuarios por rol. Requiere rol de administrador.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos para las gráficas del administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AdminChartsResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       403:
 *         description: El usuario no tiene rol de administrador
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 */

/**
 * @swagger
 * /dashboard/store:
 *   get:
 *     summary: Métricas de la tienda del tendero autenticado
 *     description: >
 *       Retorna productos con bajo stock, ventas e ingresos de hoy, este mes y el
 *       mes anterior (con variación porcentual), movimientos de entrada/salida del
 *       mes, top 5 productos más vendidos y actividad reciente. Requiere rol de
 *       tendero y una tienda asociada.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métricas del panel del tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreDashboardResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       404:
 *         description: Tienda no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 */

/**
 * @swagger
 * /dashboard/store/charts:
 *   get:
 *     summary: Datos para las gráficas del panel del tendero
 *     description: >
 *       Retorna la serie de ventas de los últimos 30 días de la tienda, movimientos
 *       por tipo del mes actual, top 5 productos más vendidos y ventas agregadas
 *       por día de la semana del mes actual. Requiere rol de tendero y una tienda asociada.
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos para las gráficas del tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StoreChartsResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DashboardError'
 */
