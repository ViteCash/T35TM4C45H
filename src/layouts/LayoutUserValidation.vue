<template>
    <v-layout>
        <LoadingGeneral />
        <v-app-bar :order="1" color="#146489" height="53">
            <template v-slot:prepend>
                <v-btn
                    class=""
                    color="#fff"
                    append-icon="mdi-logout"
                    variant="text"
                    size="small"
                    v-if="authStore.isLogged"
                    text="Cerrar Sesión"
                    @click="authStore.logout()"
                />
            </template>
            <template v-slot:append>
                <div class="d-flex ga-4 align-center" v-if="user">
                    Bienvenido:
                    {{ `${user.nombres.split(' ')[0]}` }}
                    <div>
                        <v-icon size="22" class="icon-user">mdi-account</v-icon>
                    </div>
                </div>
            </template>
        </v-app-bar>
        <v-main class="d-flex flex-column align-center justify-center h-100">
            <img
                class="cuadros-top"
                src="@/assets/svg/cuadros-btn.svg"
                alt="cuadors"
            />
            <img
                class="cuadros-btn"
                src="@/assets/svg/cuadros-top.svg"
                alt="cuadors"
            />
            <img
                class="circle-top"
                src="@/assets/svg/circle-blue.svg"
                alt="cuadors"
            />
            <img
                class="circle-btn"
                src="@/assets/svg/circle-green.svg"
                alt="cuadors"
            />
            <router-view v-slot="{ Component }">
                <transition name="route" mode="out-in">
                    <div
                        class="d-flex flex-column align-center rounded-xl position-relative w-100 justify-center pa-6"
                    >
                        <component :is="Component"></component>
                    </div>
                </transition>
            </router-view>
        </v-main>
    </v-layout>
</template>

<script setup>
import LoadingGeneral from '@/shared/components/LoadingGeneral.vue'
import { storeToRefs } from 'pinia'
import { userAuthStore } from '@/stores/auth'
const authStore = userAuthStore()
const { user } = storeToRefs(authStore)
</script>

<style lang="scss" scoped>
.cuadros-top {
    position: absolute;
    top: 55px;
    right: 0;
    animation: EntrarLeft 0.9s ease;
    @media screen and (max-width: 959px) {
        display: none;
    }
}

.cuadros-btn {
    position: absolute;
    bottom: 40px;
    left: 0;
    animation: EntrarRight 0.9s ease;

    @media screen and (max-width: 959px) {
        display: none;
    }
}

.circle-top {
    position: absolute;
    top: 0;
    left: 0;
    animation: EntrarRight 0.9s ease;
    z-index: -1;
}

.circle-btn {
    position: absolute;
    bottom: 0;
    right: 0;
    animation: EntrarLeft 0.9s ease;
    @media screen and (max-width: 959px) {
        display: none;
    }
}
</style>
