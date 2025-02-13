<template>
    <div class="d-flex justify-center aling-center h-100">
        <v-container>
            <v-row no-gutters>
                <v-col
                    cols="12"
                    lg="6"
                    class="d-flex justify-center align-center"
                >
                    <div class="content-info-finish">
                        <div class="title">¡Ya está por finalizar!</div>
                        <p class="subtitle">
                            Estános terminando la validación de tu información.
                            Pronto recibirás un correo de confirmación.
                        </p>
                    </div>
                </v-col>
                <v-col cols="12" lg="6" class="text-center">
                    <img
                        class="frame"
                        src="@/assets/images/frame-finish.png"
                        alt="register"
                    />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
import { userUserStore } from '@/stores/user'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userAuthStore } from '@/stores/auth'
const userStore = userUserStore()
const authStore = userAuthStore()
const loading = ref(false)
const router = useRouter()

const updateState = async () => {
    loading.value = true
    const valid = await userStore.stateUser()
    if (valid[0].state !== 0) {
        loading.value = false
        await router.push('/validateUser')
    } else {
        authStore.setUser({ state: 2 })
        await router.push('/userDashboard')
    }
}

onMounted(async () => {
    await updateState()
})
</script>

<style lang="scss">
.content-info-finish {
    @media screen and (max-width: 959px) {
        text-align: center;
    }
}
.title {
    font-size: 36px;
    color: #146489;
    margin-bottom: 15px;
}

.subtitle {
    color: #0085ae;
    font-size: 20px;
}

.frame {
    animation: EntrarLeft 1.5s ease;
    z-index: 1;
    width: calc(100% - 150px);
    height: auto;
    @media screen and (max-width: 959px) {
        width: 70%;
    }
}
</style>
