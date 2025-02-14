<template>
    <AdminPanel title="Detalle de Usuario">
        <AdminDetailsSection v-if="referredCode" title="Codigo de Referido">
            <div class="d-flex w-100">
                <v-form ref="refReferredCode" class="d-flex ga-2 w-100">
                    <v-text-field
                        v-model="dataReferredCode.name"
                        :readonly="dataUser.referredCode !== null"
                        label="Codigo de Referido"
                        class="ip-form inpt-general text-capitalize"
                        :rules="notData"
                        :error-messages="
                            errorDuplicate
                                ? `${dataReferredCode.name} ya existe`
                                : ``
                        "
                    />
                    <v-text-field
                        :readonly="
                            dataUser.referredCode !== null &&
                            !editionReferredCode
                        "
                        v-model="dataReferredCode.percent_discount"
                        label="Porcentaje de descuento"
                        class="ip-form inpt-general"
                        :rules="numberRules"
                    />
                </v-form>
                <div class="d-flex ga-2">
                    <v-btn
                        v-if="
                            dataUser.referredCode === null &&
                            !editionReferredCode
                        "
                        color="red"
                        text="Cancelar"
                        @click="referredCode = !referredCode"
                    />
                    <v-btn
                        v-if="
                            dataUser.referredCode !== null &&
                            editionReferredCode
                        "
                        color="red"
                        text="Cancelar"
                        @click="editionReferredCode = !editionReferredCode"
                    />
                    <v-btn
                        v-if="dataUser.referredCode === null"
                        color="success"
                        text="Generar"
                        @click="saveReferredCode()"
                    />
                    <v-btn
                        v-if="
                            dataUser.referredCode !== null &&
                            !editionReferredCode
                        "
                        color="warning"
                        text="Editar"
                        @click="editionReferredCodeAction()"
                    />
                    <v-btn
                        v-if="editionReferredCode"
                        color="success"
                        text="Guardar"
                        @click="saveEditionReferredCodeAction()"
                    />
                </div>
            </div>
        </AdminDetailsSection>

        <AdminDetailsSection
            :title="`Clientes referenciados ${cantReferredCodeUser}`"
            v-if="dataUser.referredCode !== null"
        >
            <div class="flex-items-history">
                <div
                    class="item"
                    v-for="(item, i) in dataUser.referredCode
                        ?.referredCodeHistories"
                    :key="i"
                >
                    <p>
                        {{
                            `${item.user?.nombres} ${item.user?.apellido_paterno} ${item.user?.apellido_materno}`
                        }}
                    </p>
                    <p>{{ formatDate2(item.date_use) }}</p>
                </div>
            </div>
        </AdminDetailsSection>

        <AdminDetailsSection title="Datos personales">
            <div class="d-flex align-center justify-space-between w-100 ga-5">
                <div class="d-flex flex-column ga-5 w-100">
                    <div class="d-flex w-100 align-center">
                        <div v-if="disabledEdit" class="d-flex ga-2">
                            <v-chip
                                size="x-large"
                                :color="getTagState(dataUser.state).color"
                                :text="getTagState(dataUser.state).text"
                            />
                            <v-chip
                                size="x-large"
                                color="blue"
                                :text="`Comision ${Number(dataUser.comision)}%`"
                            />
                            <v-chip
                                v-if="dataUser.referredCodeHistory !== null"
                                color="purple"
                                size="x-large"
                                :text="`${
                                    dataUser.referredCodeHistory?.referredCode
                                        .name
                                } - ${formatDate2(
                                    dataUser.referredCodeHistory?.date_use
                                )}`"
                            />
                        </div>
                        <div v-else>
                            <label class="color-green"
                                >Selecciona Comisión</label
                            >
                            <v-select
                                v-model="dataUser.comision"
                                :items="comissions"
                                class="ip-form inpt-general"
                                :item-title="(item) => `${Number(item.monto)}%`"
                                item-value="monto"
                            >
                                <template #item="{ item, props }">
                                    <v-list-item v-bind="props">
                                        <template #title>
                                            <div
                                                class="d-flex justify-star align-center"
                                            >
                                                {{
                                                    `${Number(item.raw.monto)}%`
                                                }}
                                            </div>
                                        </template>
                                    </v-list-item>
                                </template>
                            </v-select>
                        </div>
                    </div>
                    <form
                        ref="formRegister"
                        class="d-flex flex-column ga-1 w-100 justify-space-between"
                    >
                        <div class="d-flex ga-2">
                            <v-text-field
                                v-model="dataUser.dni"
                                :readonly="disabledEdit"
                                label="DNI"
                                class="ip-form inpt-general"
                                :rules="dniRules"
                                :error-messages="
                                    errorDni ? errorMessageDni : ``
                                "
                            />
                            <v-text-field
                                :readonly="disabledEdit"
                                v-model="dataUser.email"
                                label="Correo"
                                class="ip-form inpt-general"
                                :rules="emailRules"
                            />
                        </div>
                        <div class="d-flex ga-2">
                            <v-text-field
                                :readonly="disabledEdit"
                                v-model="dataUser.nombres"
                                label="Nombres"
                                class="ip-form inpt-general"
                                :rules="nameRules"
                            />
                            <v-text-field
                                :readonly="disabledEdit"
                                label="Apellido paterno"
                                v-model="dataUser.apellido_paterno"
                                class="ip-form inpt-general"
                                :rules="lastFirstNameRules"
                            />
                        </div>
                        <div class="d-flex ga-2">
                            <v-text-field
                                :readonly="disabledEdit"
                                label="Apellido materno"
                                v-model="dataUser.apellido_materno"
                                class="ip-form inpt-general"
                                :rules="lastSecondNameRules"
                            />
                            <v-text-field
                                :readonly="disabledEdit"
                                label="Telefono"
                                v-model="dataUser.phone"
                                class="ip-form inpt-general"
                                :rules="phoneRules"
                            />
                        </div>
                    </form>
                </div>
                <div
                    v-if="validateUserActivePermiss && dataUser.id_rol !== 1"
                    class="d-flex flex-column ga-3"
                >
                    <v-btn
                        color="red"
                        @click="dialog = true"
                        text="Borrar cliente"
                    />
                    <v-btn
                        color="#00ACAC"
                        v-if="!referredCode"
                        text="Crear codigo de referido"
                        @click="createReferredCode()"
                    />
                    <v-btn
                        color="success"
                        v-if="dataUser.state === 1"
                        text="Aprobar usuario"
                        @click="changeStateUser(2)"
                    />
                    <v-btn
                        color="red"
                        v-if="dataUser.state === 1"
                        text="Desaprobar usuario"
                        @click="changeStateUser(4)"
                    />
                    <v-btn
                        color="red"
                        v-if="dataUser.state === 2 && disabledEdit"
                        text="Bloquear usuario"
                        @click="changeStateUser(3)"
                    />
                    <v-btn
                        color="success"
                        v-if="dataUser.state === 3 || dataUser.state === 4"
                        text="Actvar usuario"
                        @click="changeStateUser(2)"
                    />
                    <v-btn
                        color="warning"
                        v-if="dataUser.state === 2 && disabledEdit"
                        text="Editar cliente"
                        @click="disabledEdit = false"
                    />
                    <v-btn
                        color="#70BA44"
                        v-if="!disabledEdit"
                        text="Guardar"
                        @click="saveChanges()"
                    />
                    <v-btn
                        color="red"
                        v-if="!disabledEdit"
                        text="Cancelar"
                        @click="cancelChanges()"
                    />
                </div>
            </div>
        </AdminDetailsSection>

        <AdminDetailsSection title="Documentos">
            <div class="d-flex">
                <div
                    class="d-flex w-100 align-center justify-space-evenly flex-wrap flex-lg-nowrap"
                    v-if="disabledEdit"
                >
                    <ImageWithZoom
                        v-if="dataUser.userFile?.photo"
                        :img="`${routeImg}/${dataUser.userFile?.photo}`"
                    />
                    <ImageWithZoom
                        v-if="dataUser.userFile?.dni_frontal"
                        :img="`${routeImg}/${dataUser.userFile?.dni_frontal}`"
                    />
                    <ImageWithZoom
                        v-if="dataUser.userFile?.dnir_later"
                        :img="`${routeImg}/${dataUser.userFile?.dnir_later}`"
                    />
                </div>
                <div
                    v-else
                    class="d-flex w-100 align-center justify-space-evenly"
                >
                    <div class="d-flex flex-column align-center">
                        <div
                            v-if="viewImage.imgPerfil === null"
                            class="btn-open-files"
                        >
                            <label for="upload1"
                                >Adjunta nueva foto de perfil.
                                <img
                                    src="@/assets/svg/icons/file.svg"
                                    alt="cuadors"
                            /></label>
                            <input
                                type="file"
                                @change="createBase64Image($event, 1)"
                                style="display: none"
                                id="upload1"
                                accept="image/*;capture=camera"
                            />
                        </div>
                        <div
                            class="dlt-image cursor-pointer"
                            @click="viewImage.imgPerfil = null"
                            v-if="viewImage.imgPerfil"
                        >
                            <v-icon color="red">mdi-image-remove</v-icon>
                            Borrar
                        </div>
                        <div>
                            <img
                                src="@/assets/images/frame-identidad.png"
                                alt=""
                                v-if="viewImage.imgPerfil === null"
                                height="250"
                            />
                            <img
                                v-else
                                :src="`data:image/png;base64,${viewImage.imgPerfil}`"
                                alt=""
                                height="250"
                            />
                        </div>
                    </div>
                    <div class="d-flex flex-column align-center">
                        <div>
                            <div
                                v-if="viewImage.imgDniF === null"
                                class="btn-open-files"
                            >
                                <label for="upload2"
                                    >Adjunta nueva foto del lado frontal del
                                    documento.
                                    <img
                                        src="@/assets/svg/icons/file.svg"
                                        alt="cuadors"
                                /></label>
                                <input
                                    type="file"
                                    @change="createBase64Image($event, 2)"
                                    style="display: none"
                                    id="upload2"
                                    accept="image/*;capture=camera"
                                />
                            </div>
                            <div
                                class="dlt-image cursor-pointer"
                                @click="viewImage.imgDniF = null"
                                v-if="viewImage.imgDniF"
                            >
                                <v-icon color="red">mdi-image-remove</v-icon>
                                Borrar
                            </div>
                        </div>
                        <div>
                            <img
                                src="@/assets/images/dnifrontal.png"
                                alt=""
                                v-if="viewImage.imgDniF === null"
                                height="250"
                            />
                            <img
                                v-else
                                :src="`data:image/png;base64,${viewImage.imgDniF}`"
                                alt=""
                                height="250"
                            />
                        </div>
                    </div>
                    <div class="d-flex flex-column align-center">
                        <div
                            v-if="viewImage.imgDniP === null"
                            class="btn-open-files"
                        >
                            <label for="upload3"
                                >Adjunta nueva foto del lado posterior del
                                documento.
                                <img
                                    src="@/assets/svg/icons/file.svg"
                                    alt="cuadors"
                            /></label>
                            <input
                                type="file"
                                @change="createBase64Image($event, 3)"
                                style="display: none"
                                id="upload3"
                                accept="image/*;capture=camera"
                            />
                        </div>
                        <div
                            class="dlt-image cursor-pointer"
                            @click="viewImage.imgDniP = null"
                            v-if="viewImage.imgDniP"
                        >
                            <v-icon color="red">mdi-image-remove</v-icon>
                            Borrar
                        </div>
                        <div>
                            <img
                                src="@/assets/images/dniposterior.png"
                                alt=""
                                v-if="viewImage.imgDniP === null"
                                height="250"
                            />
                            <img
                                v-else
                                :src="`data:image/png;base64,${viewImage.imgDniP}`"
                                alt=""
                                height="250"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </AdminDetailsSection>

        <AdminDetailsSection
            title="Permisos de Usuario"
            v-if="authStore.user.id_rol === 1 && dataUser.id_rol !== 2"
        >
            <v-row class="content-info-section" v-if="dataUser.id_rol !== 2">
                <v-col cols="12">
                    <v-row>
                        <v-col
                            cols="4"
                            v-for="(item, i) in dataUser.modulePermissions"
                            :key="i"
                        >
                            <v-row>
                                <v-col cols="12">
                                    <div
                                        class="d-flex justify-center align-center"
                                    >
                                        <span class="text-module">{{
                                            item.module.name
                                        }}</span>
                                        <v-switch
                                            v-model="item.show"
                                            :false-value="0"
                                            :true-value="1"
                                            :disabled="disabledEdit"
                                            class="class-active-chec-module"
                                            color="#00ACAC"
                                            hide-details
                                        ></v-switch>
                                    </div>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-checkbox
                                                :false-value="0"
                                                :true-value="1"
                                                v-model="item.edit"
                                                label="Puede Editar"
                                                :disabled="disabledEdit"
                                                class="class-active-chec-module"
                                                hide-details
                                            ></v-checkbox>
                                            <v-checkbox
                                                v-model="item.view"
                                                :false-value="0"
                                                :true-value="1"
                                                label="Puede Observar"
                                                :disabled="disabledEdit"
                                                class="class-active-chec-module"
                                                hide-details
                                            ></v-checkbox>
                                        </v-col>
                                    </v-row>
                                </v-col>
                            </v-row>
                        </v-col>
                    </v-row>
                </v-col> </v-row
        ></AdminDetailsSection>

        <AdminDetailsSection
            v-if="dataUser.userBanks?.length > 0"
            title="Bancos"
        >
            <v-row>
                <v-col
                    v-for="(bank, index) in dataUser.userBanks"
                    cols="12"
                    md="6"
                    xl="4"
                >
                    <v-card :key="index" class="rounded-xl pa-2">
                        <v-card-title
                            class="d-flex align-center w-100 justify-space-between"
                        >
                            <div class="d-flex align-center">
                                <img
                                    width="32"
                                    height="32"
                                    class="mr-3"
                                    :src="getImage(bank.bank.icon)"
                                />
                                <span
                                    class="text-lagoon-shade font-weight-medium"
                                >
                                    {{ bank.alias_account }}
                                </span>
                            </div>
                        </v-card-title>
                        <v-card-subtitle>
                            {{
                                `${
                                    bank.type_money === 1 ? 'Soles' : 'Dolares'
                                } - ${bank.typesAccount.account_name}`
                            }}
                        </v-card-subtitle>
                        <v-card-text class="text-body-1">
                            {{ bank.number_account }}
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </AdminDetailsSection>

        <AdminDetailsSection
            v-if="dataUser?.historyUsers?.length > 0"
            title="Historial de Actualizaciones"
        >
            <v-row
                v-for="(item, index) in dataUser?.historyUsers"
                :key="index"
                class="d-flex align-center"
            >
                <v-col
                    cols="4"
                    class="text-center text-body-1 font-weight-medium"
                    >{{
                        `${item.user.nombres} ${item.user.apellido_paterno} ${
                            item.user.apellido_materno ?? ''
                        }`
                    }}</v-col
                >
                <v-col cols="4" class="text-center"
                    ><v-chip
                        variant="outlined"
                        color="info"
                        size="large"
                        class="px-12"
                        >{{
                            item.state_user === 0
                                ? 'Creación de Cuenta'
                                : item.state_user === 10
                                ? 'Editado'
                                : item.state_user === 11
                                ? 'Creacion de Codigo de Referido'
                                : item.state_user === 12
                                ? 'Actualización de Codigo de Referido'
                                : item.state_user === 2
                                ? 'Activación de cuenta'
                                : item.state_user === 4
                                ? 'Error en Aprovación de Cuenta'
                                : 'Nada'
                        }}</v-chip
                    ></v-col
                >
                <v-col
                    cols="4"
                    class="text-center text-body-1 font-weight-medium"
                >
                    {{ formatDate2(item.create_date) }}
                </v-col>
            </v-row>
        </AdminDetailsSection>

        <v-dialog v-model="dialog" width="auto">
            <v-card
                max-width="400"
                class="px-2"
                text="Esta seguro de eliminar este cliente?"
            >
                <template v-slot:actions>
                    <div class="d-flex w-100 justify-space-between pb-2">
                        <v-btn
                            class="w-33"
                            variant="tonal"
                            color="#70BA44"
                            @click="deleteUser()"
                            text="Sí"
                        />
                        <v-btn
                            class="w-33"
                            @click="
                                ;(dialog = false),
                                    userStore.stateLoadingGeneral(false)
                            "
                            color="error"
                            variant="tonal"
                            text="No"
                        />
                    </div>
                </template>
            </v-card>
        </v-dialog>
    </AdminPanel>
</template>

<script setup>
import AdminPanel from '../components/AdminPanel.vue'
import ImageWithZoom from '@/shared/components/ImageWithZoom.vue'
import AdminDetailsSection from '../components/AdminDetailsSection.vue'

import { computed, onMounted, reactive, ref } from 'vue'
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes.js'
import { adminAdminStore } from '@/stores/admin'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'
import { formatDate2 } from '@/shared/scripts/helpers/formats.js'
import Compressor from 'compressorjs'

const adminStore = adminAdminStore()
const userStore = userUserStore()
const authStore = userAuthStore()

const dataUser = ref({})
const dataUserStore = ref({})
const route = useRoute()
const router = useRouter()
const disabledEdit = ref(true)
const comissions = ref([])
const formRegister = ref(null)
const referredCode = ref(false)

const errorDni = ref(false)

const dataReferredCode = ref({ name: '', percent_discount: '' })
const refReferredCode = ref(null)
const cantReferredCodeUser = ref(0)
const errorDuplicate = ref(false)
const editionReferredCode = ref(false)
const errorMessageDni = ref('')

const validateUserActivePermiss = computed(() => validateRoutes('users'))

const dialog = ref(false)

const viewImage = reactive({
    imgPerfil: null,
    imgDniF: null,
    imgDniP: null
})
const mostrarImg = reactive({
    perfil: null,
    dni1: null,
    dni2: null
})

const base64Frontal = ref()
const fileSend1 = ref()
const fileSend2 = ref()
const fileSend3 = ref()

const routeImg = import.meta.env.VITE_APP_URL_S3

onMounted(async () => {
    userStore.stateLoadingGeneral(true)
    await getUser(route.params.userId)
    comissions.value = authStore.comissions
})

const getTagState = (state) => {
    const states = {
        0: { text: 'Registrado', color: 'blue' },
        1: { text: 'Por validar', color: 'orange' },
        2: { text: 'Activo', color: 'green' },
        3: { text: 'Inactivo', color: 'gray' },
        4: { text: 'Desaprovado', color: 'red' }
    }

    return states[state] || { text: '-', color: '' }
}

const getUser = async (id) => {
    const result = await adminStore.getDataUser(id)
    if (result.success) {
        dataUser.value = result.data
        dataUserStore.value = result.data
        userStore.stateLoadingGeneral(false)
        if (result.data.referredCode !== null) {
            referredCode.value = true
            cantReferredCodeUser.value =
                result.data.referredCode.referredCodeHistories?.length
        }
    }
}

const getImage = (img) => {
    return new URL(`../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}

const cancelChanges = async (id) => {
    await getUser(route.params.userId)
    disabledEdit.value = true
}

const saveChanges = async () => {
    userStore.stateLoadingGeneral(true)
    const { valid } = await formRegister.value.validate()
    if (valid) {
        const data = {
            nombres: dataUser.value.nombres,
            phone: dataUser.value.phone,
            apellido_paterno: dataUser.value.apellido_paterno,
            apellido_materno: dataUser.value.apellido_materno,
            comision: dataUser.value.comision,
            email: dataUser.value.email,
            dni: dataUser.value.dni,
            id: dataUser.value.id,
            foto1: mostrarImg.perfil,
            foto2: mostrarImg.dni1,
            foto3: mostrarImg.dni2,
            modules: dataUser.value.modulePermissions
        }

        try {
            const result = await adminStore.updateUser(data)

            if (mostrarImg.perfil !== null) await sendImageS3(1)
            if (mostrarImg.dni1 !== null) await sendImageS3(2)
            if (mostrarImg.dni2 !== null) await sendImageS3(3)

            if (result.success) {
                cancelChanges()
                userStore.stateLoadingGeneral(false)
                mostrarImg.perfil = null
                mostrarImg.dni1 = null
                mostrarImg.dni2 = null
                viewImage.imgPerfil = null
                viewImage.imgDniF = null
                viewImage.imgDniP = null
            } else {
                userStore.stateLoadingGeneral(false)
                errorDni.value = true
                errorMessageDni.value = result.message
                setTimeout(() => {
                    errorDni.value = false
                }, 2000)
                userStore.stateLoadingGeneral(false)
            }
        } catch (error) {}
    } else {
        userStore.stateLoadingGeneral(false)
    }
}

const sendImageS3 = async (type) => {
    const formData = new FormData()
    if (type === 1) formData.append('file', fileSend1.value)
    else if (type === 2) formData.append('file', fileSend2.value)
    else if (type === 3) formData.append('file', fileSend3.value)
    await adminStore.sendImageAdmin({ file: formData, dni: dataUser.value.id })
}

const changeStateUser = async (state) => {
    const data = {
        id: dataUser.value.id,
        state
    }
    const result = await adminStore.updateUser(data)
    if (result.success) {
        cancelChanges()
    }
}

const nameRules = [(v) => !!v || 'Nombres obligatorio']

const lastFirstNameRules = [(v) => !!v || 'Apellido paterno obligatorio']

const lastSecondNameRules = [(v) => !!v || 'Apellido materno obligatorio']

const dniRules = [
    (v) => !!v || 'DNI obligatorio',
    (v) => /^[0-9]{8,8}$/.test(v) || 'Ingrese un dni valido'
]

const phoneRules = [
    (v) => !!v || 'Celular obligatorio',
    (v) => /^[0-9]{9,9}$/.test(v) || 'Ingrese un celular valido'
]

const emailRules = [
    (v) => !!v || 'Email obligatorio',
    (v) =>
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
            v
        ) || 'Ingrese Email valido'
]

const numberRules = [
    (v) =>
        /^\d{1,5}(\.\d{1,2})?$/.test(deleteComaNumber(v)) ||
        'Solo números y maximo dos decinales.',
    (v) => !!v || 'Ingresa un descuento valido'
]

const notData = [(v) => !!v || 'Ingresa un dato valido']

const deleteComaNumber = (value) => {
    if (typeof value === 'string') {
        return value.replace(/,/g, '')
    } else return value
}

const createReferredCode = () => {
    referredCode.value = true
}
const saveReferredCode = async (value) => {
    const { valid } = await refReferredCode.value.validate()
    if (valid) {
        try {
            const data = {
                ...dataReferredCode.value,
                name: dataReferredCode.value.name.toUpperCase(),
                id: route.params.userId
            }
            const result = await adminStore.saveReferredCode(data)
            if (result.success) {
                cancelChanges()
                userStore.stateLoadingGeneral(false)
            } else {
                errorDuplicate.value = true
                setTimeout(() => {
                    errorDuplicate.value = false
                }, 1500)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const editionReferredCodeAction = () => {
    editionReferredCode.value = true
    dataReferredCode.value.percent_discount = deleteComaNumber(
        Number(dataUser.value.referredCode?.percent_discount)
    )
}

const saveEditionReferredCodeAction = async () => {
    const { valid } = await refReferredCode.value.validate()
    if (valid) {
        try {
            const data = {
                percent_discount: dataReferredCode.value.percent_discount,
                id: route.params.userId,
                idReferredCode: dataUser.value.referredCode?.id
            }
            const result = await adminStore.editReferredCode(data)
            if (result.success) {
                editionReferredCode.value = false
                cancelChanges()
                userStore.stateLoadingGeneral(false)
            }
        } catch (error) {
            console.log(error)
        }
    }
}

const createBase64Image = (event, type) => {
    const file = event.target.files
    let nameFile = file[0]?.name.split('.')
    base64Frontal.value = file[0]
    new Compressor(file[0], {
        quality: 0.6,
        success(result) {
            if (type === 1) {
                let file = new File(
                    [result],
                    `FOTO_PERFIL-${dataUser.value.dni}.${
                        nameFile[nameFile.length - 1]
                    }`,
                    { lastModified: Date.now() }
                )
                fileSend1.value = file
            } else if (type === 2) {
                let file = new File(
                    [result],
                    `DNI_FRONTAL-${dataUser.value.dni}.${
                        nameFile[nameFile.length - 1]
                    }`,
                    { lastModified: Date.now() }
                )
                fileSend2.value = file
            } else if (type === 3) {
                let file = new File(
                    [result],
                    `DNI_POSTERIOR-${dataUser.value.dni}.${
                        nameFile[nameFile.length - 1]
                    }`,
                    { lastModified: Date.now() }
                )
                fileSend3.value = file
            }
            const reader = new FileReader()
            reader.readAsDataURL(result)
            reader.onload = () => {
                const base64 = reader.result
                if (type === 1) {
                    viewImage.imgPerfil = base64.split(',')[1]
                    mostrarImg.perfil = `dni/${dataUser.value.id}/FOTO_PERFIL-${
                        dataUser.value.dni
                    }.${nameFile[nameFile.length - 1]}`
                } else if (type === 2) {
                    viewImage.imgDniF = base64.split(',')[1]
                    mostrarImg.dni1 = `dni/${dataUser.value.id}/DNI_FRONTAL-${
                        dataUser.value.dni
                    }.${nameFile[nameFile.length - 1]}`
                } else if (type === 3) {
                    viewImage.imgDniP = base64.split(',')[1]
                    mostrarImg.dni2 = `dni/${dataUser.value.id}/DNI_POSTERIOR-${
                        dataUser.value.dni
                    }.${nameFile[nameFile.length - 1]}`
                }
            }
            reader.onerror = (error) => reject(error)
        }
    })
}

const deleteUser = async () => {
    userStore.stateLoadingGeneral(true)
    try {
        const result = await adminStore.deleteClient(dataUser.value.id)
        if (result.success) {
            userStore.stateLoadingGeneral(false)
            dialog.value = false
            await router.push('/dashboard/users')
        }
    } catch (error) {}
}
</script>
