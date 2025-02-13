<template>
    <UserPanel title="Historial de Ordenes">
        <div
            class="d-flex flex-column justify-center items-center ga-10 ga-md-5"
            :class="isMobile ? 'w-100' : 'w-75'"
        >
            <v-row>
                <v-col cols="12" lg="4" md="4">
                    <v-text-field
                        label="Buscar"
                        class="ip-form inpt-general"
                        v-model="monto"
                        @keyup="searchMonto()"
                    />
                </v-col>
                <v-col cols="12" lg="8" md="8">
                    <v-row>
                        <v-col cols="12" lg="4">
                            <v-select
                                v-model="stateOrder"
                                :items="states"
                                class="ip-form inpt-general"
                                label="Estados"
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
                        <v-col cols="6" lg="4" md="6">
                            <v-menu
                                v-model="openDateStart"
                                :close-on-content-click="false"
                            >
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-model="dateStartNew"
                                        class="ip-form inpt-general"
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
                                        selectDateStart(),
                                            (openDateStart = false)
                                    "
                                />
                            </v-menu>
                        </v-col>
                        <v-col cols="6" lg="4" md="6">
                            <v-menu
                                v-model="openDateEnd"
                                :close-on-content-click="false"
                            >
                                <template #activator="{ props }">
                                    <v-text-field
                                        v-model="dateEndNew"
                                        class="ip-form inpt-general"
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

            <v-row v-if="!loading && ordenes.length > 0">
                <v-col v-for="(item, i) in ordenes" cols="12" md="6" xl="4">
                    <UserOrderCard :key="i" :item="item" />
                </v-col>
            </v-row>

            <v-row v-else class="mb-6">
                <v-col cols="12" md="4" v-for="item in 3" :key="item">
                    <v-skeleton-loader
                        class="mx-auto border"
                        type="image, article"
                    />
                </v-col>
            </v-row>
            <ul class="pagination-styles" v-if="ordenes.length > 0 && !loading">
                <v-pagination
                    v-model="paginationActive"
                    rounded="circle"
                    :length="Number(pagination)"
                    :total-visible="7"
                />
            </ul>
            <div
                class="w-100 text-center"
                v-if="ordenes.length === 0 && !loading"
            >
                <div class="d-flex flex-column ga-5 green-text">
                    <span>No se encontraron resultados</span>
                    <router-link :to="`/userDashboard/nueva-orden`">
                        <v-btn
                            color="#70BA44"
                            class="px-8"
                            rounded="lg"
                            size="large"
                            text="Generar nueva orden"
                        />
                    </router-link>
                </div>
            </div>
        </div>
    </UserPanel>
</template>

<script setup>
import UserPanel from '../components/UserPanel.vue'
import UserOrderCard from '../components/UserOrderCard.vue'

import { useDisplay } from 'vuetify'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'
import { computed, onMounted, ref, watch } from 'vue'
import { configLocal } from '@/shared/scripts/requestConfig.js'

import { formatDate1, formatDate2 } from '@/shared/scripts/helpers/formats.js'

const authStore = userAuthStore()
const userStore = userUserStore()
const loading = ref(false)

const idUser = ref(0)
const ordenes = ref([])
const paginationActive = ref(1)
const pagination = ref(0)
const size = ref(3)
const page = ref(0)
const monto = ref('')
const stateOrder = ref(null)
const states = ref(configLocal.stateClient)
const dateStart = ref(null)
const dateEnd = ref(null)
const minDate = ref(null)

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

const openDateStart = ref(false)
const openDateEnd = ref(false)
const dateStartNew = computed(() =>
    dateStart.value !== null ? formatDate2(dateStart.value) : ''
)
const dateEndNew = computed(() =>
    dateStart.value !== null ? formatDate2(dateEnd.value) : ''
)

onMounted(async () => {
    idUser.value = authStore.user.id
    await listOrders()
})

const listOrders = async () => {
    loading.value = true

    const result = await userStore.listOrders({
        page: page.value,
        size: size.value,
        monto: monto.value,
        state: stateOrder.value,
        startDate:
            dateStart.value !== null ? formatDate1(dateStart.value) : undefined,
        endDate: dateEnd.value !== null ? formatDate1(dateEnd.value) : undefined
    })
    if (result.success) {
        ordenes.value = result.data.rows
        pagination.value = Math.ceil(result.data.count / size.value)
        loading.value = false
    }
}

watch(paginationActive, (newVal) => {
    page.value = newVal - 1
    listOrders()
})

const searchMonto = () => {
    listOrders()
}

const searchState = (state) => {
    stateOrder.value = state.id
    listOrders()
}

const selectDateStart = () => {
    minDate.value = new Date(dateStart.value)
    if (dateEnd.value === null) dateEnd.value = new Date(Date.now())
    listOrders()
}

const selectDateEnd = () => {
    listOrders()
}
</script>

<style lang="scss">
.ip-form.inpt-general {
    .v-btn--icon.v-btn--density-default {
        background: transparent !important;
    }
}
.pagination-styles {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    li.active {
        background: #00acac;
        border-radius: 50%;
        height: 30px;
        width: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
    }
}
.green-text {
    color: #00acac;
}
.blue-text {
    color: #146489;
}
.black-text {
    color: #000;
    font-size: 20px;
}
.grees-text {
    color: #929090;
    font-size: 17px;
    @media screen and (max-width: 600px) {
        font-size: 15px;
    }
}
.state-order {
    height: 31px;
    width: 100px;
    background: #dbd200;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    &.modal-order {
        width: 153px;
        height: 42px;
        font-size: 22px;
    }
}

.card-pagos {
    box-shadow: none !important;
    background: transparent !important;
}
</style>
