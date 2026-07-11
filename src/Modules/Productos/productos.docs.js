/**
 * Documentación Swagger del módulo de productos.
 *
 * Este archivo no exporta nada ejecutable: solo contiene los bloques
 * @swagger que swagger-jsdoc escanea para generar el spec. Debe estar
 * incluido en el array `apis` de la configuración de swagger-jsdoc,
 * junto a productos.routes.js.
 *
 * Nota: al igual que movimientos, este módulo no usa el wrapper
 * { success, data }; los errores se propagan con next(error) hacia el
 * manejador global, que responde con { message }, así que reutiliza
 * un schema de error propio: ProductError.
 *
 * Nota: create y update reciben multipart/form-data porque aceptan un
 * archivo de foto (uploadProductPhoto.single("photo")). Los campos
 * numéricos llegan como string y se parsean en el controller.
 *
 * Nota (RF-46): getProductStockTimeline reutiliza los schemas
 * MovementType, MovementStatus y SaleStatus ya definidos en la
 * documentación de movimientos y ventas (swagger-jsdoc combina todos los
 * archivos del array `apis` en un solo spec, así que estos $ref son
 * válidos aquí sin redefinirlos).
 */

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Gestión de productos, inventario y catálogo público
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     ProductError:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Producto no encontrado
 *
 *     ProductStatus:
 *       type: string
 *       enum: [Active, Inactive]
 *       description: Estado del producto
 *
 *     ProductCategoryRef:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 4
 *         name:
 *           type: string
 *           example: Abarrotes
 *
 *     Product:
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
 *         currentStock:
 *           type: integer
 *           example: 40
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         productCategoryId:
 *           type: integer
 *           example: 4
 *         photo:
 *           type: string
 *           nullable: true
 *           example: /uploads/products/1699999999-arroz.jpg
 *         unitOfMeasureId:
 *           type: integer
 *           example: 2
 *         productCategory:
 *           $ref: '#/components/schemas/ProductCategoryRef'
 *
 *     ProductDetail:
 *       type: object
 *       description: Producto con campos adicionales para vista de detalle
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
 *           example: Arroz blanco de grano largo
 *         referenceCode:
 *           type: string
 *           nullable: true
 *           example: ARR-500
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         photo:
 *           type: string
 *           nullable: true
 *         currentStock:
 *           type: integer
 *           example: 40
 *         status:
 *           $ref: '#/components/schemas/ProductStatus'
 *         productCategoryId:
 *           type: integer
 *           example: 4
 *         unitOfMeasureId:
 *           type: integer
 *           example: 2
 *
 *     ProductInventoryItem:
 *       type: object
 *       description: Producto activo con estado de inventario calculado
 *       properties:
 *         id:
 *           type: integer
 *           example: 12
 *         name:
 *           type: string
 *           example: Arroz 500g
 *         currentStock:
 *           type: integer
 *           example: 2
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         photo:
 *           type: string
 *           nullable: true
 *         productCategoryId:
 *           type: integer
 *           example: 4
 *         productCategory:
 *           $ref: '#/components/schemas/ProductCategoryRef'
 *         stockStatus:
 *           type: string
 *           enum: [Normal, Critico, Agotado]
 *           description: >
 *             Calculado en base a currentStock y lowStockThreshold:
 *             Agotado si currentStock <= 0, Critico si currentStock <=
 *             lowStockThreshold, Normal en cualquier otro caso.
 *           example: Critico
 *
 *     ProductPublicListItem:
 *       type: object
 *       description: Producto disponible para el catálogo público (solo tiendas y productos activos con stock)
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
 *         photo:
 *           type: string
 *           nullable: true
 *         currentStock:
 *           type: integer
 *           example: 40
 *         lowStockThreshold:
 *           type: integer
 *           example: 5
 *         unitOfMeasure:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               example: Unidad
 *         productCategory:
 *           $ref: '#/components/schemas/ProductCategoryRef'
 *         store:
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
 *               example: Centro
 *             phone:
 *               type: string
 *               nullable: true
 *               example: "3001234567"
 *             logo:
 *               type: string
 *               nullable: true
 *             latitude:
 *               type: number
 *               nullable: true
 *               example: 4.5709
 *             longitude:
 *               type: number
 *               nullable: true
 *               example: -74.2973
 *
 *     ProductListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Product'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 120
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 12
 *
 *     ProductPublicListResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductPublicListItem'
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 300
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 15
 *
 *     ProductInventoryResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ProductInventoryItem'
 *         summary:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 45
 *             criticos:
 *               type: integer
 *               example: 6
 *             agotados:
 *               type: integer
 *               example: 2
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 10
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 1
 *
 *     ProductDetailResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ProductDetail'
 *
 *     CreateProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - currentStock
 *         - productCategoryId
 *         - unitOfMeasureId
 *       properties:
 *         name:
 *           type: string
 *           example: Arroz 500g
 *         price:
 *           type: number
 *           example: 2500
 *         description:
 *           type: string
 *           example: Arroz blanco de grano largo
 *         referenceCode:
 *           type: string
 *           example: ARR-500
 *         lowStockThreshold:
 *           type: integer
 *           default: 5
 *           example: 5
 *         currentStock:
 *           type: integer
 *           example: 40
 *         productCategoryId:
 *           type: integer
 *           example: 4
 *         unitOfMeasureId:
 *           type: integer
 *           example: 2
 *         photo:
 *           type: string
 *           format: binary
 *           description: Imagen del producto (opcional)
 *
 *     UpdateProductInput:
 *       type: object
 *       required:
 *         - name
 *         - price
 *       properties:
 *         name:
 *           type: string
 *           example: Arroz 500g
 *         price:
 *           type: number
 *           example: 2600
 *         description:
 *           type: string
 *           example: Arroz blanco de grano largo
 *         referenceCode:
 *           type: string
 *           example: ARR-500
 *         lowStockThreshold:
 *           type: integer
 *           example: 8
 *         productCategoryId:
 *           type: integer
 *           example: 4
 *         unitOfMeasureId:
 *           type: integer
 *           example: 2
 *         photo:
 *           type: string
 *           format: binary
 *           description: Nueva imagen del producto (opcional). Si se envía, reemplaza y elimina la anterior.
 *
 *     ProductMutationResponse:
 *       type: object
 *       properties:
 *         data:
 *           $ref: '#/components/schemas/ProductDetail'
 *         message:
 *           type: string
 *           example: Producto creado correctamente
 *
 *     UpdateThresholdByCategoryInput:
 *       type: object
 *       required:
 *         - productCategoryId
 *         - lowStockThreshold
 *       properties:
 *         productCategoryId:
 *           type: integer
 *           example: 4
 *         lowStockThreshold:
 *           type: integer
 *           example: 10
 *
 *     UpdateThresholdByCategoryResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           example: Umbral actualizado para 12 producto(s) de la categoría
 *         data:
 *           type: object
 *           properties:
 *             affectedProducts:
 *               type: integer
 *               example: 12
 *
 *     TimelineUserRef:
 *       type: object
 *       nullable: true
 *       properties:
 *         id:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: Juan Pérez
 *
 *     TimelineSupplierRef:
 *       type: object
 *       nullable: true
 *       properties:
 *         id:
 *           type: integer
 *           example: 7
 *         name:
 *           type: string
 *           example: Distribuidora ABC
 *
 *     TimelineMovementEvent:
 *       type: object
 *       description: Evento del timeline que proviene de un Movimiento (entrada, salida o ajuste de inventario)
 *       properties:
 *         origen:
 *           type: string
 *           enum: [Movimiento]
 *         id:
 *           type: integer
 *           description: ID del movimiento
 *           example: 34
 *         date:
 *           type: string
 *           format: date-time
 *         tipo:
 *           $ref: '#/components/schemas/MovementType'
 *         signo:
 *           type: string
 *           enum: ["+", "-"]
 *           description: "+ si el tipo es Entry o AdjustEntry, - si es Exit o AdjustExit"
 *         cantidad:
 *           type: number
 *           example: 20
 *         estado:
 *           $ref: '#/components/schemas/MovementStatus'
 *         motivo:
 *           type: string
 *           nullable: true
 *           description: reason del movimiento (obligatorio solo en ajustes)
 *         unitCost:
 *           type: number
 *           nullable: true
 *         supplier:
 *           $ref: '#/components/schemas/TimelineSupplierRef'
 *         usuario:
 *           $ref: '#/components/schemas/TimelineUserRef'
 *         cancellationDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     TimelineSaleEvent:
 *       type: object
 *       description: Evento del timeline que proviene de una Venta
 *       properties:
 *         origen:
 *           type: string
 *           enum: [Venta]
 *         id:
 *           type: integer
 *           description: ID de la venta
 *           example: 120
 *         date:
 *           type: string
 *           format: date-time
 *         tipo:
 *           type: string
 *           enum: [Venta]
 *         signo:
 *           type: string
 *           enum: ["-"]
 *           description: Siempre "-", una venta siempre resta stock
 *         cantidad:
 *           type: number
 *           example: 3
 *         estado:
 *           $ref: '#/components/schemas/SaleStatus'
 *         motivo:
 *           type: string
 *           nullable: true
 *           description: cancellationReason de la venta, null si no fue cancelada
 *         unitPrice:
 *           type: number
 *           example: 2500
 *         subtotal:
 *           type: number
 *           example: 7500
 *         usuario:
 *           $ref: '#/components/schemas/TimelineUserRef'
 *         cancellationDate:
 *           type: string
 *           format: date-time
 *           nullable: true
 *
 *     TimelineEvent:
 *       description: >
 *         Un evento del timeline es un TimelineMovementEvent o un
 *         TimelineSaleEvent; se distinguen por el campo `origen`. Ambos
 *         comparten id, date, tipo, signo, cantidad, estado, motivo,
 *         usuario y cancellationDate, pero solo el de Movimiento trae
 *         unitCost/supplier, y solo el de Venta trae unitPrice/subtotal.
 *       oneOf:
 *         - $ref: '#/components/schemas/TimelineMovementEvent'
 *         - $ref: '#/components/schemas/TimelineSaleEvent'
 *
 *     ProductStockTimelineResponse:
 *       type: object
 *       properties:
 *         data:
 *           type: array
 *           description: Eventos (movimientos + ventas) del producto en el rango, ordenados por fecha descendente
 *           items:
 *             $ref: '#/components/schemas/TimelineEvent'
 *         producto:
 *           type: object
 *           properties:
 *             id:
 *               type: integer
 *               example: 12
 *             name:
 *               type: string
 *               example: Arroz 500g
 *             currentStock:
 *               type: integer
 *               example: 40
 *         meta:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *               example: 37
 *             page:
 *               type: integer
 *               example: 1
 *             totalPages:
 *               type: integer
 *               example: 2
 */

/**
 * @swagger
 * /products/public/search:
 *   get:
 *     summary: Busca productos disponibles en el catálogo público
 *     description: >
 *       Endpoint público (sin autenticación). Retorna solo productos activos
 *       con stock disponible, pertenecientes a tiendas activas.
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtro por nombre (búsqueda parcial)
 *       - in: query
 *         name: productCategoryId
 *         schema:
 *           type: integer
 *         description: Filtro por categoría de producto
 *     responses:
 *       200:
 *         description: Productos encontrados
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductPublicListResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products/inventory:
 *   get:
 *     summary: Obtiene el estado de inventario de los productos activos de la tienda
 *     description: >
 *       Retorna los productos activos con un `stockStatus` calculado
 *       (Normal, Critico, Agotado) y un resumen de conteos. La paginación
 *       se aplica después del filtrado por stockStatus. Requiere rol de tendero.
 *     tags: [Products]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtro por nombre (búsqueda parcial)
 *       - in: query
 *         name: productCategoryId
 *         schema:
 *           type: integer
 *         description: Filtro por categoría de producto
 *       - in: query
 *         name: stockStatus
 *         schema:
 *           type: string
 *           enum: [Normal, Critico, Agotado]
 *         description: Filtro por estado de stock calculado
 *     responses:
 *       200:
 *         description: Estado de inventario obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductInventoryResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products/threshold/by-category:
 *   put:
 *     summary: Actualiza el umbral de stock bajo para todos los productos activos de una categoría
 *     description: >
 *       Aplica el nuevo `lowStockThreshold` a todos los productos activos
 *       de la tienda que pertenezcan a la categoría indicada, y registra
 *       la acción en el log de auditoría. Requiere rol de tendero.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateThresholdByCategoryInput'
 *     responses:
 *       200:
 *         description: Umbral actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UpdateThresholdByCategoryResponse'
 *       400:
 *         description: Categoría no enviada o umbral inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       404:
 *         description: La categoría de producto no existe
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Obtiene el listado paginado de productos de la tienda
 *     description: >
 *       Retorna los productos de la tienda del usuario autenticado, con
 *       filtros opcionales por nombre, categoría y estado. Requiere rol
 *       de tendero.
 *     tags: [Products]
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
 *         name: name
 *         schema:
 *           type: string
 *         description: Filtro por nombre (búsqueda parcial)
 *       - in: query
 *         name: productCategoryId
 *         schema:
 *           type: integer
 *         description: Filtro por categoría de producto
 *       - in: query
 *         name: status
 *         schema:
 *           $ref: '#/components/schemas/ProductStatus'
 *         description: Filtro por estado del producto
 *     responses:
 *       200:
 *         description: Listado de productos obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductListResponse'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Obtiene un producto específico por su ID
 *     description: >
 *       Retorna el producto solicitado, siempre que pertenezca a la tienda
 *       del usuario autenticado. Requiere rol de tendero.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *     responses:
 *       200:
 *         description: Producto encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductDetailResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products/{id}/timeline:
 *   get:
 *     summary: Obtiene la línea de tiempo consolidada de movimientos y ventas de un producto (RF-46)
 *     description: >
 *       Une en un solo arreglo, ordenado por fecha descendente, todo lo
 *       que afectó el stock del producto: movimientos (entradas, salidas
 *       y ajustes) y ventas, incluyendo eventos cancelados (se marcan con
 *       su `estado` y `cancellationDate`, no se excluyen del timeline).
 *       Cada evento indica su `origen` ("Movimiento" o "Venta"). La
 *       paginación se aplica sobre el arreglo ya combinado y ordenado, y
 *       a diferencia de otros listados de este módulo, `limit` es
 *       controlado por el cliente (no por PAGINATION_LIMIT). Requiere rol
 *       de tendero.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha inicial del rango (YYYY-MM-DD), aplica tanto a movimientos como a ventas
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Fecha final del rango (YYYY-MM-DD), aplica tanto a movimientos como a ventas
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Cantidad de eventos por página
 *     responses:
 *       200:
 *         description: Timeline obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductStockTimelineResponse'
 *       400:
 *         description: ID de producto inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       404:
 *         description: Producto no encontrado, o no pertenece a la tienda del usuario
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Crea un nuevo producto en la tienda
 *     description: >
 *       Registra un producto validando existencia de categoría y unidad de
 *       medida. Acepta una foto opcional vía multipart/form-data. Requiere
 *       rol de tendero.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/CreateProductInput'
 *     responses:
 *       201:
 *         description: Producto creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductMutationResponse'
 *       400:
 *         description: >
 *           Datos inválidos: nombre vacío, precio o stock inválido,
 *           categoría o unidad de medida no enviadas
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       404:
 *         description: La categoría de producto o la unidad de medida no existen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Actualiza un producto existente
 *     description: >
 *       Actualiza los datos del producto y, opcionalmente, reemplaza su
 *       foto (eliminando la anterior del disco). Registra el cambio en el
 *       log de auditoría con los valores previos y nuevos. Requiere rol
 *       de tendero.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/UpdateProductInput'
 *     responses:
 *       200:
 *         description: Producto editado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductMutationResponse'
 *       400:
 *         description: ID inválido, nombre vacío, precio o umbral inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       404:
 *         description: >
 *           Producto no encontrado, o la categoría/unidad de medida
 *           enviadas no existen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products/delete/{id}:
 *   put:
 *     summary: Desactiva (elimina lógicamente) un producto
 *     description: >
 *       Marca el producto como Inactive y registra la fecha de
 *       desactivación. No elimina el registro físicamente. Requiere rol
 *       de tendero.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a desactivar
 *     responses:
 *       200:
 *         description: Producto eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductMutationResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */

/**
 * @swagger
 * /products/restore/{id}:
 *   put:
 *     summary: Restablece (reactiva) un producto previamente desactivado
 *     description: >
 *       Marca el producto como Active y limpia la fecha de desactivación.
 *       Requiere rol de tendero.
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID del producto a restablecer
 *     responses:
 *       200:
 *         description: Producto restablecido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductMutationResponse'
 *       400:
 *         description: ID inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       401:
 *         description: No autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       403:
 *         description: El usuario no tiene rol de tendero
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       404:
 *         description: Producto no encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ProductError'
 */
