<template>
    <AdminPanel title="Detalle de Codigo de Promoción">
        <div v-if="validateUserActivePermiss" class="d-flex justify-end ga-2">
            <v-btn
                color="warning"
                v-if="disabledEdit"
                text="Editar"
                @click="disabledEdit = false"
            />
            <v-btn
                color="success"
                v-if="!disabledEdit"
                text="Guardar"
                @click="saveChanges"
            />

            <v-btn
                color="red"
                v-if="!disabledEdit"
                text="Cancel"
                @click="cancelChanges()"
            />
            <v-btn
                color="red"
                v-if="disabledEdit && dataUser.state === 1"
                text="Inactivar"
                @click="inactivePromo(0)"
            />
            <v-btn
                color="success"
                v-if="disabledEdit && dataUser.state === 0"
                text="Activar"
                @click="inactivePromo(1)"
            />
        </div>
        <AdminDetailsSection title="Información">
            <v-form ref="formRegister">
                <v-row>
                    <v-col cols="4">
                        <v-text-field
                            v-if="!disabledEdit"
                            label="Codigo de Promoción"
                            v-model="dataUser.name"
                            class="ip-form inpt-general text-capitalize"
                            :rules="nameRules"
                        />
                        <div v-else class="w-100 content-input-changes">
                            <div class="ip-form-detail-data mb-4">
                                <span>Codigo de Promoción</span>
                                {{ dataUser.name }}
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                            v-if="!disabledEdit"
                            label="Procentaje de Descuento"
                            v-model="dataUser.percent_discount"
                            class="ip-form inpt-general"
                            :rules="numberRulesDescuento"
                        />
                        <div v-else class="w-100 content-input-changes">
                            <div class="ip-form-detail-data mb-4">
                                <span>Procentaje de Descuento</span>
                                {{ `${Number(dataUser.percent_discount)}%` }}
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="4">
                        <v-text-field
                            v-if="!disabledEdit"
                            v-model="dataUser.cant"
                            label="Cantidad de usos"
                            class="ip-form inpt-general"
                            :rules="numberRulesDescuento"
                        />
                        <div v-else class="w-100 content-input-changes">
                            <div class="ip-form-detail-data mb-4">
                                <span>Cantidad de usos</span>
                                {{ dataUser.cant }}
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="4"
                        ><v-text-field
                            v-if="!disabledEdit"
                            v-model="dataUser.cant_user"
                            label="Cantidad de usos por cliente"
                            class="ip-form inpt-general"
                            :rules="numberRulesDescuento"
                        />
                        <div v-else class="w-100 content-input-changes">
                            <div class="ip-form-detail-data mb-4">
                                <span>Cantidad de uso por cliente</span>
                                {{ dataUser.cant_user }}
                            </div>
                        </div></v-col
                    >
                    <v-col cols="4">
                        <v-menu
                            v-if="!disabledEdit"
                            v-model="openDateStart"
                            :close-on-content-click="false"
                        >
                            <template #activator="{ props }">
                                <v-text-field
                                    v-model="dateStartNew"
                                    class="inpt-general"
                                    label="Fecha de expiración"
                                    readonly
                                    append-inner-icon="mdi-calendar"
                                    v-bind="props"
                                />
                            </template>
                            <v-date-picker
                                v-model="dateStart"
                                :min="minDate"
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
                        <div v-else class="w-100 content-input-changes">
                            <div class="ip-form-detail-data mb-4">
                                <span>Fecha de expiración</span>
                                {{ formatDate2(dataUser.date_expired) }}
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </v-form>
        </AdminDetailsSection>

        <AdminDetailsSection title="Cantidad de usos">
            <v-data-table-virtual
                :headers="headers"
                :items="dataUser.promocodeHistories"
                height="300"
                item-value="name"
            >
                <template v-slot:item="{ item }">
                    <tr>
                        <td>{{ formatDate2(item.date_use) }}</td>
                        <td>{{ item.user.dni }}</td>
                        <td>
                            {{
                                `${item.user.apellido_paterno} ${item.user.apellido_materno} ${item.user.nombres}`
                            }}
                        </td>
                    </tr>
                </template>
            </v-data-table-virtual>
        </AdminDetailsSection>
    </AdminPanel>
</template>

<script setup>
import AdminPanel from '../components/AdminPanel.vue'
import AdminDetailsSection from '../components/AdminDetailsSection.vue'

import { computed, onMounted, ref } from 'vue'
import { adminAdminStore } from '@/stores/admin'
import { userUserStore } from '@/stores/user'
import { useRoute } from 'vue-router'
import { formatDate2, formatDate1 } from '@/shared/scripts/helpers/formats.js'
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes.js'

const dataUser = ref({})
const dataReactiveUser = ref({})
const route = useRoute()
const disabledEdit = ref(true)
const formRegister = ref(null)
const openDateStart = ref(false)
const dateStart = ref(null)
const minDate = ref(null)

const adminStore = adminAdminStore()
const userStore = userUserStore()

const validateUserActivePermiss = computed(() => validateRoutes('Promociones'))

const dateStartNew = computed(() =>
    dateStart.value !== null ? formatDate2(dateStart.value) : ''
)

const headers = [
    { title: 'Fecha de uso', key: 'date_use', sortable: false },
    { title: 'DNI', key: 'user.dni', sortable: false },
    { title: 'Cliente', key: `user.apellido_materno`, sortable: false }
]

const selectDateStart = () => {
    dataUser.value.date_expired = formatDate1(dateStart.value)
}

const getPromocion = async (id) => {
    const result = await adminStore.getPromocion(id)
    if (result.success) {
        dataUser.value = {
            ...result.data,
            percent_discount: Number(result.data.percent_discount)
        }
        dataReactiveUser.value = result.data
        let dat = result.data.date_expired.split('-')
        dateStart.value = new Date(`${dat[1]}-${dat[2]}-${dat[0]}`)
        minDate.value = new Date(dateStart.value)
        userStore.stateLoadingGeneral(false)
    }
}

const cancelChanges = async (id) => {
    await getPromocion(route.params.idPromocion)
    disabledEdit.value = true
}

const saveChanges = async () => {
    userStore.stateLoadingGeneral(true)
    const { valid } = await formRegister.value.validate()
    if (valid) {
        const data = {
            name: dataUser.value.name,
            percent_discount: dataUser.value.percent_discount,
            cant: dataUser.value.cant,
            cant_user: dataUser.value.cant_user,
            date_expired: dataUser.value.date_expired,
            id: dataUser.value.id
        }

        const result = await adminStore.updatePromotion(data)
        if (result.success) {
            cancelChanges()
            userStore.stateLoadingGeneral(false)
        } else {
            userStore.stateLoadingGeneral(false)
        }
    }
}

const nameRules = [(v) => !!v || 'Nombre obligatorio']

const numberRulesDescuento = [
    (v) => Number.isInteger(Number(v)) || 'Solo números',
    (v) => !!v || 'Campo obligatorio'
]

const inactivePromo = async (state) => {
    const result = await adminStore.inactivePromotion({
        promocode: dataUser.value.id,
        state: state
    })
    if (result.success) {
        cancelChanges()
        userStore.stateLoadingGeneral(false)
    } else {
        userStore.stateLoadingGeneral(false)
    }
}

onMounted(async () => {
    userStore.stateLoadingGeneral(true)
    await getPromocion(route.params.idPromocion)
})
</script>
