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

        <v-main
            class="d-flex flex-column align-center justify-end px-md-16 h-100 pb-10"
        >
            <img
                class="blueGradientBg"
                src="@/assets/svg/circle-blue.svg"
                alt="Fondo azul degradado"
            />
            <router-view v-slot="{ Component }">
                <transition name="route" mode="out-in">
                    <div
                        class="w-100 pl-md-12"
                        :class="isMobile ? 'h-100' : 'h-95'"
                    >
                        <div
                            class="d-flex flex-column align-center rounded-xl position-relative w-100 elevation-2 bg-white justify-center px-4 px-md-16 h-100"
                        >
                            <AdminNav />
                            <component :is="Component" />
                        </div>
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
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

const authStore = userAuthStore()
const { user } = storeToRefs(authStore)

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)
</script>

<style lang="scss">
.blueGradientBg {
    position: absolute;
    left: 0;
    top: 0;
    z-index: -10;
}
.h-95 {
    height: 95%;
}
</style>
