<template>
    <AdminPanel title="Detalle de Pago">
        <template #rightBtn>
            <div
                v-if="
                    validateUserActivePermiss &&
                    !textInfo &&
                    dataOrden.state === 1 &&
                    route.name === 'pago'
                "
            >
                <div class="d-flex justify-end ga-2">
                    <v-btn
                        color="success"
                        text="Aprobar pago"
                        @click="updateOrder(3)"
                    />
                    <v-btn
                        color="red"
                        text="Cancelar pago"
                        @click="updateOrder(2)"
                    />
                </div>
            </div>
        </template>

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
                                :color="getTagState(item.state_order).color"
                                :text="getTagState(item.state_order).text"
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
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes.js'
import { adminAdminStore } from '@/stores/admin'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'
import { useRoute } from 'vue-router'
import { formatComas, formatDate2 } from '@/shared/scripts/helpers/formats.js'

const adminStore = adminAdminStore()
const userStore = userUserStore()
const authStore = userAuthStore()

const dataOrden = ref({})
const dataOrdenStore = ref({})
const route = useRoute()
const comissions = ref([])
const obs = ref('')
const textInfo = ref(false)
const showTooltip = ref('Copiar')

const validateUserActivePermiss = computed(() => validateRoutes('devoluciones'))
const routeImg = import.meta.env.VITE_APP_URL_S3

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

const updateOrder = async (state) => {
    userStore.stateLoadingGeneral(true)
    let dt = {
        body: {
            state,
            obs: obs.value
        },
        orderId: route.params.idOrden
    }
    const result = await adminStore.updateStateOrder(dt)
    if (result.success) {
        getOrden(route.params.idOrden)
        textInfo.value = false
        userStore.stateLoadingGeneral(false)
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

<style></style>
