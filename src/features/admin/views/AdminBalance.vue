<template>
    <AdminPanel title="Balance">
        <v-row>
            <v-col class="ms-md-auto" cols="12" lg="3">
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
                            @click="searchMonth(item.raw, 1)"
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
            <v-col class="ms-md-auto" cols="12" lg="3">
                <v-select
                    v-model="monthF"
                    :items="months"
                    label="Mes final"
                    class="ip-form inpt-general"
                    item-title="name"
                    item-value="id"
                >
                    <template #item="{ item, props }">
                        <v-list-item
                            v-bind="props"
                            @click="searchMonth(item.raw, 2)"
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
            <v-col class="ms-md-auto" cols="12" lg="3">
                <v-select
                    v-model="year"
                    :items="years"
                    label="Años"
                    class="ip-form inpt-general"
                    item-title="name"
                    item-value="id"
                >
                    <template #item="{ item, props }">
                        <v-list-item
                            v-bind="props"
                            @click="searchState(item.raw)"
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
            <v-col class="ms-md-auto" cols="12" lg="3">
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
        </v-row>
        <div v-if="loadingGeneral">
            <div v-for="(item, index) in 3" :key="index">
                <v-skeleton-loader
                    :loading="loadingGeneral"
                    type="text"
                    width="460"
                    style="background: transparent"
                >
                </v-skeleton-loader>
                <v-row>
                    <v-col
                        cols="12"
                        lg="4"
                        md="4"
                        v-for="(om, i) in 3"
                        :key="i"
                    >
                        <v-skeleton-loader
                            :loading="loadingGeneral"
                            type="image"
                        >
                        </v-skeleton-loader>
                    </v-col>
                </v-row>
            </div>
        </div>
        <div v-else class="d-flex align-center justify-center mt-5">
            <v-row>
                <v-col
                    cols="12"
                    lg="3"
                    md="3"
                    v-for="(item, index) in resumen"
                    :key="index"
                >
                    <h4 class="mb-5">{{ item.name_bank }}</h4>
                    <v-row>
                        <v-col cols="12" lg="12" md="12">
                            <div>
                                <div
                                    class="w-100 pl-3 py-2 d-flex justify-star align-center ct-info"
                                >
                                    <div class="">
                                        <div
                                            class="title d-flex justify-center align-center"
                                        >
                                            <div>Total Ordenes:</div>
                                            <div>
                                                <span class="pl-3 num">{{
                                                    item.contentInfo.ordenes ===
                                                    null
                                                        ? 0
                                                        : formatComas(
                                                              item.contentInfo
                                                                  .ordenes
                                                          )
                                                }}</span>
                                            </div>
                                        </div>
                                        <div class="title">Balance</div>
                                        <div class="text-center">
                                            S/.
                                            <span class="num monto">{{
                                                item.contentInfo.balance ===
                                                null
                                                    ? 0
                                                    : formatComas(
                                                          item.contentInfo
                                                              .balance
                                                      )
                                            }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </div>
        <v-row>
            <v-col cols="12" lg="8" md="8">
                <div class="mt-10 cont-grafic" id="contenedor">
                    <canvas id="myChart"></canvas>
                </div>
            </v-col>
            <v-col cols="12" lg="4" md="4" v-show="resumen.length > 1">
                <div class="mt-10 cont-grafic" id="contenedor2">
                    <canvas id="myChart1"></canvas>
                </div>
            </v-col>
        </v-row>
    </AdminPanel>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { adminAdminStore } from '@/stores/admin'
import { userAuthStore } from '@/stores/auth'
import Chart, { Colors } from 'chart.js/auto'
import { formatComas } from '@/shared/scripts/helpers/formats.js'
import { validateRoutes } from '@/shared/scripts/validatePermissRoutes'
import AdminPanel from '../components/AdminPanel.vue'

const adminStore = adminAdminStore()
const authStore = userAuthStore()
const resumen = ref([])
const year = ref(null)
const years = ref([
    { id: 2024, name: '2024' },
    { id: 2025, name: '2025' },
    { id: 2026, name: '2026' },
    { id: 2027, name: '2027' }
])

const monthI = ref(null)
const monthF = ref(null)

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

const option = ref('meses_balance')
const options = [
    { id: 'meses_balance', name: 'Balance' },
    { id: 'meses_ingresado', name: 'Monto Ingresado' },
    { id: 'meses_enviado', name: 'Monto Enviado' }
]

onMounted(async () => {
    await validateRoutes('resumen')
})

const bank = ref(null)
const banks = ref([])

const loading = ref(true)
const loadingGeneral = ref(true)

const labels = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
]

onMounted(async () => {
    const date = new Date()
    year.value = date.getFullYear()
    monthI.value = date.getMonth() + 1
    monthF.value = date.getMonth() + 1
    banks.value = [
        { id: 0, name_bank: 'Todos' },
        ...JSON.parse(JSON.stringify(authStore.banks))
    ]
    bank.value = 0
    await getDataResumen()
})

const getDataResumen = async () => {
    const result = await adminStore.getDataResumen({
        year: year.value,
        bank: bank.value,
        monthInicial: monthI.value < 10 ? `0${monthI.value}` : monthI.value,
        monthFinal: monthF.value < 10 ? `0${monthF.value}` : monthF.value
    })
    if (result.success) {
        resumen.value = await result.data
        loadingGeneral.value = false
        option.value = 'meses_balance'
        let item = result.data[0].contentInfo.meses_balance
        let montos = JSON.parse(item)
        document.getElementById('myChart').remove()
        let canvas = document.createElement('canvas')
        canvas.id = 'myChart'
        document.getElementById('contenedor').appendChild(canvas)
        if (resumen.value.length === 1) {
            if (document.getElementById('myChart1'))
                document.getElementById('myChart1').remove()
            let datasets = [
                {
                    label: resumen.value[0].name_bank,
                    backgroundColor: resumen.value[0].color,
                    borderColor: resumen.value[0].color,
                    data: montos
                }
            ]
            const myChart = new Chart(document.getElementById('myChart'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets
                },
                options: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            let indice = tooltipItem.index
                            return (
                                data.labels[indice] +
                                ': ' +
                                data.datasets[0].data[indice] +
                                '%'
                            )
                        }
                    }
                }
            })
        } else {
            if (document.getElementById('myChart1'))
                document.getElementById('myChart1').remove()
            let canvas = document.createElement('canvas')
            canvas.id = 'myChart1'
            document.getElementById('contenedor2').appendChild(canvas)
            let cantidadesTotales = result.data[0].contentInfo.total_ordenes
            let values = []
            let colors = []
            let namesBancos = []
            for (let i = 0; i < result.data.length; i++) {
                let dt = Math.round(
                    (result.data[i].contentInfo.ordenes * 100) /
                        cantidadesTotales
                )
                values.push(dt)
                colors.push(result.data[i].color)
                namesBancos.push(result.data[i].name_bank)
            }

            new Chart(document.getElementById('myChart1'), {
                type: 'doughnut',
                data: {
                    labels: namesBancos,
                    datasets: [
                        {
                            data: values,
                            backgroundColor: colors
                        }
                    ]
                },
                options: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            let indice = tooltipItem.index
                            return (
                                data.labels[indice] +
                                ': ' +
                                data.datasets[0].data[indice] +
                                '%'
                            )
                        }
                    }
                }
            })

            let datasets = []
            for (let i = 0; i < resumen.value.length; i++) {
                if (resumen.value[i].contentInfo.monto_total !== null)
                    datasets.push({
                        label: resumen.value[i].name_bank,
                        backgroundColor: resumen.value[i].color,
                        borderColor: resumen.value[i].color,
                        data: JSON.parse(
                            resumen.value[i].contentInfo.meses_balance
                        )
                    })
            }
            new Chart(document.getElementById('myChart'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets
                },
                options: {
                    callbacks: {
                        label: (tooltipItem, data) => {
                            let indice = tooltipItem.index
                            return (
                                data.labels[indice] +
                                ': ' +
                                data.datasets[0].data[indice] +
                                '%'
                            )
                        }
                    }
                }
            })
        }
    }
}

const searchOptionGrafic = (item) => {
    setGrafic(resumen.value[0].contentInfo[item.id], item)
}

const setGrafic = (item, value) => {
    let montos = JSON.parse(item)
    document.getElementById('myChart').remove()
    let canvas = document.createElement('canvas')
    canvas.id = 'myChart'
    document.getElementById('contenedor').appendChild(canvas)
    if (resumen.value.length === 1) {
        let datasets = [
            {
                label: resumen.value[0].name_bank,
                backgroundColor: resumen.value[0].color,
                borderColor: resumen.value[0].color,
                data: montos
            }
        ]
        const myChart = new Chart(document.getElementById('myChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets
            },
            options: {
                callbacks: {
                    label: (tooltipItem, data) => {
                        let indice = tooltipItem.index
                        return (
                            data.labels[indice] +
                            ': ' +
                            data.datasets[0].data[indice] +
                            '%'
                        )
                    }
                }
            }
        })
    } else {
        let datasets = []
        for (let i = 0; i < resumen.value.length; i++) {
            if (resumen.value[i].contentInfo.monto_total !== null)
                datasets.push({
                    label: resumen.value[i].name_bank,
                    backgroundColor: resumen.value[i].color,
                    borderColor: resumen.value[i].color,
                    data: JSON.parse(resumen.value[i].contentInfo[value.id])
                })
        }
        const myChart = new Chart(document.getElementById('myChart'), {
            type: 'bar',
            data: {
                labels: labels,
                datasets
            },
            options: {
                callbacks: {
                    label: (tooltipItem, data) => {
                        let indice = tooltipItem.index
                        return (
                            data.labels[indice] +
                            ': ' +
                            data.datasets[0].data[indice] +
                            '%'
                        )
                    }
                }
            }
        })
    }
}

const searchState = (state) => {
    loadingGeneral.value = true
    year.value = state.id
    loadingGeneral.value = true
    getDataResumen()
}

const searchBank = (state) => {
    loadingGeneral.value = true
    bank.value = state.id
    loadingGeneral.value = true
    getDataResumen()
}

const searchMonth = (state, type) => {
    loadingGeneral.value = true
    if (type === 1) {
        monthI.value = state.id
    } else monthF.value = state.id
    getDataResumen()
}
</script>

<style lang="scss">
.ct-info {
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    .title {
        font-size: 18px;
        color: #a7a7a7;
    }
    .num {
        font-size: 20px;
        color: black;
        font-weight: bold;
    }
}
.cont-grafic {
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: rgba(0, 0, 0, 0.15) 1.95px 1.95px 2.6px;
    padding: 10px;
}
</style>
