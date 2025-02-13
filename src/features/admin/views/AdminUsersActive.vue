<template>
    <AdminPanel title="Lista de usuarios activos por mes">
        <v-row>
            <v-col cols="12" lg="3">
                <v-select
                    v-model="monthI"
                    :items="months"
                    label="Mes inicial"
                    class="ip-form inpt-general"
                    item-title="name"
                    item-value="id"
                >
                    <template #item="{ item, props }">
                        <v-list-item
                            v-bind="props"
                            @click="searchMonth(item.raw)"
                        >
                            <template #title>
                                <div class="d-flex justify-star align-center">
                                    {{ `${item.raw.name}` }}
                                </div>
                            </template>
                        </v-list-item>
                    </template>
                </v-select>
            </v-col>
            <v-col cols="12" lg="3">
                <v-select
                    v-model="year"
                    :items="years"
                    label="Año"
                    class="ip-form inpt-general"
                    item-title="name"
                    item-value="id"
                >
                    <template #item="{ item, props }">
                        <v-list-item
                            v-bind="props"
                            @click="searchYear(item.raw)"
                        >
                            <template #title>
                                <div class="d-flex justify-star align-center">
                                    {{ `${item.raw.name}` }}
                                </div>
                            </template>
                        </v-list-item>
                    </template>
                </v-select>
            </v-col>
            <v-col cols="12" lg="3">
                <v-select
                    v-model="bank"
                    :items="banks"
                    label="Bancos"
                    class="ip-form inpt-general"
                    item-title="name_bank"
                    item-value="id"
                >
                    <template #item="{ item, props }">
                        <v-list-item
                            v-bind="props"
                            @click="searchBank(item.raw)"
                        >
                            <template #title>
                                <div class="d-flex justify-star align-center">
                                    {{ `${item.raw.name_bank}` }}
                                </div>
                            </template>
                        </v-list-item>
                    </template>
                </v-select>
            </v-col>
            <v-col cols="12" lg="3">
                <v-select
                    v-model="order_type"
                    :items="orders_types"
                    label="Ordenar por"
                    class="ip-form inpt-general"
                    item-title="name"
                    item-value="id"
                >
                    <template #item="{ item, props }">
                        <v-list-item
                            v-bind="props"
                            @click="searchOrder(item.raw)"
                        >
                            <template #title>
                                <div class="d-flex justify-star align-center">
                                    {{ `${item.raw.name}` }}
                                </div>
                            </template>
                        </v-list-item>
                    </template>
                </v-select>
            </v-col>
        </v-row>

        <v-data-table-server
            class="cl-table"
            v-model:items-per-page="itemsPerPageValue"
            :headers="headers"
            style="height: 650px"
            :items-length="totalItems"
            :items="users"
            :loading="loading"
            item-value="name"
            :items-per-page-options="itemsOptions"
            @update:options="loadItems"
        >
            <template v-slot:item="{ item }">
                <tr>
                    <td width="12%">
                        {{
                            `${item.type_document === 1 ? 'DNI' : 'CE'} - ${
                                item.dni
                            }`
                        }}
                    </td>
                    <td width="15%">
                        {{
                            `${item.nombres} ${item.apellido_paterno} ${item.apellido_materno}`
                        }}
                    </td>
                    <td width="15%">
                        {{
                            `${item.MatchCount} Ordenes - S/ ${formatComas(
                                item.CounMontos
                            )} `
                        }}
                    </td>
                </tr>
            </template>
        </v-data-table-server>
    </AdminPanel>
</template>

<script setup>
import AdminPanel from '../components/AdminPanel.vue'
import { onMounted, ref } from 'vue'
import { adminAdminStore } from '@/stores/admin'
import { userAuthStore } from '@/stores/auth'
import { configLocal } from '@/shared/scripts/requestConfig.js'
import { formatComas } from '@/shared/scripts/helpers/formats.js'
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes'

const adminStore = adminAdminStore()
const authStore = userAuthStore()
const itemsPerPageValue = ref(10)
const loading = ref(true)
const totalItems = ref(0)
const users = ref([])
const pageIn = ref(0)
const itemsOptions = configLocal.contTables
const headers = configLocal.headerUsuariosActives
const bank = ref(null)
const banks = ref([])
const order_type = ref(2)
const year = ref(2025)
const orders_types = [
    { id: 1, name: 'Ordenes' },
    { id: 2, name: 'Monto' }
]
const date = new Date()
const monthI = ref(date.getMonth() + 1)
const months = [
    { id: 1, name: 'Enero' },
    { id: 2, name: 'Febrero' },
    { id: 3, name: 'Marzo' },
    { id: 4, name: 'Abril' },
    { id: 5, name: 'Mayo' },
    { id: 6, name: 'Junio' },
    { id: 7, name: 'Julio' },
    { id: 8, name: 'Agosto' },
    { id: 9, name: 'Septiembre' },
    { id: 10, name: 'Octubre' },
    { id: 11, name: 'Noviembre' },
    { id: 12, name: 'Diciembre' }
]

const years = ref([
    { id: 2024, name: '2024' },
    { id: 2025, name: '2025' },
    { id: 2026, name: '2026' },
    { id: 2027, name: '2027' }
])

onMounted(async () => {
    await validateRoutes('users')
    banks.value = [
        { id: 0, name_bank: 'Todos' },
        ...JSON.parse(JSON.stringify(authStore.banks))
    ]
    bank.value = 0
})

const getDataUsers = async () => {
    loading.value = true
    const result = await adminStore.getUsersActives({
        size: itemsPerPageValue.value,
        year: year.value,
        page: pageIn.value,
        bank_id: bank.value,
        month: monthI.value < 10 ? `0${monthI.value}` : monthI.value,
        order_type: order_type.value
    })
    if (result.success) {
        users.value = result.data.rows
        totalItems.value = result.data.count
        loading.value = false
    }
}

const searchBank = (state) => {
    loading.value = true
    bank.value = state.id
    loading.value = true
    getDataUsers()
}

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
    pageIn.value = page - 1
    await getDataUsers()
}

const searchMonth = async (state, type) => {
    loading.value = true
    monthI.value = state.id
    await getDataUsers()
}

const searchOrder = async (state, type) => {
    loading.value = true
    order_type.value = state.id
    await getDataUsers()
}

const searchYear = async (state, type) => {
    loading.value = true
    year.value = state.id
    await getDataUsers()
}
</script>
