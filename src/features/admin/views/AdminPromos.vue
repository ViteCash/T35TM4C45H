<template>
    <AdminPanel title="Codigos de Promoción">
        <template v-if="validateUserActivePermiss" #rightBtn>
            <v-btn
                color="success"
                prepend-icon="mdi-plus"
                text="Agregar nueva promoción"
                @click="dialog = true"
            />
        </template>
        <div class="w-33">
            <v-text-field
                label="Buscar codigo"
                class="ip-form inpt-general"
                v-model="searchText"
                @keyup="getDataPromociones()"
            />
        </div>
        <v-data-table-server
            class="cl-table"
            v-model:items-per-page="itemsPerPageValue"
            :headers="headers"
            style="height: 650px"
            :items-length="totalItems"
            :items="promociones"
            :loading="loading"
            item-value="name"
            :items-per-page-options="itemsOptions"
            @update:options="loadItems"
        >
            <template v-slot:item="{ item }">
                <tr>
                    <td>{{ item.name }}</td>
                    <td>{{ `${Number(item.percent_discount)} %` }}</td>
                    <td>{{ item.cant }}</td>
                    <td>{{ item.cant_user }}</td>
                    <td>{{ formatDate2(item.date_created) }}</td>
                    <td>{{ formatDate2(item.date_expired) }}</td>
                    <td>
                        <div
                            class="state-order modal-order"
                            :class="item.state === 0 ? 'inactivo' : 'activo'"
                        >
                            {{ item.state === 0 ? 'Inactivo' : 'Activo' }}
                        </div>
                    </td>
                    <td>
                        <div class="d-flex ml-4">
                            <router-link :to="`/dashboard/promocion/${item.id}`"
                                ><v-icon class="mr-2" color="#00ACAC"
                                    >mdi-eye</v-icon
                                ></router-link
                            >
                        </div>
                    </td>
                </tr>
            </template>
        </v-data-table-server>
        <v-dialog v-model="dialog" width="600">
            <v-card>
                <v-card-text>
                    <div class="content-info-form">
                        <h1 class="mb-10 text-center">
                            Generar nueva Promoción
                        </h1>
                        <v-form ref="formPromo">
                            <div class="section-banks">
                                <v-row>
                                    <v-col cols="12" class="pa-0">
                                        <div class="w-100">
                                            <div>
                                                <v-text-field
                                                    label="Ingrese Codigo"
                                                    v-model="form.codigo"
                                                    class="ip-form inpt-general text-capitalize mb-2"
                                                    :rules="rulesCodigo"
                                                />
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" class="pa-0">
                                        <div class="w-100">
                                            <div>
                                                <v-text-field
                                                    label="Descuento (%)"
                                                    v-model="form.descuento"
                                                    class="ip-form inpt-general mb-2"
                                                    :rules="
                                                        numberRulesDescuento
                                                    "
                                                />
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" class="pa-0">
                                        <div class="w-100">
                                            <div>
                                                <v-text-field
                                                    label="Limite de usos"
                                                    v-model="form.limit"
                                                    class="ip-form inpt-general mb-2"
                                                    :rules="numberRulesLimite"
                                                />
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" class="pa-0">
                                        <div class="w-100">
                                            <div>
                                                <v-text-field
                                                    label="Limite por Usuario"
                                                    v-model="form.limit_client"
                                                    class="ip-form inpt-general mb-2"
                                                    :rules="
                                                        numberRulesLimiteUser
                                                    "
                                                />
                                            </div>
                                        </div>
                                    </v-col>
                                    <v-col
                                        cols="12"
                                        lg="12"
                                        md="12"
                                        class="pa-0"
                                    >
                                        <v-menu
                                            v-model="openDateStart"
                                            :close-on-content-click="false"
                                        >
                                            <template #activator="{ props }">
                                                <v-text-field
                                                    v-model="dateStartNew"
                                                    class="inpt-general"
                                                    label="Fecha de termino"
                                                    readonly
                                                    append-inner-icon="mdi-calendar"
                                                    :rules="rulesDate"
                                                    v-bind="props"
                                                />
                                            </template>
                                            <v-date-picker
                                                v-model="form.date_expired"
                                                color="primary"
                                                format="dd/MM/yyyy"
                                                show-adjacent-months
                                                hideHeader
                                                hideWeekdays
                                                @update:model-value="
                                                    selectDateStart(),
                                                        (openDateStart = false)
                                                "
                                            />
                                        </v-menu>
                                    </v-col>
                                </v-row>
                            </div>

                            <div
                                class="btn-add-bank d-flex justify-center align-center text-center mt-10 ga-2"
                            >
                                <v-btn
                                    color="#0085AE"
                                    text="Cancelar"
                                    @click="dialog = false"
                                />
                                <v-btn
                                    :loading="loadingBu"
                                    color="#70BA44"
                                    text="Generar"
                                    @click="continuar"
                                />
                            </div>
                        </v-form>
                    </div>
                </v-card-text>
            </v-card>
        </v-dialog>
    </AdminPanel>
</template>

<script setup>
import AdminPanel from '../components/AdminPanel.vue'

import { computed, onMounted, ref } from 'vue'
import { adminAdminStore } from '@/stores/admin'
import { userAuthStore } from '@/stores/auth'
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes.js'
import { configLocal } from '@/shared/scripts/requestConfig.js'
import { formatDate2 } from '@/shared/scripts/helpers/formats.js'

const adminStore = adminAdminStore()
const authStore = userAuthStore()
const itemsPerPageValue = ref(10)
const loading = ref(true)
const loadingBu = ref(false)
const totalItems = ref(0)
const promociones = ref([])
const pageIn = ref(0)
const searchText = ref('')
const comissions = ref([])
const dateStart = ref(null)
const dateEnd = ref(null)
const minDate = ref(null)
const formPromo = ref(null)

const form = ref({
    codigo: '',
    descuento: '',
    limit: '',
    limit_client: '',
    date_expired: null
})

const validateUserActivePermiss = computed(() => validateRoutes('Promociones'))

const openDateStart = ref(false)
const itemsOptions = configLocal.contTables
const headers = configLocal.headerPromociones

const dialog = ref(false)

const rulesDate = [(v) => !!v || 'Ingresa una fecha']

const rulesCodigo = [(v) => !!v || 'Ingresa un Codigo de Promoción']

const numberRulesDescuento = [
    (v) => Number.isInteger(Number(v)) || 'Solo números',
    (v) => !!v || 'Ingresa un porcentaje de descuento'
]

const numberRulesLimite = [
    (v) => Number.isInteger(Number(v)) || 'Solo números',
    (v) => !!v || 'Ingrese un limite de uso'
]

const numberRulesLimiteUser = [
    (v) => Number.isInteger(Number(v)) || 'Solo números',
    (v) => !!v || 'Ingrese un limite de uso para los clientes'
]

onMounted(async () => {
    minDate.value = new Date(dateStart.value)
    comissions.value = [
        { id: 0, monto: 'Todos' },
        ...JSON.parse(JSON.stringify(authStore.comissions))
    ]
    await getDataPromociones()
})

const getDataPromociones = async () => {
    loading.value = true
    const result = await adminStore.getPromociones({
        size: itemsPerPageValue.value,
        page: pageIn.value,
        text: searchText.value
    })
    if (result.success) {
        promociones.value = result.data.rows
        totalItems.value = result.data.count
        loading.value = false
    }
}

const loadItems = ({ page, itemsPerPage, sortBy }) => {
    pageIn.value = page - 1
    itemsPerPageValue.value = itemsPerPage
    getDataPromociones()
}

const selectDateStart = () => {
    if (dateEnd.value === null) dateEnd.value = new Date(Date.now())
}

const dateStartNew = computed(() =>
    form.value.date_expired !== null ? formatDate2(form.value.date_expired) : ''
)

const continuar = async () => {
    const valid = await formPromo.value.validate()
    loadingBu.value = true
    if (valid.valid) {
        const data = {
            ...form.value,
            codigo: form.value.codigo.toUpperCase()
        }
        try {
            const result = await adminStore.sendDataPromocode(data)
            if (result.success) {
                setTimeout(() => {
                    loadingBu.value = false
                    dialog.value = false
                    getDataPromociones()
                }, 2000)
            } else {
                loadingBu.value = false
            }
        } catch (error) {
            loadingBu.value = false
        }
    } else {
        loadingBu.value = false
    }
}
</script>
