<template>
    <v-dialog v-model="dialog" persistent width="600">
        <v-card>
            <v-card-text>
                <div class="w-100 text-center mb-4">
                    <h3>Agregar Usuario Colaborador</h3>
                </div>
                <v-form ref="formRegister">
                    <div>
                        <v-row class="content-info-section">
                            <v-col cols="12" lg="12" md="12" class="pa-5">
                                <v-row class="content-info-form">
                                    <v-col cols="12" lg="6" md="6">
                                        <v-text-field
                                            v-model="dataUser.dni"
                                            label="DNI"
                                            class="ip-form inpt-general"
                                            :rules="dniRules"
                                            :error-messages="
                                                errorDni ? errorMessageDni : ``
                                            "
                                        />
                                    </v-col>
                                    <v-col cols="12" lg="6" md="6">
                                        <v-text-field
                                            v-model="dataUser.email"
                                            label="Correo"
                                            class="ip-form inpt-general"
                                            :rules="emailRules"
                                        />
                                    </v-col>
                                    <v-col cols="12" lg="6" md="6">
                                        <v-text-field
                                            v-model="dataUser.nombres"
                                            label="Nombres"
                                            class="ip-form inpt-general"
                                            :rules="nameRules"
                                        />
                                    </v-col>
                                    <v-col cols="12" lg="6" md="6">
                                        <v-text-field
                                            label="Apellido paterno"
                                            v-model="dataUser.apellido_paterno"
                                            class="ip-form inpt-general"
                                            :rules="lastFirstNameRules"
                                        />
                                    </v-col>
                                    <v-col cols="12" lg="6" md="6">
                                        <v-text-field
                                            label="Apellido materno"
                                            v-model="dataUser.apellido_materno"
                                            class="ip-form inpt-general"
                                            :rules="lastSecondNameRules"
                                        />
                                    </v-col>
                                </v-row>
                            </v-col>
                        </v-row>
                    </div>
                    <div
                        class="d-flex justify-center align-center text-center ga-2 mt-5"
                    >
                        <v-btn
                            color="success"
                            text="Guardar"
                            @click="saveChanges()"
                        />
                        <v-btn
                            color="error"
                            text="Cancelar"
                            @click="closeDialog()"
                        />
                    </div>
                </v-form>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { computed, ref } from 'vue'
import { adminAdminStore } from '@/stores/admin'
import { useRouter } from 'vue-router'

const props = defineProps(['model'])
const dialog = computed(() => props.model)
const formRegister = ref(null)
const adminStore = adminAdminStore()
const router = useRouter()
const errorDni = ref(false)
const errorMessageDni = ref('')

const dataUser = ref({
    dni: '',
    email: '',
    nombres: '',
    apellido_paterno: '',
    apellido_materno: ''
})

const emit = defineEmits(['close'])

const nameRules = [(v) => !!v || 'Nombres obligatorio']

const lastFirstNameRules = [(v) => !!v || 'Apellido paterno obligatorio']

const lastSecondNameRules = [(v) => !!v || 'Apellido materno obligatorio']

const dniRules = [
    (v) => !!v || 'DNI obligatorio',
    (v) => /^[0-9]{8,8}$/.test(v) || 'Ingrese un dni valido'
]

const emailRules = [
    (v) => !!v || 'Email obligatorio',
    (v) =>
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
            v
        ) || 'Ingrese Email valido'
]

const saveChanges = async () => {
    const { valid } = await formRegister.value.validate()
    if (valid) {
        try {
            const data = dataUser.value
            const result = await adminStore.createUserAdmin(data)
            if (result.success) {
                await router.push(`/dashboard/user/${result.data.idUser}`)
            } else {
                errorDni.value = true
                errorMessageDni.value = result.message
                setTimeout(() => {
                    errorDni.value = false
                }, 2000)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const closeDialog = () => {
    emit('close')
}
</script>
