export const configLocal = {
    headerUsuarios: [
        { title: 'Usuario', key: 'dni', sortable: false },
        { title: 'Nombres', key: 'nombres', sortable: false },
        { title: 'Apellidos', key: 'apellidos', sortable: false },
        { title: 'Telefono', key: 'phone', sortable: false },
        { title: 'Comisión', key: 'comision', sortable: false },
        { title: 'Fecha de Creación ', key: 'state', sortable: false },
        { title: 'Estado', key: 'state', sortable: false },
        { title: 'Acciones', sortable: false }
    ],
    headerOrders: [
        { title: 'Usuario', key: 'dni', sortable: false },
        { title: 'Fecha', key: 'fecha', sortable: false },
        { title: 'Monto', key: 'monto', sortable: false },
        { title: 'Cliente', key: 'cliente', sortable: false },
        { title: 'Nro operacion', key: 'codigo', sortable: false },
        { title: 'Banco', key: 'banco', sortable: false },
        { title: 'Estado', key: 'state', sortable: false },
        { title: 'Acciones', sortable: false }
    ],
    headerPromociones: [
        { title: 'Codigo', key: 'name', sortable: false },
        { title: 'Descuento', key: 'percent_discount', sortable: false },
        { title: 'Limite', key: 'cant', sortable: false },
        { title: 'Limite/Cliente', key: 'cant_user', sortable: false },
        { title: 'Fecha de Creación ', key: 'date_created', sortable: false },
        { title: 'Fecha de expiración', key: 'date_expired', sortable: false },
        { title: 'Estado', key: 'state', sortable: false },
        { title: 'Acciones', sortable: false }
    ],
    contTables: [
        { value: 10, title: '10' },
        { value: 20, title: '20' },
        { value: 50, title: '50' },
        { value: 200, title: '200' }
    ],
    statesUsuarios: [
        { id: null, name: 'Todos' },
        { id: 0, name: 'Registrado' },
        { id: 1, name: 'Por Validar' },
        { id: 2, name: 'Activos' },
        { id: 3, name: 'Inactivos' },
        { id: 4, name: 'Desaprobados' }
    ],
    stateDevoluciones: [
        { id: null, name: 'Todos' },
        { id: 3, name: 'Validado' },
        { id: 4, name: 'Observado' }
    ],
    statePagos: [
        { id: null, name: 'Todos' },
        { id: 0, name: 'No Finalizado' },
        { id: 1, name: 'Pendiente' },
        { id: 2, name: 'Cancelado' }
    ],
    stateOrdenes: [
        { id: null, name: 'Todos' },
        { id: 1, name: 'Pendiente' },
        { id: 5, name: 'Completado' },
        { id: 4, name: 'Observado' }
    ],
    stateClient: [
        { id: null, name: 'Todos' },
        { id: 1, name: 'Pendiente' },
        { id: 2, name: 'Cancelado' },
        { id: 5, name: 'Pagado' }
    ],
    headerUsuariosActives: [
        { title: 'DNI', key: 'dni', sortable: false },
        { title: 'Nombres', key: 'nombres', sortable: false },
        { title: 'Cantidad de Ordenes', key: 'MatchCount', sortable: false }
    ],
    headerIngresosEgresos: [
        { title: 'Fecha', key: 'create_date', sortable: false },
        { title: 'Banco', key: 'bank', sortable: false },
        { title: 'Detalle', key: 'obs', sortable: false },
        { title: 'Monto', key: 'monto', sortable: false },
        { title: 'Acciones', sortable: false }
    ]
}
