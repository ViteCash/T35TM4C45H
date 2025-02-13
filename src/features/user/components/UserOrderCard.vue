<template>
    <v-card class="rounded-xl pa-2 pa-md-1 pa-lg-2">
        <v-card-item>
            <v-card-title class="d-flex justify-space-between">
                <span class="text-lagoon-shade font-weight-medium">{{
                    item.codigo
                }}</span>
                <v-chip
                    :color="getTagState(item.state).color"
                    :text="getTagState(item.state).text"
                />
            </v-card-title>
            <v-card-subtitle>
                {{ formatDate2(item.create_date) }}
            </v-card-subtitle>
        </v-card-item>
        <v-card-text class="d-flex flex-column ga-2 text-subtitle-1">
            <div class="d-flex justify-space-between">
                <span class="font-weight-light">Monto devuelto</span>
                <span class="text-seafoam-light w-50 text-end">
                    {{ `S/ ${formatComas(item.monto_receive)}` }}</span
                >
            </div>
            <div class="d-flex justify-space-between">
                <span class="font-weight-light">Monto enviado</span>
                <span class="text-seafoam-light w-50 text-end">
                    {{ `S/ ${formatComas(item.monto_send)}` }}</span
                >
            </div>
            <div class="d-flex justify-space-between">
                <span class="font-weight-light">{{
                    `Comisión (${item.percentage}%)`
                }}</span>
                <div class="d-flex flex-column w-50 text-end">
                    <span
                        class="text-seafoam-light"
                        v-if="
                            item.promocodeHistory !== null ||
                            item.referredCodeHistory !== null
                        "
                    >
                        {{
                            `S/  ${formatComas(item.monto_comision_promocode)}`
                        }}
                    </span>
                    <span
                        class="text-seafoam-light"
                        :class="
                            item.promocodeHistory !== null ||
                            item.referredCodeHistory !== null
                                ? 'not-use-value'
                                : ''
                        "
                    >
                        {{ `S/  ${formatComas(item.monto_comision)}` }}</span
                    >
                </div>
            </div>
        </v-card-text>
        <v-card-actions>
            <v-btn
                color="#00ACAC"
                class="px-4"
                variant="tonal"
                rounded="lg"
                prepend-icon="mdi-eye"
                text="Ver detalle"
                @click="openDialog(item)"
            />
        </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" width="450">
        <v-card class="rounded-xl pa-3" closable>
            <v-card-title class="d-flex justify-space-between">
                <div>
                    <h6 class="text-h6 font-weight-regular">
                        Transacción: {{ orden.codigo }}
                    </h6>
                    <span class="grees-text">{{
                        formatDate2(orden.create_date)
                    }}</span>
                </div>
                <v-btn
                    color="red"
                    density="comfortable"
                    icon="mdi-close"
                    @click="dialog = false"
                />
            </v-card-title>
            <v-card-text class="d-flex flex-column ga-8">
                <div class="d-flex flex-column align-center ga-1">
                    <span class="text-h4">
                        {{ `S/ ${formatComas(orden.monto_receive)}` }}
                    </span>
                    <span class="grees-text">Monto de devolución</span>
                </div>
                <v-row>
                    <v-col
                        cols="6"
                        class="d-flex flex-column ga-4 align-center"
                    >
                        <div class="d-flex flex-column ga-1 align-center">
                            <span class="grees-text">Monto enviado</span>
                            <span class="text-h6">{{
                                `S/ ${formatComas(orden.monto_send)}`
                            }}</span>
                        </div>
                        <div class="d-flex flex-column ga-1 align-center">
                            <span class="grees-text">Comisión</span>
                            <div class="text-h6">
                                <div>
                                    <div
                                        v-if="
                                            orden.promocodeHistory !== null ||
                                            orden.referredCodeHistory !== null
                                        "
                                        class="mr-2"
                                    >
                                        {{
                                            `S/ ${orden.monto_comision_promocode}`
                                        }}
                                    </div>
                                    <div
                                        :class="
                                            orden.promocodeHistory !== null ||
                                            orden.referredCodeHistory !== null
                                                ? 'not-use-value'
                                                : ''
                                        "
                                    >
                                        {{ `S/ ${orden.monto_comision}` }}
                                    </div>
                                </div>
                                <div
                                    class="detail-promocode"
                                    v-if="
                                        orden.promocodeHistory !== null ||
                                        orden.referredCodeHistory !== null
                                    "
                                >
                                    {{
                                        `(${
                                            orden.promocodeHistory !== null
                                                ? orden.promocodeHistory
                                                      ?.promocode.name
                                                : orden.referredCodeHistory
                                                      ?.referredCode.name
                                        })`
                                    }}
                                </div>
                            </div>
                        </div>
                        <div class="d-flex flex-column ga-1 align-center">
                            <span class="grees-text">N° de cuenta</span>
                            <span class="text-h6">{{
                                orden.number_account
                            }}</span>
                        </div>
                    </v-col>
                    <v-col
                        cols="6"
                        class="d-flex flex-column ga-4 align-center"
                    >
                        <div class="d-flex flex-column ga-1 align-center">
                            <span class="grees-text">Banco origen</span>
                            <span
                                ><img
                                    width="100"
                                    :src="getImage(orden.bank.icon)"
                            /></span>
                        </div>
                        <div class="d-flex flex-column ga-1 align-center">
                            <span class="grees-text">Banco destino</span>
                            <span
                                ><img
                                    width="100"
                                    :src="getImage(orden.userBank.bank.icon)"
                            /></span>
                        </div>
                        <div class="d-flex flex-column ga-1 align-center">
                            <span class="grees-text">Cod. Transferencia</span>
                            <span class="text-h6">{{
                                orden.number_operation
                            }}</span>
                        </div>
                    </v-col>
                </v-row>
                <div class="d-flex justify-center">
                    <v-chip
                        size="x-large"
                        :color="getTagState(orden.state).color"
                        :text="getTagState(orden.state).text"
                    />
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { formatComas, formatDate2 } from '@/shared/scripts/helpers/formats.js'
import { ref } from 'vue'

const orden = ref({})
const dialog = ref(false)

defineProps({ item: Object })

const getImage = (img) => {
    return new URL(`../../../assets/svg/banks/${img}-logo.svg`, import.meta.url)
        .href
}

const openDialog = (data) => {
    orden.value = data
    dialog.value = true
}

const getTagState = (state) => {
    const states = {
        1: { text: 'Pendiente', color: 'orange' },
        2: { text: 'Cancelado', color: 'red' },
        3: { text: 'Pendiente', color: 'orange' },
        4: { text: 'Pendiente', color: 'orange' },
        5: { text: 'Activo', color: 'blue' }
    }

    return states[state] || { text: 'Pagado', color: 'green' }
}
</script>
