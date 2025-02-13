<template>
    <AuthWrapper>
        <template #left>
            <img
                class="frame"
                src="@/assets/images/frame-recuperar.png"
                alt="login"
                width="661"
                height="590"
            />
        </template>
        <template #right>
            <AuthCard v-if="!successSend" title="Recuperar Contraseña">
                <v-form
                    ref="formRecovery"
                    class="d-flex flex-column ga-4"
                    @submit.prevent
                >
                    <v-text-field
                        v-model="form.email"
                        :rules="emailRules"
                        placeholder="Email"
                        class="ip-form inpt-general"
                        :error-messages="
                            errorEmail ? `Email no encontrado` : ``
                        "
                    />
                    <v-btn
                        :loading="loading"
                        color="#70BA44"
                        rounded="lg"
                        size="large"
                        text="Enviar"
                        @click="sendLogin"
                    />
                </v-form>
            </AuthCard>
            <v-card-text v-if="!successSend"> </v-card-text>
            <v-card-text v-else>
                <div class="text-center">
                    <img
                        src="@/assets/svg/restort-icon.svg"
                        alt=""
                        class="mb-9"
                    />
                    <h2 class="h-100 text-center">
                        <b>Solicitud Enviada !</b>
                    </h2>
                    <p class="txt-success">
                        Revise su correo electronico para recuperar su
                        contraseña.
                    </p>
                </div>
            </v-card-text>
        </template>
    </AuthWrapper>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import AuthWrapper from '../components/AuthWrapper.vue'
import AuthCard from '../components/AuthCard.vue'
const authStore = userAuthStore()
const userStore = userUserStore()
const formRecovery = ref(null)
const form = ref({ email: '' })
const router = useRouter()
const errorEmail = ref(false)
const loading = ref(false)
const successSend = ref(false)
const isMobile = computed(() => mobile.value)
const { mobile } = useDisplay()
const routeDev = import.meta.env.VITE_APP_URL

const emailRules = [
    (v) => !!v || 'Email obligatorio',
    (v) =>
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
            v
        ) || 'Ingrese Email valido'
]

onMounted(() => {
    authStore.loading = false
})

const sendLogin = async () => {
    const valid = await formRecovery.value.validate()
    if (valid.valid) {
        loading.value = true
        const result = await authStore.recoveryPassword(form.value)
        if (result.success) {
            loading.value = false
            successSend.value = true
            setTimeout(() => {
                router.push('/login')
            }, 4000)
        } else {
            errorEmail.value = true
            loading.value = false
            setTimeout(() => {
                errorEmail.value = false
            }, 2000)
        }
    }
}
</script>
