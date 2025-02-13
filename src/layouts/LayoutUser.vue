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
            class="d-flex flex-column align-center justify-end px-md-12 h-100 pb-10"
        >
            <img
                src="@/assets/svg/circle-blue.svg"
                alt="Fondo azul degradado"
                class="blueGradientBg"
            />
            <router-view v-slot="{ Component }">
                <transition name="route" mode="out-in">
                    <div
                        class="w-100 pl-md-12"
                        :class="isMobile ? 'h-100' : 'h-95'"
                    >
                        <div
                            class="d-flex flex-column align-center rounded-xl position-relative w-100 elevation-2 bg-white h-100 justify-center pa-6"
                        >
                            <UserNav />
                            <component :is="Component" />
                        </div>
                    </div>
                </transition>
            </router-view>
        </v-main>
    </v-layout>
</template>

<script setup>
import UserNav from '../features/user/components/UserNav.vue'
import LoadingGeneral from '@/shared/components/LoadingGeneral.vue'

import { storeToRefs } from 'pinia'
import { userAuthStore } from '@/stores/auth'
import { computed } from 'vue'
import { useDisplay } from 'vuetify'
import { userUserStore } from '@/stores/user'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const userStore = userUserStore()
const router = useRouter()
const authStore = userAuthStore()
const { user } = storeToRefs(authStore)

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

onMounted(async () => {
    if (authStore.user.state === 0 || authStore.user.state === 1) {
        const valid = await userStore.stateUser()
        if (valid[0].state !== 1) {
            await router.push('/validateUser')
        }
    }
})
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
