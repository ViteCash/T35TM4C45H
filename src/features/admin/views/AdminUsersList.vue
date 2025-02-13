<template>
    <AdminPanel title="Lista de usuarios">
        <template #leftBtn>
            <v-btn
                v-if="authStore.user.id_rol === 1"
                color="#146489"
                prepend-icon="mdi-format-list-bulleted"
                :text="isMobile ? '' : 'Lista de usuarios activos'"
                @click="redirectUserList()"
            />
        </template>
        <template #rightBtn>
            <v-btn
                v-if="authStore.user.id_rol === 1"
                color="#146489"
                prepend-icon="mdi-plus"
                :text="isMobile ? '' : 'Agregar colaborador'"
                @click="dialog = true"
            />
        </template>
        <v-row>
            <v-col cols="12" lg="4" md="12">
                <v-text-field
                    label="Buscar"
                    class="ip-form inpt-general"
                    v-model="searchText"
                    @keyup="setTextUser()"
                />
            </v-col>
            <v-col cols="12" lg="8" md="12" class="justify-end">
                <v-row no-gutters justify="end">
                    <v-col class="px-2" cols="12" lg="3" md="6">
                        <v-select
                            v-model="stateUser"
                            :items="states"
                            class="ip-form inpt-general"
                            label="Estados"
                            item-title="name"
                            item-value="id"
                            placeholder="Estados"
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
                    <v-col class="px-2" cols="12" lg="3" md="6">
                        <v-select
                            v-model="comision"
                            :items="comissions"
                            label="Comisiones"
                            class="ip-form inpt-general"
                            :item-title="
                                (item) => {
                                    if (item.monto === 'Todos') {
                                        return 'Todos'
                                    } else if (
                                        item.monto &&
                                        item.monto !== 'Todos'
                                    ) {
                                        return `${Number(item.monto)}%`
                                    }
                                }
                            "
                            item-value="monto"
                            placeholder="Comission"
                        >
                            <template #item="{ item, props }">
                                <v-list-item v-bind="props">
                                    <template #title>
                                        <div
                                            @click="searchComission(item.raw)"
                                            class="d-flex justify-star align-center"
                                        >
                                            {{
                                                item.raw.id !== 0
                                                    ? `${Number(
                                                          item.raw.monto
                                                      )}%`
                                                    : 'Todos'
                                            }}
                                        </div>
                                    </template>
                                </v-list-item>
                            </template>
                        </v-select>
                    </v-col>
                    <v-col class="px-2" cols="12" lg="3" md="6">
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
                            />
                        </v-menu>
                    </v-col>
                    <v-col class="px-2" cols="12" lg="3" md="6">
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
                        <td width="15%">{{ item.nombres }}</td>
                        <td width="15%">
                            {{
                                `${item.apellido_paterno} ${item.apellido_materno}`
                            }}
                        </td>
                        <td>{{ item.phone }}</td>
                        <td>{{ `${Number(item.comision)}%` }}</td>
                        <td>{{ formatDate2(item.creation_date) }}</td>
                        <td>
                            <div
                                class="state-order modal-order"
                                :class="
                                    item.state === 3 || item.state === 4
                                        ? 'inactivo'
                                        : item.state === 2
                                        ? 'activo'
                                        : item.state === 1
                                        ? 'por-validar'
                                        : item.state === 0
                                        ? 'registrado'
                                        : ''
                                "
                            >
                                {{
                                    item.state === 3
                                        ? 'Inactivo'
                                        : item.state === 2
                                        ? 'Activo'
                                        : item.state === 1
                                        ? 'Por Validar'
                                        : item.state === 0
                                        ? 'Registrado'
                                        : item.state === 4
                                        ? 'Desaprobado'
                                        : ''
                                }}
                            </div>
                        </td>
                        <td>
                            <div class="d-flex ml-4">
                                <router-link :to="`/dashboard/user/${item.id}`"
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
    <AdminModalUser :model="dialog" @close="dialog = false" />
</template>

<script setup>
import AdminModalUser from '../components/AdminModalUser.vue'
import AdminPanel from '../components/AdminPanel.vue'

import { computed, onMounted, ref } from 'vue'
import { adminAdminStore } from '@/stores/admin'
import { userAuthStore } from '@/stores/auth'
import { configLocal } from '@/shared/scripts/requestConfig.js'
import { formatDate1, formatDate2 } from '@/shared/scripts/helpers/formats.js'
import { useRouter, useRoute } from 'vue-router'
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes'
import { useDisplay } from 'vuetify'

const itemsPerPageValue = ref(10)
const loading = ref(true)
const totalItems = ref(0)
const users = ref([])
const pageIn = ref(0)
const searchText = ref('')
const states = ref(configLocal.statesUsuarios)
const stateUser = ref()
const comissions = ref([])
const comision = ref('Todos')
const dateStart = ref(null)
const dateEnd = ref(null)
const minDate = ref(null)
const dialog = ref(null)
const openDateStart = ref(false)
const openDateEnd = ref(false)

const router = useRouter()
const route = useRoute()
const adminStore = adminAdminStore()
const authStore = userAuthStore()
const { smAndDown } = useDisplay()

const dateStartNew = computed(() =>
    dateStart.value !== null ? formatDate2(dateStart.value) : ''
)
const dateEndNew = computed(() =>
    dateStart.value !== null ? formatDate2(dateEnd.value) : ''
)

const isMobile = computed(() => smAndDown.value)

const itemsOptions = configLocal.contTables
const headers = configLocal.headerUsuarios

const getDataUsers = async () => {
    loading.value = true
    const result = await adminStore.getUsers({
        size: itemsPerPageValue.value,
        page: pageIn.value,
        text: searchText.value,
        state: stateUser.value,
        comission: comision.value === 'Todos' ? null : comision.value,
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

const loadItems = async ({ page, itemsPerPage, sortBy }) => {
    minDate.value = new Date(dateStart.value)
    comissions.value = [
        { id: 0, monto: 'Todos' },
        ...JSON.parse(JSON.stringify(authStore.comissions))
    ]
    if (route.query.state) {
        stateUser.value = parseInt(route.query.state)
    }
    if (route.query.comision) {
        comision.value = route.query.comision
    }
    if (route.query.fechaInicio && route.query.fechaFin) {
        dateStart.value = new Date(formatDate2(route.query.fechaInicio))
        dateEnd.value = new Date(formatDate2(route.query.fechaFin))
    }
    if (route.query.text) {
        searchText.value = route.query.text
    }
    pageIn.value = page - 1
    await getDataUsers()
}

const searchState = async (state) => {
    stateUser.value = parseInt(state.id)
    router.push({
        path: '/dashboard/users',
        query: { ...route.query, state: state.id }
    })
    await getDataUsers()
}

const searchComission = async (value) => {
    router.push({
        path: '/dashboard/users',
        query: { ...route.query, comision: value.monto }
    })
    comision.value = value.monto
    await getDataUsers()
}

const selectDateStart = async () => {
    minDate.value = new Date(dateStart.value)
    if (dateEnd.value === null) {
        dateEnd.value = new Date(Date.now())
    }
    router.push({
        path: '/dashboard/users',
        query: {
            ...route.query,
            fechaInicio: formatDate2(dateStart.value),
            fechaFin: formatDate2(dateEnd.value)
        }
    })
    await getDataUsers()
}

const selectDateEnd = async () => {
    router.push({
        path: '/dashboard/users',
        query: { ...route.query, fechaFin: formatDate2(dateEnd.value) }
    })
    await getDataUsers()
}

const setTextUser = async () => {
    router.push({
        path: '/dashboard/users',
        query: { ...route.query, text: searchText.value }
    })
    await getDataUsers()
}

const redirectUserList = () => {
    router.push({ path: '/dashboard/user/userActive' })
}

onMounted(async () => {
    await validateRoutes('users')
})
</script>

<style lang="scss" scoped>
.w-90 {
    width: 90%;
}

.addColaborator {
    position: absolute;
    top: 40px;
    right: 6%;
}

.listActiveUsers {
    position: absolute;
    top: 40px;
    left: 6%;
}
</style>
