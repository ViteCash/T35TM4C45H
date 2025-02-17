<template>
    <AdminPanel title="Detalle de Pago">
        <div v-if="validateUserActivePermiss">
            <div class="d-flex justify-end ga-2" v-if="!textInfo">
                <v-btn
                    color="success"
                    v-if="dataOrden.state === 3 && route.name === 'devolucion'"
                    text="Finalizar Devolución"
                    @click="updateOrder(5)"
                />
                <v-btn
                    color="red"
                    v-if="dataOrden.state === 3 && route.name === 'devolucion'"
                    text="Obervar Devolución"
                    @click="textInfo = true"
                />
            </div>
            <div v-else class="mt-5">
                <v-text-field
                    label="Observacion"
                    v-model="obs"
                    class="ip-form inpt-general"
                />
                <div class="d-flex justify-end align-center ga-3">
                    <v-btn
                        color="red"
                        text="Cancelar"
                        @click="textInfo = !textInfo"
                    />
                    <v-btn
                        color="success"
                        text="Guardar"
                        @click="updateOrder(4)"
                    />
                </div>
            </div>
        </div>
        <AdminDetailsSection title="Información">
            <v-row class="d-flex align-center">
                <v-col cols="6" class="d-flex flex-column ga-5">
                    <div class="d-flex justify-space-between">
                        <v-chip
                            size="x-large"
                            color="green"
                            :text="`Comisión ${dataOrden.percentage}%`"
                        />
                        <div class="d-flex ga-2">
                            <v-chip
                                v-if="
                                    dataOrden.promocodeHistory !== null ||
                                    dataOrden.referredCodeHistory !== null
                                "
                                size="x-large"
                                color="purple"
                                :text="`${
                                    dataOrden.promocodeHistory !== null
                                        ? dataOrden.promocodeHistory?.promocode
                                              .name
                                        : dataOrden.referredCodeHistory
                                              ?.referredCode.name
                                }`"
                            />
                            <v-chip
                                v-if="
                                    dataOrden.promocodeHistory !== null ||
                                    dataOrden.referredCodeHistory !== null
                                "
                                size="x-large"
                                color="info"
                                :text="dataOrden.monto_comision_promocode"
                            />

                            <v-chip
                                v-if="
                                    dataOrden.promocodeHistory !== null ||
                                    dataOrden.referredCodeHistory !== null
                                "
                                size="x-large"
                                color="grey"
                            >
                                <span class="text-decoration-line-through">{{
                                    dataOrden.monto_comision
                                }}</span>
                            </v-chip>
                            <v-chip
                                v-else
                                size="x-large"
                                color="info"
                                :text="`S/ ${dataOrden.monto_comision}`"
                            />
                        </div>
                    </div>
                    <div class="ip-form-detail-data">
                        <span>Envías</span>
                        {{ `S/ ${formatComas(dataOrden.monto_send)}` }}
                    </div>
                    <div class="ip-form-detail-data">
                        <span>Recibes</span>
                        {{ `S/ ${formatComas(dataOrden.monto_receive)}` }}
                    </div>
                    <div v-if="dataOrden.bankUser" class="ip-form-detail-data">
                        <span>Recibes</span>
                        <div class="d-flex justify-start align-center">
                            <img
                                width="30"
                                height="30"
                                class="mr-3"
                                :src="getImage(dataOrden.bankUser.icon)"
                            />
                            {{ dataOrden.bankUser.name_bank }}
                        </div>
                    </div>
                    <div v-if="dataOrden.bankUser" class="ip-form-detail-data">
                        <span>Cuenta</span>
                        {{ dataOrden.number_account }}
                        <div
                            class="icon-int"
                            @click="copyContent(dataOrden.number_account)"
                        >
                            <v-icon>mdi-content-copy</v-icon>
                            <v-tooltip activator="parent" location="end">{{
                                showTooltip
                            }}</v-tooltip>
                        </div>
                    </div>
                </v-col>
                <v-col cols="6" class="text-center">
                    <img
                        class="img-perfil"
                        v-if="dataOrden.img && dataOrden.img !== '-'"
                        :src="`${routeImg}/${dataOrden.img}`"
                    />
                    <img
                        v-else
                        height="300"
                        src="../../../assets/svg/nav/pagos-active.png"
                    />
                </v-col>
            </v-row>
        </AdminDetailsSection>
        <AdminDetailsSection title="Datos Personales">
            <v-row v-if="dataOrden.user">
                <v-col cols="6">
                    <div class="ip-form-detail-data mb-4">
                        <span>DNI</span>
                        {{ dataOrden.user.dni }}
                        <div
                            class="icon-int"
                            @click="copyContent(dataOrden.user.dni)"
                        >
                            <v-icon>mdi-content-copy</v-icon>
                            <v-tooltip activator="parent" location="end">{{
                                showTooltip
                            }}</v-tooltip>
                        </div>
                    </div>
                    <div class="ip-form-detail-data mb-4">
                        <span>Nombres</span>
                        {{ dataOrden.user.nombres }}
                    </div>
                    <div class="ip-form-detail-data mb-4">
                        <span>Apellido Materno</span>
                        {{ dataOrden.user.apellido_materno }}
                    </div>
                    <div class="ip-form-detail-data mb-4">
                        <span>Comisión</span>
                        {{ dataOrden.user.comision }}
                    </div>
                </v-col>
                <v-col cols="6">
                    <div class="ip-form-detail-data mb-4">
                        <span>Email</span>
                        {{ dataOrden.user.email }}
                    </div>
                    <div class="ip-form-detail-data mb-4">
                        <span>Apellido Paterno</span>
                        {{ dataOrden.user.apellido_paterno }}
                    </div>
                    <div class="ip-form-detail-data mb-4">
                        <span>Telefono</span>
                        {{ dataOrden.user.phone }}
                    </div>
                </v-col>
            </v-row>
        </AdminDetailsSection>

        <AdminDetailsSection
            v-if="dataOrden?.historyOrders?.length > 0"
            title="Historial de estados de orden"
        >
            <v-row>
                <v-col
                    cols="4"
                    v-for="(item, index) in dataOrden?.historyOrders"
                >
                    <v-card :key="index">
                        <v-card-title
                            class="w-100 d-flex justify-space-between"
                        >
                            <span>
                                {{
                                    `${item.user.nombres} ${
                                        item.user.apellido_paterno
                                    } ${item.user.apellido_materno ?? ''}`
                                }}
                            </span>
                            <v-chip
                                :text="getTagState(item.state_order).text"
                                :color="getTagState(item.state_order).color"
                            />
                        </v-card-title>
                        <v-card-subtitle>
                            {{ formatDate2(item.create_date) }}
                        </v-card-subtitle>
                        <v-card-text>
                            <b>Obs:</b>
                            {{
                                item.obs === null || item.obs === ''
                                    ? '-'
                                    : item.obs
                            }}
                        </v-card-text>
                    </v-card></v-col
                >
            </v-row>
        </AdminDetailsSection>
    </AdminPanel>
</template>

<script setup>
import AdminPanel from '../components/AdminPanel.vue'
import AdminDetailsSection from '../components/AdminDetailsSection.vue'

import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'

import { adminAdminStore } from '@/stores/admin'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'

import { validateRoutes } from '@/shared/scripts/validatePermissRoutes.js'
import { formatComas, formatDate2 } from '@/shared/scripts/helpers/formats.js'

import { getKeyFacilToken } from '../composables/getKeyFacilToken.js'
import axios from 'axios'
import { color } from 'chart.js/helpers'

const adminStore = adminAdminStore()
const userStore = userUserStore()
const authStore = userAuthStore()

const dataOrden = ref({})
const dataOrdenStore = ref({})
const route = useRoute()
const disabledEdit = ref(true)
const comissions = ref([])
const obs = ref('')
const textInfo = ref(false)
const showTooltip = ref('Copiar')

const validateUserActivePermiss = computed(() => validateRoutes('devoluciones'))
const routeImg = import.meta.env.VITE_APP_URL_S3
const routeImgAssets = import.meta.env.VITE_APP_URL_S3_ASSETS

onMounted(async () => {
    userStore.stateLoadingGeneral(true)
    await getOrden(route.params.idOrden)
    comissions.value = authStore.comissions
})

const getOrden = async (id) => {
    const result = await adminStore.getDataOrden(id)
    if (result.success) {
        dataOrden.value = result.data
        dataOrdenStore.value = result.data
        userStore.stateLoadingGeneral(false)
    }
}

const getImage = (img) => {
    return new URL(`../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}

const getTagState = (state) => {
    const states = {
        0: { text: 'No Finalizado', color: 'grey' },
        1: { text: 'Pendiente', color: 'orange' },
        2: { text: 'Cancelado', color: 'red' },
        3: { text: 'Aprobado por Pagos', color: 'blue' },
        4: { text: 'Observado', color: 'yellow' },
        5: { text: 'Completado', color: 'green' }
    }

    if (
        state === 3 &&
        (route.name === 'devolucion' || route.name === 'orden')
    ) {
        return { text: 'Completado', color: 'green' }
    }

    return states[state] || { text: 'Desconocido', color: 'grey' }
}

const fullName = computed(() => {
    return `${dataOrden.value.user.nombres} ${dataOrden.value.user.apellido_paterno} ${dataOrden.value.user.apellido_materno}`
        .trim()
        .replace(/\s+/g, ' ')
})
const dni = computed(() => {
    return dataOrden.value.user.dni
})

const email = computed(() => {
    return dataOrden.value.user.email
})

const serie = computed(() => {
    if (dataOrden.value.bankUser.id === 2) {
        return 'BB02'
    } else return 'BB01'
})

const fee = computed(() => {
    return dataOrden.value.monto_comision
})

const bankName = computed(() => {
    return dataOrden.value.bankUser.name_bank
})

const amount = computed(() => {
    return dataOrden.value.monto_send
})

const token = computed(() => {
    return getKeyFacilToken(dataOrden.value.bankUser.id)
})
// VALIDAR DNI/CE PARA FACTURACION

const jsonObject = computed(() => ({
    tipo: '03', // BOLETA
    serie: serie.value,
    fecha_emision: new Date().toISOString(), // FECHA ACTUAL
    tipo_operacion: '0101', // VENTA
    cliente_tipo: '1', // DNI O CE
    cliente_documento: dni.value,
    cliente_nombre: fullName.value,
    cliente_email: email.value,
    observaciones:
        'REGISTRADO EN SBS PARA REALIZAR OPERACIONES FINANCIERAS SEGUN RESOLUCION: 03260-2022',
    descuento_global_porcentaje: 0,
    moneda: 'PEN',
    items: [
        {
            codigo: 'ABCD000001',
            descripcion: `POR LA COMISION DEL CAMBIO DE SALDO; POR USO DE LAS CUENTAS RECAUDO, DE LA TARJETA ${bankName.value}; IMPORTE OPERADO: ${amount.value}`,
            unidad_medida: 'ZZ', // SERVICIOS
            cantidad: 1,
            precio_unitario: fee.value, // COMISION SOLES
            tipo_igv: '30' // OPERACION ONEROSA
        }
    ]
}))

const updateOrder = async (state) => {
    // userStore.stateLoadingGeneral(true)
    // let dt = {
    //     body: {
    //         state,
    //         obs: obs.value
    //     },
    //     orderId: route.params.idOrden
    // }
    // const result = await adminStore.updateStateOrder(dt)
    // if (result.success) {
    //     getOrden(route.params.idOrden)
    //     textInfo.value = false
    //     userStore.stateLoadingGeneral(false)
    // }

    if (state === 5) {
        try {
            const response = await axios.post(
                'https://api.vitekey.com/keyfact/integra/v1/invoices',
                JSON.stringify(jsonObject.value),
                {
                    headers: {
                        Authorization: `Bearer ${token.value}`,
                        'Content-Type': 'application/json'
                    }
                }
            )
            console.log('Factura enviada correctamente:', response.data)
        } catch (error) {
            console.error(
                'Error al enviar la factura:',
                error.response ? error.response.data : error.message
            )
        }
    }
}

const copyContent = async (data) => {
    let aux = document.createElement('input')
    aux.setAttribute('value', data)
    document.body.appendChild(aux)
    aux.select()
    document.execCommand('copy')
    document.body.removeChild(aux)
    showTooltip.value = 'Copiado'
    setTimeout(() => {
        showTooltip.value = 'Copiar'
    }, 1000)
}
</script>
