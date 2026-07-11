/**
 * Documentación Swagger del módulo de ventas.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a ventas.routes.js.
 *
 * Nota: al igual que productos y movimientos, este módulo no usa el
 * wrapper { success, data }; los errores se propagan con next(error)
 * hacia el manejador global, que responde con { message }, así que
 * reutiliza un schema de error propio: SaleError.
 *
 * Nota importante: los endpoints de LECTURA (getSales, getSalesDetailed,
 * getSaleById) usan `select` explícito en Prisma, por lo que su forma de
 * respuesta es "limpia" (sin storeId, con product anidado donde aplica).
 * En cambio createSale (tx.sale.create con include) y cancelSale
 * (tx.sale.update sin select/include) devuelven la fila cruda de Prisma:
 * incluyen storeId, y en el caso de createSale los detalles NO traen el
 * producto anidado; cancelSale ni siquiera devuelve `details`. Por eso
 * usan schemas separados (SaleRawWithDetails / SaleRaw / SaleDetailRaw)
 * en vez de reutilizar Sale/SaleDetail.
 */

/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: Registro, consulta, cancelación y reportes de ventas
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     SaleError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Venta no encontrada
 *
 *     SaleStatus:
 *       type: string
 *       enum: [Completed, Cancelled]
 *       description: Estado de la venta
 *
 *     SaleListItem:
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
 *           $ref: '#/components/schemas/SaleStatus'
 *         userId:
 *           type: integer
 *           example: 2
 *
 *     SaleDetail:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 340
 *         productId:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: number
 *           example: 3
 *         unitPrice:
 *           type: number
 *           example: 2500
 *         subtotal:
 *           type: number
 *           example: 7500
 *         product:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Arroz 500g
 *             photo:
 *               type: string
 *               nullable: true
 *               example: /uploads/products/1699999999-arroz.jpg
 *
 *     Sale:
 *       type: object
 *       description: Forma "limpia" de la venta, devuelta por GET /sales/{id} (usa select explícito).
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
 *           $ref: '#/components/schemas/SaleStatus'
 *         userId:
 *           type: integer
 *           example: 2
 *         cancellationReason:
 *           type: string
 *           nullable: true
 *           example: "Cliente se equivocó de producto"
 *         cancellationDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleDetail'
 *
 *     SaleDetailRaw:
 *       type: object
 *       description: >
 *         Detalle de venta tal como lo devuelve Prisma sin select (usado
 *         solo en la respuesta de POST /sales). No incluye el producto
 *         anidado, pero sí el saleId de la fila.
 *       properties:
 *         id:
 *           type: integer
 *           example: 340
 *         saleId:
 *           type: integer
 *           example: 120
 *         productId:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: number
 *           example: 3
 *         unitPrice:
 *           type: number
 *           example: 2500
 *         subtotal:
 *           type: number
 *           example: 7500
 *
 *     SaleRaw:
 *       type: object
 *       description: >
 *         Fila cruda de Sale devuelta por PUT /sales/cancel/{id} (sin
 *         select/include). Incluye storeId y NO incluye el arreglo details.
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
 *           $ref: '#/components/schemas/SaleStatus'
 *         userId:
 *           type: integer
 *           example: 2
 *         storeId:
 *           type: integer
 *           example: 3
 *         cancellationReason:
 *           type: string
 *           nullable: true
 *           example: "Cliente se equivocó de producto"
 *         cancellationDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     SaleRawWithDetails:
 *       description: >
 *         Fila cruda de Sale devuelta por POST /sales (tx.sale.create con
 *         include: { details: true }). Incluye storeId y su arreglo
 *         details, pero cada detalle es un SaleDetailRaw (sin product
 *         anidado).
 *       allOf:
 *         - $ref: '#/components/schemas/SaleRaw'
 *         - type: object
 *           properties:
 *             details:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SaleDetailRaw'
 *
 *     SaleDetailedProductInfo:
 *       type: object
 *       description: Datos del producto embebidos en cada línea del detalle, pensados para el export "fila por producto" (RF-47).
 *       properties:
 *         name:
 *           type: string
 *           example: Arroz Diana 500g
 *         referenceCode:
 *           type: string
 *           nullable: true
 *           example: REF-00123
 *         productCategory:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Granos
 *         unitOfMeasure:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Unidad
 *
 *     SaleDetailedLine:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: number
 *           example: 3
 *         unitPrice:
 *           type: number
 *           example: 2500
 *         subtotal:
 *           type: number
 *           example: 7500
 *         product:
 *           $ref: '#/components/schemas/SaleDetailedProductInfo'
 *
 *     SaleDetailedItem:
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
 *           $ref: '#/components/schemas/SaleStatus'
 *         userId:
 *           type: integer
 *           example: 2
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleDetailedLine'
 *
 *     SaleDetailedListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleDetailedItem'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 610
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 61
 *
 *     SaleListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/SaleListItem'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 610
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 61
 *
 *     SaleDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/Sale'
 *
 *     SaleDetailInput:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           example: 12
 *         quantity:
 *           type: number
 *           example: 3
 *
 *     CreateSaleInput:
 *       type: object
 *       required:
 *         - details
 *       properties:
 *         date:
 *           type: string
 *           format: date-time
 *           description: Fecha de la venta. Si no se envía, se usa la fecha actual.
 *         details:
 *           type: array
 *           minItems: 1
 *           items:
 *             $ref: '#/components/schemas/SaleDetailInput'
 *
 *     ProductoEnAlerta:
 *       type: object
 *       description: Producto cuyo stock quedó en el umbral de alerta o por debajo tras esta venta (RF-23).
 *       properties:
 *         productId:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *           example: Arroz Diana 500g
 *         currentStock:
 *           type: integer
 *           example: 3
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         estado:
 *           type: string
 *           enum: [Crítico, Agotado]
 *           example: Crítico
 *
 *     CreateSaleResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/SaleRawWithDetails'
 *         productosEnAlerta:
 *           type: array
 *           description: Lista de productos que quedaron en alerta de stock bajo tras esta venta. Vacío si ninguno quedó en riesgo.
 *           items:
 *             $ref: '#/components/schemas/ProductoEnAlerta'
 *         message:
 *           type: string
 *           example: Venta registrada correctamente
 *
 *     CancelSaleInput:
 *       type: object
 *       required:
 *         - cancellationReason
 *       properties:
 *         cancellationReason:
 *           type: string
 *           example: "Cliente se equivocó de producto"
 *
 *     CancelSaleResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/SaleRaw'
 *         message:
 *           type: string
 *           example: Venta cancelada correctamente
 *
 *     SalesReportTopProduct:
 *       type: object
 *       properties:
 *         productId:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *           example: Arroz 500g
 *         cantidad:
 *           type: number
 *           example: 130
 *         ingresos:
 *           type: number
 *           example: 260000
 *
 *     SalesReportSaleSummary:
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
 *
 *     SalesReportResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: object
 *           properties:
 *             totalVentas:
 *               type: integer
 *               example: 85
 *             totalIngresos:
 *               type: number
 *               example: 4250000
 *             promedioVenta:
 *               type: number
 *               example: 50000
 *             productosMasVendidos:
 *               type: array
 *               description: Top 10 productos más vendidos en el período, ordenados por cantidad
 *               items:
 *                 $ref: '#/components/schemas/SalesReportTopProduct'
 *             ventas:
 *               type: array
 *               description: Ventas completadas del período (solo id, fecha y total)
 *               items:
 *                 $ref: '#/components/schemas/SalesReportSaleSummary'
 */

/**
 * @swagger
 * /sales:
 *   get:
 *     summary: Obtiene el listado paginado de ventas de la tienda
 *     description: >
 *       Retorna las ventas de la tienda del usuario autenticado, con
 *       filtros opcionales por rango de fecha, rango de total, producto
 *       y estado. El parámetro `all=true` permite exportar hasta 20000
 *       registros sin paginar (uso pensado para exportaciones masivas).
 *       Requiere rol de tendero.
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página (ignorado si `all=true`)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (inclusive, hasta las 23:59:59.999)
 *       - in: query
 *         name: minTotal
 *         schema:
 *           type: number
 *         description: Total mínimo de la venta
 *       - in: query
 *         name: maxTotal
 *         schema:
 *           type: number
 *         description: Total máximo de la venta
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filtra ventas que incluyan este producto en el detalle
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/SaleStatus'
 *         description: Filtro por estado de la venta
 *       - in: query
 *         name: all
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: >
 *           Si es "true", retorna hasta 20000 registros sin paginar
 *           (para exportaciones), ignorando `page`
 *     responses:
 *       200:
 *         description: Listado de ventas obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 */

/**
 * @swagger
 * /sales/detailed:
 *   get:
 *     summary: Obtiene ventas con el detalle de productos, para exportar una fila por producto (RF-47)
 *     description: >
 *       Acepta los mismos filtros que GET /sales (fecha, total, producto,
 *       estado), pero cada venta trae su arreglo `details` con el producto,
 *       categoría, referencia y unidad de cada línea vendida. Pensado para
 *       que el frontend aplane el resultado a una fila por producto al
 *       exportar a Excel. No reemplaza GET /sales: esa ruta sigue
 *       usándose para la exportación resumen (una fila por venta).
 *       Requiere rol de tendero.
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página (ignorado si `all=true`)
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (inclusive, hasta las 23:59:59.999)
 *       - in: query
 *         name: minTotal
 *         schema:
 *           type: number
 *         description: Total mínimo de la venta
 *       - in: query
 *         name: maxTotal
 *         schema:
 *           type: number
 *         description: Total máximo de la venta
 *       - in: query
 *         name: productId
 *         schema:
 *           type: integer
 *         description: Filtra ventas que incluyan este producto en el detalle
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/SaleStatus'
 *         description: Filtro por estado de la venta
 *       - in: query
 *         name: all
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *         description: >
 *           Si es "true", retorna hasta 20000 registros sin paginar
 *           (para exportaciones), ignorando `page`
 *     responses:
 *       200:
 *         description: Listado detallado de ventas obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleDetailedListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 */

/**
 * @swagger
 * /sales/report:
 *   get:
 *     summary: Obtiene un reporte agregado de ventas para un período
 *     description: >
 *       Calcula el total de ventas, ingresos totales, promedio por venta
 *       y el top 10 de productos más vendidos, considerando únicamente
 *       ventas completadas dentro del rango de fechas indicado. Requiere
 *       rol de tendero.
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (inclusive)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (inclusive, hasta las 23:59:59.999)
 *     responses:
 *       200:
 *         description: Reporte generado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SalesReportResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 */

/**
 * @swagger
 * /sales/{id}:
 *   get:
 *     summary: Obtiene una venta específica por su ID, incluyendo su detalle
 *     description: >
 *       Retorna la venta solicitada con el detalle de productos vendidos,
 *       siempre que pertenezca a la tienda del usuario autenticado.
 *       Requiere rol de tendero.
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta
 *     responses:
 *       200:
 *         description: Venta encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       404:
 *         description: Venta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 */

/**
 * @swagger
 * /sales:
 *   post:
 *     summary: Registra una nueva venta y descuenta el stock de los productos vendidos
 *     description: >
 *       Valida que cada producto del detalle exista en la tienda y tenga
 *       stock suficiente, calcula el total y descuenta el stock de forma
 *       transaccional. Si falla la validación de cualquier producto, se
 *       revierte toda la venta. El objeto `data` de la respuesta es la
 *       fila cruda de Prisma (incluye storeId) y cada detalle NO trae el
 *       producto anidado, a diferencia de GET /sales/{id}. Requiere rol
 *       de tendero.
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSaleInput'
 *     responses:
 *       201:
 *         description: Venta registrada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateSaleResponse'
 *       400:
 *         description: >
 *           Detalle vacío o inválido, cantidades inválidas, o stock
 *           insuficiente para alguno de los productos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       404:
 *         description: Alguno de los productos del detalle no existe en la tienda
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 */

/**
 * @swagger
 * /sales/cancel/{id}:
 *   put:
 *     summary: Cancela una venta y devuelve el stock de los productos vendidos
 *     description: >
 *       Solo permite cancelar ventas dentro de las 24 horas siguientes a
 *       su registro y que no estén ya canceladas. Requiere un motivo de
 *       cancelación. Devuelve el stock de cada producto del detalle de
 *       forma transaccional. El objeto `data` de la respuesta es la fila
 *       cruda de Prisma (incluye storeId) y NO incluye el arreglo
 *       `details`, a diferencia de GET /sales/{id}. Requiere rol de
 *       tendero.
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la venta a cancelar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CancelSaleInput'
 *     responses:
 *       200:
 *         description: Venta cancelada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CancelSaleResponse'
 *       400:
 *         description: >
 *           ID inválido, motivo no enviado, la venta ya está cancelada,
 *           o han pasado más de 24 horas desde su registro
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       404:
 *         description: Venta no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SaleError'
 */
