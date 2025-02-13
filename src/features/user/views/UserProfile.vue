<template>
    <UserPanel title="Datos Personales">
        <v-form
            ref="formRegister1"
            class="d-flex flex-column ga-3"
            :class="isMobile ? 'w-100' : 'w-96'"
        >
            <div class="d-flex flex-column ga-3">
                <v-text-field
                    v-model="dataUser.dniv"
                    label="DNI"
                    class="ip-form inpt-general"
                    :disabled="disabledDNI"
                    :rules="dniRules"
                />

                <v-text-field
                    v-model="dataUser.emailv"
                    label="Correo"
                    class="ip-form inpt-general"
                    :rules="emailRules"
                    :disabled="disabled"
                />

                <v-text-field
                    v-model="dataUser.nombresv"
                    label="Nombres"
                    class="ip-form inpt-general"
                    :disabled="disabled"
                    :rules="nameRules"
                />

                <v-text-field
                    v-model="dataUser.apellido_paternov"
                    :rules="lastFirstNameRules"
                    label="Apellido paterno"
                    class="ip-form inpt-general"
                    :disabled="disabled"
                />

                <v-text-field
                    v-model="dataUser.apellido_maternov"
                    :rules="lastSecondNameRules"
                    label="Apellido materno"
                    class="ip-form inpt-general"
                    :disabled="disabled"
                />
            </div>
            <div class="d-flex justify-center ga-5 align-center w-100">
                <v-btn
                    v-if="disabled"
                    color="#70BA44"
                    class="px-8"
                    rounded="lg"
                    size="large"
                    @click="editUser"
                    text="Editar"
                />
                <v-btn
                    v-if="!disabled"
                    class="w-50"
                    rounded="lg"
                    size="large"
                    color="#00ACAC"
                    text="Cancelar"
                    @click="disabled = !disabled"
                />
                <v-btn
                    v-if="!disabled"
                    color="#70BA44"
                    class="w-50"
                    rounded="lg"
                    size="large"
                    text="Guardar"
                    @click="saveUser"
                />
            </div>
        </v-form>
        <UserLoading v-if="false" />
    </UserPanel>
</template>

<script setup>
import UserLoading from '../components/UserLoading.vue'
import UserPanel from '../components/UserPanel.vue'

import { userAuthStore } from '@/stores/auth'
import { useDisplay } from 'vuetify'
import { computed, onMounted, ref } from 'vue'

const formRegister1 = ref(null)
const authStore = userAuthStore()
const disabledDNI = ref(true)
const disabled = ref(true)

const dataUser = ref({
    dniv: '',
    emailv: '',
    nombresv: '',
    apellido_paternov: '',
    apellido_maternov: ''
})

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

onMounted(() => {
    dataUser.value.dniv = authStore.user.dni
    dataUser.value.emailv = authStore.user.email
    dataUser.value.nombresv = authStore.user.nombres
    dataUser.value.apellido_paternov = authStore.user.apellido_paterno
    dataUser.value.apellido_maternov = authStore.user.apellido_materno
})

const editUser = () => {
    disabled.value = false
}

const saveUser = async () => {
    try {
        const valid1 = await formRegister1.value.validate()
        if (valid1.valid) {
            const result = await authStore.updateDataUser(dataUser.value)
            if (result.success) {
                disabled.value = true
                authStore.setUser(result.data[0])
            }
        }
    } catch (error) {}
}
const dniRules = [
    (v) => !!v || 'DNI obligatorio',
    (v) => /^[0-9]{8,8}$/.test(v) || 'Ingrese un dni valido'
]

const emailRules = [
    (v) => !!v || 'Email obligatorio',
    (v) =>
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
            v
        ) || 'Ingrese email valido'
]

const nameRules = [(v) => !!v || 'Nombres obligatorio']

const lastFirstNameRules = [(v) => !!v || 'Apellido paterno obligatorio']

const lastSecondNameRules = [(v) => !!v || 'Apellido materno obligatorio']
</script>

<style lang="scss">
.w-96 {
    width: 384px;
}
</style>
