<template>
    <nav
        class="d-flex align-center text-white bg-turquoise elevation-10"
        :class="
            isMobile
                ? 'nav-mobile py-2 justify-space-evenly w-100'
                : 'nav-regular position-absolute py-4 px-3 ga-3 rounded-xl flex-column'
        "
    >
        <router-link
            :class="[
                route.name === item.view ? 'active' : 'nav-item',
                isMobile ? 'w-16' : 'w-100'
            ]"
            v-for="(item, index) in navUser"
            :key="index"
            :to="`/userDashboard/${item.view}`"
            class="rounded-lg"
            style="text-decoration: none; color: white"
        >
            <div class="d-flex flex-column align-center ga-1 px-3 py-2">
                <component
                    :is="item.iconComponent"
                    :size="isMobile ? '32' : '48'"
                />
                <span
                    :class="isMobile ? 'text-subtitle-2' : 'text-subtitle-1'"
                    >{{ item.name }}</span
                >
            </div>
        </router-link>
        <v-divider
            v-if="!isMobile"
            :thickness="3"
            class="w-100 border-opacity-100"
        />
        <a
            class="text-center nav-item rounded-lg py-2"
            :class="isMobile ? '' : 'w-100'"
        >
            <v-btn
                variant="text"
                v-if="authStore.isLogged"
                @click="dialog = true"
                color="#00acac"
                class="h-100 pa-0 rounded-lg px-2"
            >
                <div class="d-flex flex-column align-center ga-1">
                    <IconLogout :size="isMobile ? '32' : '48'" />
                    <span
                        class="text-capitalize text-white"
                        :class="
                            isMobile ? 'text-subtitle-2' : 'text-subtitle-1'
                        "
                        >Salir</span
                    >
                </div>
            </v-btn>
        </a>

        <v-dialog v-model="dialog" width="auto">
            <v-card
                max-width="400"
                title="Salir"
                class="px-2"
                prepend-icon="mdi-logout"
                text="Esta seguro de cerrar sessión?"
            >
                <template v-slot:actions>
                    <div class="d-flex w-100 justify-space-between pb-2">
                        <v-btn
                            class="w-33"
                            variant="tonal"
                            color="#70BA44"
                            @click="authStore.logout()"
                            text="Si"
                        />
                        <v-btn
                            class="w-33"
                            @click="dialog = false"
                            color="error"
                            variant="tonal"
                            text="No"
                        />
                    </div>
                </template>
            </v-card>
        </v-dialog>
    </nav>
</template>

<script setup>
import { userAuthStore } from '@/stores/auth'
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import { useRoute } from 'vue-router'

import IconCreate from '@/shared/icons/IconCreate.vue'
import IconLogs from '@/shared/icons/IconLogs.vue'
import IconLogout from '@/shared/icons/IconLogout.vue'
import IconBank from '@/shared/icons/IconBank.vue'
import IconProfile from '@/shared/icons/IconProfile.vue'

const authStore = userAuthStore()

const route = useRoute()
const dialog = ref(false)

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

const navUser = [
    {
        iconComponent: IconCreate,
        name: 'Crear',
        view: 'nueva-orden'
    },
    {
        iconComponent: IconLogs,
        name: 'Historial',
        view: 'ordenes'
    },
    {
        iconComponent: IconBank,
        name: 'Bancos',
        view: 'cuentas'
    },
    {
        iconComponent: IconProfile,
        name: 'Perfil',
        view: 'perfil'
    }
]
</script>

<style lang="scss" scoped>
.bg-turquoise {
    background: #00acac;
}
.active {
    background-color: #008989;
}

.nav-regular {
    left: -47px;
    z-index: 50;
}
.nav-mobile {
    position: fixed;
    bottom: 0;
    z-index: 50;
}
.nav-item:hover {
    background-color: #009c9c;
}
.w-16 {
    width: 68px;
}
</style>
