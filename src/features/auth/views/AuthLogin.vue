<template>
    <AuthWrapper>
        <template #left>
            <img
                class="frame"
                src="@/assets/images/frame-login.png"
                alt="Persona iniciando sesion en su laptop"
            />
        </template>
        <template #right>
            <AuthCard title="Inicia sesión">
                <v-alert
                    v-if="errorCreds"
                    text="Usuario o contraseña incorrectas"
                    color="error"
                    variant="tonal"
                />
                <v-form
                    ref="formLogin"
                    class="d-flex flex-column ga-5 mt-4"
                    @submit.prevent="sendLogin"
                >
                    <div class="d-flex flex-column ga-2">
                        <v-text-field
                            v-model="form.dni"
                            :rules="dniRules"
                            label="DNI / CE"
                            class="ip-form inpt-general"
                            clearable
                        />
                        <v-text-field
                            :append-inner-icon="
                                show ? 'mdi-eye' : 'mdi-eye-off'
                            "
                            :type="show ? 'text' : 'password'"
                            v-model="form.password"
                            :rules="passwordRules"
                            label="Contraseña"
                            class="ip-form inpt-general"
                            @click:append-inner="show = !show"
                        />
                    </div>
                    <div class="d-flex ga-4 flex-column">
                        <v-btn
                            block
                            rounded="lg"
                            size="large"
                            color="#70BA44"
                            :loading="loading"
                            type="submit"
                            :text="titlebutton"
                        />

                        <div class="text-center">
                            <span class="text-seafoam-light">
                                ¿No tienes una cuenta?
                                <a href="/registro" class="text-green-2"
                                    >Regístrate</a
                                >
                            </span>
                        </div>
                    </div>
                    <div class="text-center">
                        <a
                            href="/recuperar"
                            class="text-lagoon-shade font-weight-bold"
                            style="text-decoration: none; font-size: 18px"
                            >¿Olvidaste tu contraseña?</a
                        >
                    </div>
                </v-form>
            </AuthCard>
        </template>
    </AuthWrapper>
</template>

<script setup>
import AuthWrapper from '../components/AuthWrapper.vue'
import AuthCard from '../components/AuthCard.vue'

import { onMounted, ref } from 'vue'
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const authStore = userAuthStore()
const userStore = userUserStore()
const formLogin = ref(null)
const form = ref({ dni: '', password: '' })
const loading = ref(false)
const router = useRouter()
const errorCreds = ref(false)
const show = ref(false)
const titlebutton = ref('Ingresar')

const dniRules = [
    (v) => !!v || 'DNI o CE obligatorio',
    (v) => Number.isInteger(Number(v)) || 'Ingrese solo numeros'
]

const passwordRules = [
    (v) => !!v || 'Contraseña obligatorio'
    // v => /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/.test(v) || 'Password must contain at least lowercase letter, one number, a special character and one uppercase letter',
]

onMounted(() => {
    authStore.loading = false
})

const sendLogin = async () => {
    loading.value = true
    const valid = await formLogin.value.validate()
    if (valid.valid) {
        const result = await authStore.login(form.value)
        if (result.success) {
            loading.value = false
            titlebutton.value = 'Bienvenido'
            const valid = await userStore.stateUser()
            if (valid[0].state !== 0) {
                await router.push('/validateUser')
            } else if (authStore.user.rol.name === 'Cliente') {
                await router.push('/userDashboard')
            } else {
                await router.push('/dashboard')
            }
        } else {
            errorCreds.value = true
            loading.value = false
            setTimeout(() => {
                errorCreds.value = false
            }, 3000)
        }
    } else {
        loading.value = false
    }
}
</script>

<style lang="scss"></style>
