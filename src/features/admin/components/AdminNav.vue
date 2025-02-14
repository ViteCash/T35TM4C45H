<template>
    <nav
        class="d-flex align-center text-white bg-turquoise elevation-3 py-4 px-2 ga-1 rounded-xl flex-column"
    >
        <router-link
            v-for="(item, index) in navAdmin"
            :key="index"
            :to="`/dashboard/${item.view}`"
            :class="[
                route.path.startsWith(`/dashboard/${normalizePath(item.view)}`)
                    ? 'active'
                    : 'nav-item',
                'w-100'
            ]"
            class="rounded-lg"
            style="text-decoration: none; color: white"
        >
            <div class="d-flex flex-column align-center px-2 py-2">
                <component :is="item.iconComponent" size="40" />
                <span class="text-subtitle-2">{{ item.name }}</span>
            </div>
        </router-link>
    </nav>
</template>

<script setup>
import IconLogs from '@/shared/icons/IconLogs.vue'
import IconUsers from '@/shared/icons/IconUsers.vue'
import IconCard from '@/shared/icons/IconCard.vue'
import IconRefund from '@/shared/icons/IconRefund.vue'
import IconPromo from '@/shared/icons/IconPromo.vue'
import IconBalance from '@/shared/icons/IconBalance.vue'
import IconMovements from '@/shared/icons/IconMovements.vue'

import { useRoute } from 'vue-router'

const navAdmin = [
    {
        iconComponent: IconUsers,
        name: 'Usuarios',
        view: 'users'
    },
    {
        iconComponent: IconCard,
        name: 'Pagos',
        view: 'pagos'
    },
    {
        iconComponent: IconRefund,
        name: 'Devolución',
        view: 'devoluciones'
    },
    {
        iconComponent: IconLogs,
        name: 'Ordenes',
        view: 'ordenes-admin'
    },
    {
        iconComponent: IconPromo,
        name: 'Cupones',
        view: 'promociones'
    },
    {
        iconComponent: IconBalance,
        name: 'Balance',
        view: 'resumen'
    },
    {
        iconComponent: IconMovements,
        name: 'Flujo',
        view: 'egreso'
    }
]

const route = useRoute()

const normalizePath = (view) => {
    return view.replace(/(es|s)$/, '')
}
</script>

<style lang="scss" scoped>
.nav-item:hover {
    background-color: #009c9c;
}
.active {
    background-color: #008989;
}
.bg-turquoise {
    background: #00acac;
}
</style>
