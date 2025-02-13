import { createRouter, createWebHistory } from 'vue-router'
import { userAuthStore } from '../stores/auth'
import { userUserStore } from '@/stores/user'

import LayoutAdmin from '../layouts/LayoutAdmin.vue'
import LayoutUser from '../layouts/LayoutUser.vue'
import LayoutAuth from '../layouts/LayoutAuth.vue'
import LayoutUserValidation from '../layouts/LayoutUserValidation.vue'

const routes = [
    // AUTH ROUTES

    {
        path: '/unauthorized',
        name: 'unauthorized',
        component: () => import('../shared/components/Unauthorized.vue')
    },
    {
        path: '/',
        redirect: { name: 'login' }
    },
    {
        path: '/login',
        name: 'login',
        meta: {
            title: 'Login',
            layout: LayoutAuth
        },
        component: () => import('../features/auth/views/AuthLogin.vue')
    },
    {
        path: '/registro',
        name: 'registro',
        meta: {
            title: 'Registro',
            layout: LayoutAuth
        },
        component: () => import('../features/auth/views/AuthRegister.vue')
    },
    {
        path: '/recuperar',
        name: 'recuperar',
        meta: {
            title: 'Recuperar',
            layout: LayoutAuth
        },
        component: () =>
            import('../features/auth/views/AuthRecoverPassword.vue')
    },
    {
        path: '/restaurar',
        name: 'restaurar',
        meta: {
            title: 'Restaurar'
        },
        component: () => import('../features/auth/views/RestorePassword.vue'),
        props: true
    },

    // USER ROUTES

    {
        path: '/userDashboard',
        name: 'userDashboard',
        component: () => import('../features/user/views/UserWelcome.vue'),
        meta: {
            title: 'User Dashboard',
            requiresAuth: true,
            layout: LayoutUser,
            rolesAllowed: 'Cliente'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState !== 0) {
                next('/validateUser')
            }
            next()
        }
    },

    {
        path: '/userDashboard/nueva-orden',
        name: 'nueva-orden',
        component: () => import('../features/user/views/UserCreateOrder.vue'),
        meta: {
            title: 'Nueva Orden',
            requiresAuth: true,
            layout: LayoutUser,
            rolesAllowed: 'Cliente'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/userDashboard/cuentas',
        name: 'cuentas',
        component: () => import('../features/user/views/UserBanks.vue'),
        meta: {
            title: 'Cuentas',
            requiresAuth: true,
            layout: LayoutUser,
            rolesAllowed: 'Cliente'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/userDashboard/ordenes',
        name: 'ordenes',
        component: () => import('../features/user/views/UserOrders.vue'),
        meta: {
            title: 'Ordenes',
            requiresAuth: true,
            layout: LayoutUser,
            rolesAllowed: 'Cliente'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/userDashboard/perfil',
        name: 'perfil',
        component: () => import('../features/user/views/UserProfile.vue'),
        meta: {
            title: 'Perfil',
            requiresAuth: true,
            layout: LayoutUser,
            rolesAllowed: 'Cliente'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/validateUser',
        name: 'validateUser',
        component: () =>
            import('../features/user/validation/views/UserValidation.vue'),
        meta: {
            title: 'Validacion de usuario',
            requiresAuth: true,
            layout: LayoutUserValidation,
            rolesAllowed: 'Cliente'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userAuthStore()
            if (userStore.userState === 0) {
                next('/dashboard')
            }
            next()
        }
    },

    // ADMIN ROUTES

    {
        path: '/dashboard',
        name: 'dashboard',
        component: () => import('../features/admin/views/AdminWelcome.vue'),
        meta: {
            title: 'Admin Dashboard',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState !== 0) {
                next('/validateUser')
            }
            next()
        }
    },

    {
        path: '/dashboard/users',
        name: 'users',
        component: () => import('../features/admin/views/AdminUsersList.vue'),
        meta: {
            title: 'Lista Usuarios',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/user/:userId',
        name: 'user',
        component: () => import('../features/admin/views/AdminUserDetails.vue'),
        meta: {
            title: 'Detalle de Usuario',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/user/userActive',
        name: 'userActive',
        component: () => import('../features/admin/views/AdminUsersActive.vue'),
        meta: {
            title: 'Usuarios Activos',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/ordenes-admin',
        name: 'ordenes-admin',
        component: () => import('../features/admin/views/AdminOrders.vue'),
        meta: {
            title: 'Lista de Ordenes',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/orden/:idOrden',
        name: 'orden',
        component: () =>
            import('../features/admin/views/AdminOrderDetails.vue'),
        meta: {
            title: 'Detalle de Orden',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/pagos',
        name: 'pagos',
        component: () => import('../features/admin/views/AdminPayments.vue'),
        meta: {
            title: 'Lista de Pagos',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/pago/:idOrden',
        name: 'pago',
        component: () =>
            import('../features/admin/views/AdminPaymentDetails.vue'),
        meta: {
            title: 'Detalle de pago',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/devoluciones',
        name: 'devoluciones',
        component: () => import('../features/admin/views/AdminReturns.vue'),
        meta: {
            title: 'Lista de devoluciones',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/devolucion/:idOrden',
        name: 'devolucion',
        component: () =>
            import('../features/admin/views/AdminReturnDetails.vue'),
        meta: {
            title: 'Detalle de devoluciones',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/promociones',
        name: 'promociones',
        component: () => import('../features/admin/views/AdminPromos.vue'),
        meta: {
            title: 'Promociones',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/promocion/:idPromocion',
        name: 'promocion',
        component: () =>
            import('../features/admin/views/AdminPromoDetails.vue'),
        meta: {
            title: 'Detalle de Promoción',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/resumen',
        name: 'resumen',
        component: () => import('../features/admin/views/AdminBalance.vue'),
        meta: {
            title: 'Resumen-Estadistico',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    },
    {
        path: '/dashboard/egreso',
        name: 'egreso',
        component: () => import('../features/admin/views/AdminMovements.vue'),
        meta: {
            title: 'Resumen-Egreso-Ingresos',
            requiresAuth: true,
            layout: LayoutAdmin,
            rolesAllowed: 'Administrador,Colaborador'
        },
        beforeEnter: (to, from, next) => {
            const userStore = userUserStore()
            if (userStore.userState === 0) {
                next()
            }
        }
    }
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
})

router.beforeEach(async (to, from, next) => {
    document.title = to.meta.title
    const auth = userAuthStore()

    if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (auth.user && auth.isLogged) {
            if (to.meta.rolesAllowed.split(',').includes(auth.user.rol.name)) {
                return next()
            } else {
                return next({
                    path: 'Unauthorized',
                    replace: true
                })
            }
        } else {
            return next({
                path: '/login',
                replace: true
            })
        }
    } else {
        if (auth.user && auth.isLogged) {
            return next()
        } else {
            return next()
        }
    }
})

export default router
