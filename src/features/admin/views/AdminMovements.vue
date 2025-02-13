<template>
    <AdminPanel title="Movimientos" style="height: 800px" class="pt-4">
        <div class="d-flex flex-column ga-5">
            <div class="w-100 d-flex align-center">
                <h5 class="text-h5 text-lagoon-shade">Ingresos</h5>
                <div class="d-flex ga-2 w-100 justify-end">
                    <v-btn
                        v-if="!addIngresos"
                        color="success"
                        icon="mdi-plus"
                        @click=";(addIngresos = true), (addEgresos = false)"
                    />
                    <v-btn
                        v-if="addIngresos"
                        :loading="loadingSave"
                        class="ml-2"
                        @click="save(1)"
                        color="success"
                        text="Guardar"
                    />
                    <v-btn
                        v-if="addIngresos"
                        class="ml-2"
                        @click="addIngresos = false"
                        color="error"
                        text="Cancelar"
                    />
                </div>
                <v-form v-if="addIngresos" ref="formRegister" class="w-75">
                    <v-card class="card-content" width="100%">
                        <v-row>
                            <v-col lg="6" class="content-input-changes">
                                <v-text-field
                                    v-model="form.monto"
                                    prefix="S/"
                                    label="Monto"
                                    class="ip-form inpt-general"
                                    @blur="addComaNumber()"
                                    :rules="numberRulesSend"
                                />
                            </v-col>
                            <v-col lg="3">
                                <v-select
                                    label="Seleccione una entidad financiera"
                                    v-model="form.mrc_bank_id"
                                    :items="banks"
                                    class="ip-form inpt-general mb-2"
                                    item-title="name_bank"
                                    :rules="bankRules"
                                    item-value="id"
                                >
                                    <template #item="{ item, props }">
                                        <v-list-item v-bind="props">
                                            <template #title>
                                                <div
                                                    class="d-flex justify-star align-center"
                                                >
                                                    {{ item.raw.name_bank }}
                                                </div>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="form.obs"
                                    label="Observación"
                                    class="ip-form inpt-general"
                                    :rules="obsRules"
                                />
                            </v-col>
                        </v-row>
                    </v-card>
                </v-form>
            </div>
            <v-data-table-server
                class="cl-table"
                v-model:items-per-page="itemsPerPageValue"
                :headers="headers"
                :items-length="totalItems"
                :items="ingresos"
                :loading="loading"
                item-value="name"
                :items-per-page-options="itemsOptions"
                @update:options="loadItems1"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td width="">
                            {{ formatDate2(item.create_date) }}
                        </td>
                        <td width="">
                            {{ item.bank.name_bank }}
                        </td>
                        <td width="">{{ item.obs }}</td>
                        <td>
                            {{ `S/ ${formatComas(item.monto)}` }}
                        </td>
                        <td>
                            <div class="d-flex ml-4">
                                <v-icon color="red" @click="deleteItem(item.id)"
                                    >mdi-trash-can-outline</v-icon
                                >
                            </div>
                        </td>
                    </tr>
                </template>
            </v-data-table-server>
        </div>
        <div class="d-flex flex-column ga-5">
            <div class="w-100 d-flex align-center">
                <h5 class="text-h5 text-lagoon-shade">Egresos</h5>
                <div class="d-flex ga-2 w-100 justify-end">
                    <v-btn
                        v-if="!addEgresos"
                        color="success"
                        icon="mdi-plus"
                        @click=";(addEgresos = true), (addIngresos = false)"
                    />
                    <v-btn
                        v-if="addEgresos"
                        class="ml-2"
                        @click="save(2)"
                        color="success"
                        text="Guardar"
                    />
                    <v-btn
                        v-if="addEgresos"
                        class="ml-2"
                        @click="addEgresos = false"
                        color="error"
                        text="Cancelar"
                    />
                </div>
                <v-form v-if="addEgresos" ref="formRegister">
                    <v-card class="card-content" width="100%">
                        <v-row>
                            <v-col lg="6" class="content-input-changes">
                                <v-text-field
                                    v-model="form.monto"
                                    prefix="S/"
                                    label="Monto"
                                    class="ip-form inpt-general"
                                    @blur="addComaNumber()"
                                    :rules="numberRulesSend"
                                />
                            </v-col>
                            <v-col lg="6">
                                <v-select
                                    label="Seleccione una entidad financiera"
                                    v-model="form.mrc_bank_id"
                                    :items="banks"
                                    class="ip-form inpt-general mb-2"
                                    item-title="name_bank"
                                    :rules="bankRules"
                                    item-value="id"
                                >
                                    <template #item="{ item, props }">
                                        <v-list-item v-bind="props">
                                            <template #title>
                                                <div
                                                    class="d-flex justify-star align-center"
                                                >
                                                    {{ item.raw.name_bank }}
                                                </div>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col>
                                <v-text-field
                                    v-model="form.obs"
                                    label="Observación"
                                    class="ip-form inpt-general"
                                    :rules="obsRules"
                                />
                            </v-col>
                        </v-row>
                    </v-card>
                </v-form>
            </div>
            <v-data-table-server
                class="cl-table"
                v-model:items-per-page="itemsPerPageValue1"
                :headers="headers"
                :items-length="totalItems1"
                :items="egresos"
                :loading="loading1"
                item-value="name"
                :items-per-page-options="itemsOptions"
                @update:options="loadItems2"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td width="">
                            {{ formatDate2(item.create_date) }}
                        </td>
                        <td width="">
                            {{ item.bank.name_bank }}
                        </td>
                        <td width="">{{ item.obs }}</td>
                        <td>
                            {{ `S/ ${formatComas(item.monto)}` }}
                        </td>
                        <td>
                            <div class="d-flex ml-4">
                                <v-icon color="red" @click="deleteItem(item.id)"
                                    >mdi-trash-can-outline</v-icon
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

import { onMounted, reactive, ref } from 'vue'
import { adminAdminStore } from '@/stores/admin'
import { userAuthStore } from '@/stores/auth'
import { formatComas, formatDate2 } from '@/shared/scripts/helpers/formats.js'
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes'
import { configLocal } from '@/shared/scripts/requestConfig.js'

const ingresos = ref([])
const egresos = ref([])
const addIngresos = ref(false)
const addEgresos = ref(false)
const formRegister = ref(null)
const banks = ref([])
const loadingSave = ref(false)

const itemsPerPageValue = ref(10)
const itemsPerPageValue1 = ref(10)
const headers = configLocal.headerIngresosEgresos
const itemsOptions = configLocal.contTables
const totalItems = ref(0)
const totalItems1 = ref(0)
const loading = ref(true)
const loading1 = ref(true)
const pageIn = ref(0)
const pageIn1 = ref(0)

const adminStore = adminAdminStore()
const authStore = userAuthStore()

const form = reactive({
    monto: '',
    mrc_bank_id: null,
    obs: '',
    type: 1
})

const types = [
    { id: 1, name_type: 'Ingresos' },
    { id: 2, name_type: 'Egresos' }
]

onMounted(() => {
    banks.value = authStore.banks
    getIngresos()
    getEgresos()
})

const loadItems1 = async ({ page }) => {
    pageIn.value = page - 1
    await getIngresos()
}

const getIngresos = async () => {
    loading.value = true
    const result = await adminStore.getEgresos({
        size: itemsPerPageValue.value,
        page: pageIn.value,
        type: 1
    })
    if (result.success) {
        ingresos.value = result.data.rows
        totalItems.value = result.data.count
        loading.value = false
    }
}

const loadItems2 = async ({ page }) => {
    pageIn1.value = page - 1
    await getEgresos()
}

const getEgresos = async () => {
    loading1.value = true
    const result = await adminStore.getEgresos({
        size: itemsPerPageValue1.value,
        page: pageIn1.value,
        type: 2
    })
    if (result.success) {
        egresos.value = result.data.rows
        totalItems1.value = result.data.count
        loading1.value = false
    }
}

const save = async (type) => {
    const valid = await formRegister.value.validate()
    if (valid) {
        try {
            loadingSave.value = true
            const result = await adminStore.addegresos({
                ...form,
                monto: deleteComaNumber(form.monto),
                type: type
            })
            if (result.success) {
                loadingSave.value = false
                addIngresos.value = false
                addEgresos.value = false
                getEgresos()
                Object.assign(form, {
                    monto: '',
                    mrc_bank_id: null,
                    obs: ''
                })
            }
        } catch (error) {}
    }
}

const deleteComaNumber = (value) => {
    if (typeof value === 'string') {
        return value.replace(/,/g, '')
    } else return value
}

const addComaNumber = () => {
    form.monto = formatComas(form.monto)
}

const numberRulesSend = [
    (v) => !!v || 'Monto invalido',
    (v) => /^\d{1,5}(\.\d{1,2})?$/.test(deleteComaNumber(v)) || 'Solo números',
    (v) => (v.length > 10) | 'Limite superado'
]

const bankRules = [(v) => !!v || 'Seleccionar un banco']
const obsRules = [(v) => !!v || 'Campo Obligatorio']

const deleteItem = async (item) => {
    try {
        const result = await adminStore.deleteItemEging(item)
        getEgresos()
    } catch (error) {}
}

onMounted(async () => {
    await validateRoutes('egreso')
})
</script>
