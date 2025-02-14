<template>
    <v-layout>
        <LoadingGeneral />
        <v-app-bar :order="1" color="#146489" height="53">
            <template v-slot:append>
                <div class="d-flex ga-4 align-center" v-if="user">
                    Bienvenido:
                    {{
                        `${user.nombres.split(' ')[0]} ${
                            user.apellido_paterno.split(' ')[0]
                        }`
                    }}
                    <div>
                        <v-icon size="22" class="icon-user">mdi-account</v-icon>
                    </div>
                </div>
            </template>
        </v-app-bar>

        <v-main class="d-flex px-4" style="height: 100vh">
            <img
                class="blueGradientBg"
                src="@/assets/svg/circle-blue.svg"
                alt="Fondo azul degradado"
            />
            <router-view v-slot="{ Component }">
                <transition name="route" mode="out-in">
                    <div class="d-flex align-center w-100 ga-4">
                        <AdminNav />
                        <component :is="Component" />
                    </div>
                </transition>
            </router-view>
        </v-main>
    </v-layout>
</template>

<script setup>
import LoadingGeneral from '@/shared/components/LoadingGeneral.vue'
import AdminNav from '@/features/admin/components/AdminNav.vue'

import { storeToRefs } from 'pinia'
import { userAuthStore } from '@/stores/auth'

const authStore = userAuthStore()
const { user } = storeToRefs(authStore)
</script>

<style lang="scss">
.blueGradientBg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -10;
}
</style>
