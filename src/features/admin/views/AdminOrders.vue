<template>
    <AdminPanel title="Listas de Ordenes">
        <v-row>
            <v-col cols="12" lg="3" md="3">
                <v-text-field
                    label="Buscar por datos de Usuarios"
                    class="ip-form inpt-general"
                    v-model="searchTextUser"
                    @keyup="setTextUser()"
                />
            </v-col>
            <v-col cols="12" lg="3" md="3">
                <v-text-field
                    label="Buscar por datos de Orden"
                    class="ip-form inpt-general"
                    v-model="searchTextOrden"
                    @keyup="setTextOrden()"
                />
            </v-col>
            <v-col cols="12" lg="6" md="6" class="justify-end">
                <v-row no-gutters>
                    <v-col class="ms-md-auto" cols="12" lg="4">
                        <v-select
                            v-model="stateUser"
                            :items="states"
                            label="Estados"
                            class="ip-form inpt-general"
                            item-title="name"
                            item-value="id"
                        >
                            <template #item="{ item, props }">
                                <v-list-item v-bind="props">
                                    <template #title>
                                        <div
                                            @click="searchState(item.raw)"
                                            class="d-flex justify-star align-center"
                                        >
                                            {{ `${item.raw.name}` }}
                                        </div>
                                    </template>
                                </v-list-item>
                            </template>
                        </v-select>
                    </v-col>
                    <v-col class="px-2" cols="12" lg="4" md="6">
                        <v-menu
                            v-model="openDateStart"
                            :close-on-content-click="false"
                        >
                            <template #activator="{ props }">
                                <v-text-field
                                    v-model="dateStartNew"
                                    class="inpt-general"
                                    label="Fecha inicio"
                                    readonly
                                    append-inner-icon="mdi-calendar"
                                    v-bind="props"
                                />
                            </template>
                            <v-date-picker
                                v-model="dateStart"
                                color="primary"
                                format="dd/MM/yyyy"
                                show-adjacent-months
                                hideHeader
                                hideWeekdays
                                @update:model-value="
                                    selectDateStart(), (openDateStart = false)
                                "
                            ></v-date-picker>
                        </v-menu>
                    </v-col>
                    <v-col class="px-2" cols="12" lg="4" md="6">
                        <v-menu
                            v-model="openDateEnd"
                            :close-on-content-click="false"
                        >
                            <template #activator="{ props }">
                                <v-text-field
                                    v-model="dateEndNew"
                                    class="inpt-general"
                                    label="Fecha fin"
                                    readonly
                                    append-inner-icon="mdi-calendar"
                                    v-bind="props"
                                />
                            </template>
                            <v-date-picker
                                v-model="dateEnd"
                                :min="minDate"
                                color="primary"
                                format="dd/MM/yyyy"
                                show-adjacent-months
                                hideHeader
                                hideWeekdays
                                @update:model-value="
                                    selectDateEnd(), (openDateEnd = false)
                                "
                            />
                        </v-menu>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
        <div class="d-flex align-center justify-center">
            <v-data-table-server
                class="cl-table"
                style="height: 650px"
                v-model:items-per-page="itemsPerPageValue"
                :headers="headers"
                :items-length="totalItems"
                :items="users"
                :loading="loading"
                item-value="name"
                loading-text="Loading..."
                no-data-text="No se encontraron resultados."
                :items-per-page-options="itemsOptions"
                @update:options="loadItems"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td width="12%">
                            {{
                                `${
                                    item.user.type_document === 1 ? 'DNI' : 'CE'
                                } - ${item.user.dni}`
                            }}
                        </td>
                        <td>{{ formatDate2(item.create_date) }}</td>
                        <td>{{ `S/ ${formatComas(item.monto_send)}` }}</td>
                        <td>
                            {{
                                `${item.user.nombres} ${item.user.apellido_paterno} ${item.user.apellido_materno}`
                            }}
                        </td>
                        <td>{{ item.codigo }}</td>
                        <td>
                            <img
                                width="70"
                                height="30"
                                class="mr-3"
                                :src="getImage(item.userBank.bank.icon)"
                            />
                        </td>
                        <td>
                            <div
                                class="state-order modal-order"
                                :class="
                                    item.state === 1
                                        ? 'pendiente'
                                        : item.state === 5
                                        ? 'completado'
                                        : 'observado'
                                "
                            >
                                {{
                                    item.state === 1
                                        ? 'Pendiente'
                                        : item.state === 5
                                        ? 'Completado'
                                        : 'Observado'
                                }}
                            </div>
                        </td>
                        <td>
                            <div class="d-flex ml-4">
                                <router-link :to="`/dashboard/orden/${item.id}`"
                                    ><v-icon class="mr-2" color="#00ACAC"
                                        >mdi-eye</v-icon
                                    ></router-link
                                >
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table-server>
        </div>
    </AdminPanel>
</template>

<script setup>
import AdminPanel from '../components/AdminPanel.vue'

import { computed, onMounted, ref } from 'vue'
import { adminAdminStore } from '@/stores/admin'
import { configLocal } from '@/shared/scripts/requestConfig.js'
import {
    formatComas,
    formatDate1,
    formatDate2
} from '@/shared/scripts/helpers/formats.js'
import { useRouter, useRoute } from 'vue-router'
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes'

const router = useRouter()
const route = useRoute()
const adminStore = adminAdminStore()
const itemsPerPageValue = ref(10)
const loading = ref(true)
const totalItems = ref(0)
const users = ref([])
const pageIn = ref(0)
const searchTextUser = ref('')
const searchTextOrden = ref('')
const dateStart = ref(null)
const dateEnd = ref(null)
const minDate = ref(null)
const openDateStart = ref(false)
const openDateEnd = ref(false)
const states = ref(configLocal.stateOrdenes)
const itemsOptions = configLocal.contTables
const stateUser = ref()
const headers = configLocal.headerOrders

const dateStartNew = computed(() =>
    dateStart.value !== null ? formatDate2(dateStart.value) : ''
)

const dateEndNew = computed(() =>
    dateStart.value !== null ? formatDate2(dateEnd.value) : ''
)

const getImage = (img) => {
    return new URL(`../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}

const getDataUsers = async () => {
    loading.value = true
    const result = await adminStore.getOrders({
        size: itemsPerPageValue.value,
        page: pageIn.value,
        textUser: searchTextUser.value,
        textOrden: searchTextOrden.value,
        state: stateUser.value,
        lst: 'orden',
        startDate:
            dateStart.value !== null ? formatDate1(dateStart.value) : undefined,
        endDate: dateEnd.value !== null ? formatDate1(dateEnd.value) : undefined
    })
    if (result.success) {
        users.value = result.data.rows
        totalItems.value = result.data.count
        loading.value = false
    }
}

const selectDateStart = () => {
    minDate.value = new Date(dateStart.value)
    if (dateEnd.value === null) {
        dateEnd.value = new Date(Date.now())
    }
    router.push({
        path: '/dashboard/ordenes-admin',
        query: {
            ...route.query,
            fechaInicio: formatDate2(dateStart.value),
            fechaFin: formatDate2(dateEnd.value)
        }
    })
    getDataUsers()
}

const selectDateEnd = async () => {
    router.push({
        path: '/dashboard/ordenes-admin',
        query: { ...route.query, fechaFin: formatDate2(dateEnd.value) }
    })
    await getDataUsers()
}

const loadItems = ({ page, itemsPerPage, sortBy }) => {
    if (route.query.state) {
        stateUser.value = parseInt(route.query.state)
    }
    if (route.query.fechaInicio && route.query.fechaFin) {
        dateStart.value = new Date(formatDate2(route.query.fechaInicio))
        dateEnd.value = new Date(formatDate2(route.query.fechaFin))
    }
    if (route.query.textUser) {
        searchTextUser.value = route.query.textUser
    }
    if (route.query.textOrden) {
        searchTextOrden.value = route.query.textOrden
    }
    pageIn.value = page - 1
    itemsPerPageValue.value = itemsPerPage
    getDataUsers()
}

const searchState = async (state) => {
    stateUser.value = state.id
    router.push({
        path: '/dashboard/ordenes-admin',
        query: { ...route.query, state: state.id }
    })
    await getDataUsers()
}

const setTextUser = async () => {
    router.push({
        path: '/dashboard/ordenes-admin',
        query: { ...route.query, textUser: searchTextUser.value }
    })
    await getDataUsers()
}

const setTextOrden = async () => {
    router.push({
        path: '/dashboard/ordenes-admin',
        query: { ...route.query, textOrden: searchTextOrden.value }
    })
    await getDataUsers()
}

onMounted(async () => {
    await validateRoutes(route.name)
})
</script>
<style lang="scss"></style>
