<template>
    <div
        class="d-flex align-center justify-center ga-5 ga-lg-7 flex-wrap flex-lg-nowrap"
    >
        <div class="w-50 d-flex justify-center">
            <div class="welcomeText">
                <h5 class="text-h5 text-sm-h4 text-blue-3">¡Hola!</h5>
                <div v-if="user">
                    <p
                        class="text-h4 text-sm-h2 text-blue-2 font-weight-medium"
                    >
                        {{ user.nombres.split(' ')[0] }}
                        <br />
                        {{ user.apellido_paterno.split(' ')[0] }}
                    </p>
                </div>
                <div class="text-h5 text-sm-h4 text-blue-3">
                    ¿Qué haremos hoy?
                </div>
            </div>
        </div>
        <div>
            <img
                src="@/assets/images/inicio.png"
                alt="Hombre buscando empezar en la plataforma"
                class="welcomeImage"
            />
        </div>
    </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { userAuthStore } from '@/stores/auth'

const authStore = userAuthStore()
const { user } = storeToRefs(authStore)
</script>

<style lang="scss">
.welcomeText {
    animation: EntrarLeft 0.9s ease;
}

.welcomeImage {
    width: 400px;
    animation: EntrarRight 0.9s ease;
    height: 100%;
    object-fit: cover;
    @media (min-width: 768px) {
        width: 400px;
    }
    @media (min-width: 1024px) {
        width: 350px;
    }
    @media (min-width: 1280px) {
        width: 600px;
    }
}
</style>
