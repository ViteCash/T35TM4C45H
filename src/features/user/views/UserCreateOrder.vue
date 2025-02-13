<template>
    <UserPanel title="Generar nueva orden">
        <div class="content-generate-orden" v-if="!finalizar">
            <v-card class="card-content" max-width="500" width="500">
                <v-form
                    ref="formRegister"
                    class="d-flex flex-column align-center justify-center ga-8"
                >
                    <v-row class="mt-2">
                        <v-col cols="12" md="6" lg="6" class="py-0">
                            <div class="w-100 content-input-changes">
                                <v-text-field
                                    v-model="form.send"
                                    prefix="S/"
                                    label="Envias"
                                    class="ip-form inpt-general"
                                    @keyup="calculate(1)"
                                    @blur="addComaNumber(1)"
                                    :rules="numberRulesSend"
                                />
                            </div>
                        </v-col>
                        <v-col cols="12" md="6" lg="6" class="py-0">
                            <div class="w-100 content-input-changes">
                                <v-text-field
                                    v-model="form.receive"
                                    readonly
                                    prefix="S/"
                                    label="Recibes"
                                    class="ip-form inpt-general"
                                    @keyup="calculate(2)"
                                    @blur="addComaNumber(2)"
                                />
                            </div>
                        </v-col>
                        <v-col cols="12" class="py-0">
                            <div class="w-100 mb-2">
                                <div class="alert-content-comision">
                                    <v-row>
                                        <v-col cols="8">
                                            <div class="color-green comision">
                                                Comisión
                                                <span
                                                    v-if="
                                                        Number(
                                                            deleteComaNumber(
                                                                form.send
                                                            )
                                                        ) > 1000
                                                    "
                                                    >({{
                                                        `${Number(
                                                            authStore.user
                                                                .comision
                                                        )}%`
                                                    }})</span
                                                >
                                            </div>
                                        </v-col>
                                        <v-col
                                            cols="4"
                                            class="d-flex justify-end align-center"
                                        >
                                            <div class="text-center">
                                                <div
                                                    v-if="
                                                        dataPromocode !==
                                                            null &&
                                                        Number(
                                                            deleteComaNumber(
                                                                form.send
                                                            )
                                                        ) >= 1000
                                                    "
                                                    class="color-blue monto"
                                                >
                                                    S/
                                                    {{
                                                        form.comision_promocode
                                                    }}
                                                </div>
                                                <div
                                                    :class="
                                                        dataPromocode !==
                                                            null &&
                                                        Number(
                                                            deleteComaNumber(
                                                                form.send
                                                            )
                                                        ) >= 1000
                                                            ? 'not-use-value'
                                                            : ''
                                                    "
                                                >
                                                    S/ {{ form.comision }}
                                                </div>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" class="py-0">
                            <div class="w-100">
                                <v-select
                                    v-model="form.bank"
                                    :items="banks"
                                    label="Banco que realizas la operación"
                                    class="ip-form inpt-general pt-2"
                                    :item-title="(item) => item.name_bank"
                                    item-value="id"
                                    :rules="bankRules"
                                >
                                    <template #item="{ item, props }">
                                        <v-list-item
                                            @click="
                                                getFilterAccountUser(item.raw)
                                            "
                                            v-bind="props"
                                        >
                                            <template #title>
                                                <div
                                                    class="d-flex justify-star align-center"
                                                >
                                                    <img
                                                        width="25"
                                                        height="25"
                                                        class="mr-3"
                                                        :src="
                                                            getImage(
                                                                item.raw.icon
                                                            )
                                                        "
                                                    />
                                                    {{ item.raw.name_bank }}
                                                </div>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-select>
                                <v-alert
                                    v-if="newAccounts.length === 0"
                                    density="compact"
                                    variant="tonal"
                                    border="top"
                                    type="warning"
                                    text="Aún no ha vinculado una cuenta de este banco, para comenzar dele click a 'Agregar nueva cuenta'"
                                />
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div
                                v-if="newAccounts?.length === 0"
                                class="d-flex w-100 justify-center align-center py-5"
                            >
                                <router-link to="/userDashboard/cuentas">
                                    <v-btn
                                        class="text-none text-subtitle-1"
                                        color="#fb8c00"
                                        prepend-icon="mdi-plus"
                                        text="Agregar nueva cuenta"
                                        rounded="lg"
                                    />
                                </router-link>
                            </div>
                            <div v-else class="w-100">
                                <label for="" class="color-green"></label>
                                <v-select
                                    v-if="form.bank"
                                    v-model="form.bankUser"
                                    :items="newAccounts"
                                    class="ip-form inpt-general"
                                    label="Seleccione su número de cuenta"
                                    :item-title="
                                        (item) =>
                                            item.alias_account +
                                            ' - ' +
                                            item.number_account
                                    "
                                    item-value="id"
                                    :rules="bankUserRules"
                                >
                                    <template #item="{ item, props }">
                                        <v-list-item v-bind="props">
                                            <template #title>
                                                <div
                                                    class="d-flex justify-star align-center"
                                                >
                                                    <img
                                                        width="25"
                                                        height="25"
                                                        class="mr-3"
                                                        :src="
                                                            getImage(
                                                                item.raw.bank
                                                                    ?.icon
                                                            )
                                                        "
                                                    />
                                                    {{
                                                        `${item.raw.alias_account} - ${item.raw.number_account}`
                                                    }}
                                                </div>
                                            </template>
                                        </v-list-item>
                                    </template>
                                </v-select>
                            </div>
                        </v-col>
                        <v-col cols="12" md="12" lg="12" class="py-0">
                            <div class="w-100 content-input-changes ipt-code">
                                <form @submit.prevent="aplicatePromoCode()">
                                    <v-text-field
                                        v-if="!disabledReferredCode"
                                        v-model="promocode"
                                        label="Ingresar Codigo de descuento"
                                        class="ip-form inpt-general"
                                    />
                                    <div
                                        v-else
                                        class="w-100 content-input-changes"
                                    >
                                        <div
                                            class="ip-form-detail-data inpt-referencial mb-4"
                                        >
                                            <span
                                                >Codigo Referencial por primera
                                                orden</span
                                            >
                                            {{ promocode }}
                                        </div>
                                    </div>
                                    <v-btn
                                        v-if="!disabledReferredCode"
                                        :loading="loadingCode"
                                        class="btn-aplicate-code"
                                        type="submit"
                                        size="large"
                                        text="Aplicar"
                                    />
                                </form>
                                <div
                                    v-if="
                                        dataPromocode && !disabledReferredCode
                                    "
                                    class="d-flex justify-center align-center mb-2"
                                >
                                    <div class="content-code">
                                        {{ dataPromocode?.name }}
                                        <v-icon
                                            class="cursor-pointer"
                                            @click="deletePromoCode()"
                                            color="red"
                                            >mdi-plus-circle</v-icon
                                        >
                                    </div>
                                </div>
                                <div class="info-text">
                                    <v-icon>mdi-information</v-icon>Los codigos
                                    promocionales aplican a montos mayores a S/.
                                    1,000
                                </div>
                            </div>
                        </v-col>
                    </v-row>
                    <div
                        class="w-100 d-flex ga-5 flex-column justify-center align-center"
                    >
                        <v-btn
                            :disabled="newAccounts.length === 0"
                            color="#70BA44"
                            class="px-8"
                            rounded="lg"
                            size="large"
                            :loading="loading"
                            @click="sendRegister"
                            text="Generar"
                        />
                    </div>
                </v-form>
            </v-card>
        </div>
        <div class="content-generate-orden-finaly" v-else>
            <div class="w-10 d-flex justify-center align-center">
                <div class="content-send">Envias: {{ `S/ ${form.send}` }}</div>
            </div>
            <div>
                <v-row>
                    <v-col cols="12" lg="6">
                        <div class="list-detail-bank">
                            <h2 class="mb-5">Sigue los siguientes pasos:</h2>
                            <div v-html="detailBank"></div>
                        </div>
                    </v-col>
                    <v-col
                        cols="12"
                        lg="6"
                        class="d-flex justify-center align-center"
                    >
                        <div class="content-items-file">
                            <div class="title-file">
                                Si ya realizaste el pago
                            </div>
                            <div
                                class="content-info-file"
                                :class="errorImgs ? 'err-img' : ''"
                                @click="openFile()"
                            >
                                <div
                                    class="text-center"
                                    :class="loadinfImage ? 'loading-image' : ''"
                                >
                                    <p v-if="loadinfImage">Adjuntando..</p>
                                    <p v-else-if="loadinfImageConfirm">Listo</p>
                                    <p v-else>
                                        <b>Adjunta aqui</b> tu comprobante de
                                        pago
                                    </p>
                                    <img
                                        width="86"
                                        src="@/assets/svg/icons/file2.svg"
                                        alt="cuadors"
                                        v-if="
                                            !loadinfImage &&
                                            !loadinfImageConfirm
                                        "
                                    />
                                    <img
                                        width="86"
                                        src="@/assets/svg/icons/check.svg"
                                        alt="cuadors"
                                        v-if="loadinfImageConfirm"
                                    />
                                    <input
                                        type="file"
                                        @change="sendFile"
                                        style="display: none"
                                        name="file"
                                        id="upload1"
                                        accept="image/png, image/jpeg"
                                    />
                                    <v-progress-linear
                                        v-if="loadinfImage"
                                        color="#00ACAC"
                                        indeterminate
                                        rounded
                                        height="6"
                                    />
                                </div>
                            </div>
                            <div
                                class="w-100 d-flex justify-center align-center"
                            >
                                <v-btn
                                    :disabled="!loadinfImageConfirm"
                                    color="#70BA44"
                                    class="mt-5"
                                    rounded="lg"
                                    size="large"
                                    :loading="loading"
                                    @click="finishOrder()"
                                    text="Finalizar Orden"
                                />
                            </div>
                        </div>
                    </v-col>
                </v-row>
            </div>
        </div>
        <v-snackbar
            v-model="snackbar"
            timeout="2000"
            color="red"
            vertical
            class="text-center"
        >
            {{ textPromocode }}
        </v-snackbar>
    </UserPanel>
</template>

<script setup>
import { userAuthStore } from '@/stores/auth'
import { userUserStore } from '@/stores/user'
import { onMounted, reactive, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { formatComas } from '@/shared/scripts/helpers/formats.js'
import Compressor from 'compressorjs'
import UserPanel from '../components/UserPanel.vue'

const authStore = userAuthStore()
const userStore = userUserStore()
const banks = ref([])
const accounts = ref([])
const newAccounts = ref([])
const formRegister = ref(null)
const form = reactive({
    send: '',
    bank: null,
    bankUser: null,
    comision: '',
    comision_promocode: '',
    receive: ''
})
const finalizar = ref(false)
const codigo = ref(null)
const fileSend = ref(null)
const loadinfImage = ref(false)
const loadinfImageConfirm = ref(false)
const loading = ref(false)
const errorImgs = ref(false)
const detailBank = ref('')
const router = useRouter()
const promocode = ref('')
const dataPromocode = ref(null)
const loadingCode = ref(false)
const textPromocode = ref('')
const snackbar = ref(false)
const disabledReferredCode = ref(false)
const typeCode = ref(null)
const typeCalculate = ref(null)

onMounted(() => {
    banks.value = authStore.banks
    accounts.value = authStore.user.userBanks
    newAccounts.value = authStore.user.userBanks
    validateReferredCodeExists()
})

watchEffect(() => {
    promocode.value = promocode.value.toUpperCase()
})

const validateReferredCodeExists = () => {
    if (
        authStore.user.useReferredCode &&
        (authStore.user.useReferredCode.order?.state === 0 ||
            authStore.user.useReferredCode.order === null)
    ) {
        promocode.value = authStore.user.useReferredCode.referredCode.name
        disabledReferredCode.value = true
        dataPromocode.value = {
            ...authStore.user.useReferredCode.referredCode,
            id: authStore.user.useReferredCode.id
        }
        typeCode.value = 1
    }
}

const calculate = (type) => {
    typeCalculate.value = type
    let comisionUser = Number(authStore.user.comision)
    if (typeCalculate.value === 1) {
        let banco = null
        if (form.bank) {
            banco = banks.value.find((item) => item.id === form.bank).max_monto
        }
        if (
            parseFloat(deleteComaNumber(form.send)) >= 100 &&
            parseFloat(deleteComaNumber(form.send)) <= 999.99 &&
            form.send !== 0
        ) {
            form.send =
                (banco !== null) & (Number(form.send) > parseFloat(banco))
                    ? parseFloat(banco)
                    : form.send
            form.receive = parseFloat(deleteComaNumber(form.send)) - 10.0
            form.comision = '10'
            form.comision_promocode = ''
            dataPromocode.value = null
            typeCode.value = null
        } else if (
            parseFloat(deleteComaNumber(form.send)) >= 1000 &&
            form.send !== 0
        ) {
            validateReferredCodeExists()
            form.send =
                (banco !== null) & (Number(form.send) > parseFloat(banco))
                    ? parseFloat(banco)
                    : form.send
            let comision =
                (deleteComaNumber(form.send) * parseFloat(comisionUser)) / 100
            let comissionFinal = isNaN(comision)
                ? ''
                : dataPromocode.value
                ? deleteComaNumber(
                      comision.toFixed(2) -
                          (comision *
                              Number(dataPromocode.value.percent_discount)) /
                              100
                  )
                : deleteComaNumber(comision.toFixed(2))
            form.comision = Number(comision).toFixed(2)
            form.comision_promocode = Number(comissionFinal).toFixed(2)
            let calculate =
                deleteComaNumber(form.send) - Number(comissionFinal).toFixed(2)
            form.receive = isNaN(calculate)
                ? ''
                : deleteComaNumber(calculate.toFixed(2))
            form.send = deleteComaNumber(
                form.send.toString().replace(/^0*/, '')
            )
        } else {
            form.send = deleteComaNumber(
                form.send.toString().replace(/^0*/, '')
            )
            form.comision = ''
            form.receive = ''
        }
    } else if (typeCalculate.value === 2) {
        let banco = null
        if (form.bank) {
            banco = banks.value.find((item) => item.id === form.bank).max_monto
        }
        validateReferredCodeExists()
        if (
            parseFloat(deleteComaNumber(form.receive)) >= 100 &&
            parseFloat(deleteComaNumber(form.receive)) <= 999.99 &&
            form.receive !== 0
        ) {
            let calculate =
                (deleteComaNumber(form.receive) * 100) /
                (
                    100 -
                    (Number(comisionUser) < 1
                        ? parseFloat(Number(comisionUser)) * 100
                        : Number(comisionUser))
                ).toString()
            form.send =
                (banco !== null) & (calculate.toFixed(2) > parseFloat(banco))
                    ? parseFloat(banco)
                    : parseFloat(deleteComaNumber(form.receive)) + 10
            form.receive =
                (banco !== null) & (calculate.toFixed(2) > parseFloat(banco))
                    ? Number(form.send) -
                      Number(
                          (deleteComaNumber(form.send) *
                              parseFloat(comisionUser)) /
                              100
                      ).toFixed(2)
                    : form.receive
            form.comision = '10'
        } else if (
            parseFloat(deleteComaNumber(form.receive)) >= 1000 &&
            form.send !== 0
        ) {
            let calculate =
                (deleteComaNumber(form.receive) * 100) /
                (
                    100 -
                    (Number(comisionUser) < 1
                        ? parseFloat(Number(comisionUser)) * 100
                        : Number(comisionUser))
                ).toString()
            form.send =
                (banco !== null) & (calculate.toFixed(2) > parseFloat(banco))
                    ? Number(parseFloat(banco))
                    : Number(deleteComaNumber(calculate.toFixed(2))).toFixed(2)
            form.comision = Number(
                (deleteComaNumber(form.send) * parseFloat(comisionUser)) / 100
            ).toFixed(2)
            form.receive =
                (banco !== null) & (calculate.toFixed(2) > parseFloat(banco))
                    ? Number(form.send) - form.comision
                    : deleteComaNumber(
                          form.receive.toString().replace(/^0*/, '')
                      )
            if (dataPromocode.value) {
                form.send = Number(
                    Number(form.send) +
                        Number(
                            (
                                form.comision *
                                (Number(dataPromocode.value.percent_discount) /
                                    100)
                            ).toFixed(2)
                        )
                ).toFixed(2)
                form.comision_promocode = Number(
                    Number(form.comision) -
                        Number(
                            (
                                form.comision *
                                (Number(dataPromocode.value.percent_discount) /
                                    100)
                            ).toFixed(2)
                        )
                ).toFixed(2)
            }
        } else {
            form.receive = deleteComaNumber(
                form.receive.toString().replace(/^0*/, '')
            )
            form.comision = ''
            form.send = ''
        }
    }
    loadingCode.value = false
}

const sendRegister = async () => {
    try {
        let comisionUser = authStore.user.comision
        const valid = await formRegister.value.validate()
        if (valid.valid) {
            loading.value = true
            let dataSend = {
                bank: form.bank,
                bankUser: form.bankUser,
                comision: deleteComaNumber(form.comision),
                comision_promocode: deleteComaNumber(form.comision_promocode),
                receive: deleteComaNumber(form.receive),
                send: deleteComaNumber(form.send),
                promocode: dataPromocode.value ? dataPromocode.value.id : null,
                typePromocode: typeCode.value,
                comision_percent: deleteComaNumber(comisionUser)
            }
            const result = await userStore.newOrder(dataSend)
            if (result.success) {
                codigo.value = result.data[0].codigo
                loading.value = false
                finalizar.value = true
                detailBank.value = banks.value.find(
                    (lt) => lt.id === form.bank
                ).info
            }
        }
    } catch (error) {
        loading.value = false
    }
}

const getImage = (img) => {
    return new URL(`../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}

const numberRulesSend = [
    (v) => !!v || 'Monto invalido',
    (v) => /^\d{1,5}(\.\d{1,2})?$/.test(deleteComaNumber(v)) || 'Solo números',
    (v) =>
        (deleteComaNumber(v) >= 110 && deleteComaNumber(v) <= 50000) ||
        'Monto minimo de envio S/.110, maximo S/.50,000 y solo 2 decimales',
    (v) => (v.length > 10) | 'Limite superado'
]

const numberRules = [
    (v) => !!v || 'Monto invalido',
    (v) => /^\d{1,5}(\.\d{1,2})?$/.test(deleteComaNumber(v)) || 'Solo números',
    (v) =>
        (deleteComaNumber(v) >= 100 && deleteComaNumber(v) <= 50000) ||
        'Monto minimo S/.100, maximo S/.50,000 y solo 2 decimales',
    (v) => (v.length > 10) | 'Limite superado'
]

const deleteComaNumber = (value) => {
    if (typeof value === 'string') {
        return value.replace(/,/g, '')
    } else return value
}

const addComaNumber = (type) => {
    if (
        parseFloat(deleteComaNumber(form.send)) >= 100 &&
        parseFloat(deleteComaNumber(form.send)) <= 109.99
    ) {
        // solo para el caso de que los numero sean de rango 100 al 109.99
        form.send = 110
        calculate(1)
    }
    form.send = formatComas(form.send)
    form.receive = formatComas(form.receive)
}

const bankRules = [(v) => !!v || 'Campo obligatorio']

const bankUserRules = [(v) => !!v || 'Campo obligatorio']

const openFile = () => {
    document.getElementById('upload1').click()
}

const sendFile = async (event) => {
    const file = event.target.files
    let nameFile = file[0]?.name.split('.')
    new Compressor(file[0], {
        quality: 0.6,
        success(result) {
            let file = new File(
                [result],
                `VAUCHER-${codigo.value}.${nameFile[nameFile.length - 1]}`,
                { lastModified: Date.now() }
            )
            fileSend.value = file
            errorImgs.value = false
            loadinfImage.value = true
            const formData = new FormData()
            formData.append('file', fileSend.value)
            serviceSend(formData)
        }
    })
}

const serviceSend = async (formData) => {
    const result = await userStore.sendImageOrder(formData, codigo.value)
    if (result.success) {
        setTimeout(() => {
            loadinfImage.value = false
            loadinfImageConfirm.value = true
        }, 2000)
    }
}

const finishOrder = async () => {
    if (fileSend.value === null) {
        errorImgs.value = true
    }
    if (!errorImgs.value) {
        loading.value = true
        const result = await userStore.finalyOrder(codigo.value)
        if (result.success) {
            if (typeCode.value === 1) {
                authStore.setReferralCode(1)
            }
            typeCode.value = null
            let date = new Date()
            let iconBank = banks.value.find((item) => item.id === form.bank)
            let iconBankSend = accounts.value.find(
                (item) => item.id === form.bankUser
            )
            loading.value = false
            finalizar.value = false
            Object.assign(form, {
                send: '',
                bank: null,
                bankUser: null,
                comision: '',
                receive: ''
            })
            loadinfImage.value = false
            loadinfImageConfirm.value = true
            router.push('/userDashboard/ordenes')
        }
    }
}

const getFilterAccountUser = async (data) => {
    if (data.max_monto) {
        form.send =
            Number(form.send) > parseFloat(data.max_monto)
                ? parseInt(data.max_monto)
                : form.send
        calculate(1)
    }
    newAccounts.value = []
    let newAccountsValue = []
    newAccountsValue = accounts.value.filter((dl) => dl.mrc_bank_id === data.id)
    form.bankUser = null
    if (newAccountsValue.length > 0) {
        newAccounts.value = newAccountsValue
    } else newAccounts.value = []
}

const aplicatePromoCode = async () => {
    loadingCode.value = true
    let data = {
        promocode: promocode.value
    }
    const result = await userStore.aplicatePromoCode(data)
    if (result.success) {
        if (result.data.promocode === null) {
            textPromocode.value = result.data.state
            snackbar.value = true
            loadingCode.value = false
        } else {
            dataPromocode.value = result.data.promocode
            promocode.value = ''
            typeCode.value = 2
            calculate(typeCalculate.value)
        }
    }
}

const deletePromoCode = async () => {
    dataPromocode.value = null
    typeCode.value = null
    calculate(typeCalculate.value)
}
</script>

<style lang="scss">
.content-generate-orden {
    .v-card {
        box-shadow: none;
        background: transparent;
        .content-input-changes {
            position: relative;
            .icon-revert {
                position: absolute;
                transform: translateX(-50%);
                top: 40px;
                right: 0;
                @media screen and (max-width: 1024px) {
                    top: 30px;
                }
            }
        }
        .v-text-field .v-field {
            font-size: 20px;
        }
        .v-field__input,
        .v-text-field__prefix {
            padding-top: 12px;
            color: #0081a2;
        }
        .alert-content-comision {
            background: rgba(155, 210, 201, 0.2);
            padding: 16px 25px;
            border-radius: 18px;
            font-size: 18px;
        }
    }
}
.content-generate-orden-finaly {
    @media screen and (max-width: 1024px) {
        margin-bottom: 100px;
    }
    .content-send {
        min-width: 310px;
        height: 45px;
        color: #fff;
        background: #146489;
        border-radius: 18px;
        font-size: 28px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: 30px;
        @media screen and (max-width: 1024px) {
            margin-bottom: 25px;
        }
    }

    .list-detail-bank {
        h2 {
            color: #00acac;
            font-size: 28px;
            font-weight: 100;
        }

        ul {
            list-style: numeric;
            margin-left: 25px;
            li {
                color: #0085ae;
                font-size: 18px;
                margin-bottom: 10px;
            }
        }
    }
    .title-file {
        color: #0085ae;
        font-size: 20px;
        text-align: center;
        margin-bottom: 30px;
        @media screen and (max-width: 600px) {
            color: #00acac;
        }
    }
    .content-info-file {
        background: #cdf5ff;
        width: 250px;
        height: 250px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 18px;
        padding: 10px;
        cursor: pointer;
        @media screen and (max-width: 1024px) {
            height: auto;
            width: 100%;
            padding: 10px 30px;
            div {
                display: flex;
                justify-content: space-between;
                align-items: center;
                gap: 60px;
                &.loading-image {
                    display: block;
                }
                p {
                    font-size: 15px;
                    margin-bottom: 0;
                }
                img {
                    width: 35px;
                }
            }
        }
        &.err-img {
            border: 2px solid red;
            p {
                color: red;
            }
        }
        p {
            font-size: 18px;
            color: #146489;
            line-height: 25px;
            margin-bottom: 20px;
        }
    }
}

.content-items-file {
    display: grid;
    justify-items: center;
}

.btn-add-new-bank {
    background: #ff8c00;
    color: #fff;
    padding: 10px 25px;
    border-radius: 10px;
    cursor: pointer;
    text-decoration: unset;
}

.ipt-code {
    position: relative;
    .btn-aplicate-code {
        position: absolute;
        right: 0;
        top: 0;
        height: 54px;
        border-radius: 0px 10px 10px 0px;
        background: #00acac;
        border: unset;
        color: white;
        @media screen and (max-width: 1024px) {
            height: 50px !important;
        }
    }
}

.content-code {
    background: rgba(155, 210, 201, 0.2);
    color: #00acac;
    text-align: center;
    padding: 8px 20px;
    font-size: 18px;
    border-radius: 20px;
    border-radius: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    i {
        transform: rotate(45deg);
    }
}
.v-snackbar__content {
    margin-right: auto !important;
    text-align: center !important;
    width: 100% !important;
    font-size: 20px !important;
}
</style>
