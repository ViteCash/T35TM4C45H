<template>
    <UserPanel title="Cuentas bancarias">
        <div v-if="!firstContent" :class="isMobile ? 'w-100' : 'w-75'">
            <v-card class="card-pagos">
                <v-row class="pa-2">
                    <v-col
                        cols="12"
                        lg="6"
                        v-for="(bank, i) in banksUser"
                        :key="i"
                    >
                        <div class="content">
                            <label class="content-title">{{
                                bank.alias_account
                            }}</label>
                            <div class="content-info">
                                <v-row>
                                    <v-col cols="12" lg="7">
                                        <div class="content-info-first">
                                            <img
                                                width="25"
                                                height="25"
                                                class="mr-3"
                                                :src="getImage(bank.bank_icon)"
                                            />
                                            <p>{{ bank.bank.name_bank }}</p>
                                        </div>
                                    </v-col>
                                    <v-col cols="12" lg="5">
                                        <div
                                            class="content-info-first-account d-flex align-center"
                                        >
                                            <p>
                                                {{
                                                    `${bank.money} - ${bank.type_account}`
                                                }}
                                            </p>
                                        </div>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="6">
                                        <div>{{ bank.number_account }}</div>
                                        <div
                                            v-if="bank.account_type_city === 1"
                                        >
                                            {{ '(Provincia)' }}
                                        </div>
                                    </v-col>
                                    <v-col cols="6">
                                        <div
                                            class="d-flex justify-end align-center"
                                        >
                                            <v-icon @click="setData(bank)"
                                                >mdi-pencil-box-outline</v-icon
                                            >
                                            <v-icon
                                                @click="openDeleteData(bank)"
                                                v-if="banksUser.length > 1"
                                                >mdi-delete</v-icon
                                            >
                                        </div>
                                    </v-col>
                                </v-row>
                            </div>
                        </div>
                    </v-col>
                    <v-col cols="12" lg="6" md="6">
                        <label style="color: transparent" class="content-title"
                            >Agregar nueva cuenta</label
                        >
                        <div
                            v-if="!addBank"
                            class="content-info content-info-add"
                            @click="addNewBank()"
                        >
                            <div>Agregar nueva cuenta</div>
                            <v-icon>mdi-plus-circle-outline</v-icon>
                        </div>
                    </v-col>
                </v-row>
                <v-row class="pa-2" v-if="banksUser.length < 10">
                    <v-col cols="12" lg="6">
                        <div
                            v-if="addBank"
                            class="content-info content-info-form"
                        >
                            <v-form ref="formBank">
                                <div class="section-banks">
                                    <v-row>
                                        <v-col cols="12" class="pa-0">
                                            <div class="w-100">
                                                <div>
                                                    <v-select
                                                        label="Seleccione una entidad financiera"
                                                        v-model="
                                                            form1.mrc_bank_id
                                                        "
                                                        :items="banks"
                                                        class="ip-form inpt-general mb-2"
                                                        item-title="name_bank"
                                                        :rules="bankRules"
                                                        item-value="id"
                                                    >
                                                        <template
                                                            #item="{
                                                                item,
                                                                props
                                                            }"
                                                        >
                                                            <v-list-item
                                                                v-bind="props"
                                                            >
                                                                <template
                                                                    #title
                                                                >
                                                                    <div
                                                                        @click="
                                                                            getTypesAccount(
                                                                                item.raw
                                                                            )
                                                                        "
                                                                        class="d-flex justify-star align-center"
                                                                    >
                                                                        <img
                                                                            width="25"
                                                                            height="25"
                                                                            class="mr-3"
                                                                            :src="
                                                                                getImage(
                                                                                    item
                                                                                        .raw
                                                                                        .icon
                                                                                )
                                                                            "
                                                                        />
                                                                        {{
                                                                            item
                                                                                .raw
                                                                                .name_bank
                                                                        }}
                                                                    </div>
                                                                </template>
                                                            </v-list-item>
                                                        </template>
                                                    </v-select>
                                                </div>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" class="pa-0">
                                            <div class="w-100">
                                                <div>
                                                    <v-select
                                                        label="Selecciona tipo de cuenta"
                                                        v-model="
                                                            form1.mrc_type_account_id
                                                        "
                                                        :items="typeAccounts"
                                                        class="ip-form inpt-general mb-2"
                                                        item-title="account_name"
                                                        :rules="
                                                            typeAccountRules
                                                        "
                                                        item-value="id"
                                                    >
                                                        <template
                                                            #item="{
                                                                item,
                                                                props
                                                            }"
                                                        >
                                                            <v-list-item
                                                                v-bind="props"
                                                            >
                                                                <template
                                                                    #title
                                                                >
                                                                    <div
                                                                        @click="
                                                                            searchLimit(
                                                                                item.raw
                                                                            )
                                                                        "
                                                                        class="d-flex justify-star align-center"
                                                                    >
                                                                        {{
                                                                            item
                                                                                .raw
                                                                                .account_name
                                                                        }}
                                                                    </div>
                                                                </template>
                                                            </v-list-item>
                                                        </template>
                                                    </v-select>
                                                </div>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" class="pa-0">
                                            <div class="w-100">
                                                <div>
                                                    <v-text-field
                                                        label="Ingrese número de cuenta"
                                                        v-model="
                                                            form1.number_account
                                                        "
                                                        class="ip-form inpt-general mb-2"
                                                        :rules="numberRules"
                                                    />
                                                </div>
                                            </div>
                                        </v-col>
                                        <v-col cols="12" class="pa-0">
                                            <div class="w-100">
                                                <div>
                                                    <v-text-field
                                                        label="Agrégale un alias a tu cuenta"
                                                        v-model="
                                                            form1.alias_account
                                                        "
                                                        class="ip-form inpt-general mb-2"
                                                        :rules="
                                                            aliasAccountRules
                                                        "
                                                    />
                                                </div>
                                            </div>
                                        </v-col>
                                    </v-row>
                                    <div class="section-type-account">
                                        <div
                                            @click="
                                                ;(money = 1),
                                                    (errorMoney = true)
                                            "
                                            :class="
                                                money === 1 && errorMoney
                                                    ? 'type-account active'
                                                    : !errorMoney
                                                    ? 'type-account error'
                                                    : 'type-account'
                                            "
                                        >
                                            <v-icon
                                                size="17"
                                                class="mr-1"
                                                v-if="money === 1"
                                                >mdi-check-circle-outline</v-icon
                                            >Soles
                                        </div>
                                        <div
                                            @click="
                                                ;(money = 2),
                                                    (errorMoney = true)
                                            "
                                            :class="
                                                money === 2 && errorMoney
                                                    ? 'type-account active'
                                                    : !errorMoney
                                                    ? 'type-account error'
                                                    : 'type-account'
                                            "
                                        >
                                            <v-icon
                                                size="17"
                                                class="mr-1"
                                                v-if="money === 2"
                                                >mdi-check-circle-outline</v-icon
                                            >Dolares
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="d-flex justify-center align-center mt-7"
                                >
                                    <div>
                                        <v-checkbox
                                            v-model="accountTypeCity"
                                            color="#61C028"
                                            class="rd-pex"
                                            hide-details
                                        >
                                            <template v-slot:label>
                                                <div>
                                                    <span
                                                        class="dl-underline"
                                                        href=""
                                                        :style="`${
                                                            headline !== null &&
                                                            !headline
                                                                ? 'color:red'
                                                                : 'color: #0085AE'
                                                        }`"
                                                        >La cuenta ingresada es
                                                        de provincia</span
                                                    >
                                                </div>
                                            </template>
                                        </v-checkbox>
                                    </div>
                                </div>
                                <div
                                    class="d-flex justify-center align-center mb-2"
                                >
                                    <div>
                                        <v-checkbox
                                            v-model="headline"
                                            color="#61C028"
                                            :rules="headlineRules"
                                            :class="`${
                                                headline !== null && !headline
                                                    ? 'rd-pex error'
                                                    : 'rd-pex'
                                            }`"
                                            hide-details
                                        >
                                            <template v-slot:label>
                                                <div>
                                                    <span
                                                        class="dl-underline"
                                                        href=""
                                                        :style="`${
                                                            headline !== null &&
                                                            !headline
                                                                ? 'color:red'
                                                                : 'color: #0085AE'
                                                        }`"
                                                        >Declaro que soy el(la)
                                                        titular de la
                                                        cuenta.</span
                                                    >
                                                </div>
                                            </template>
                                        </v-checkbox>
                                    </div>
                                </div>
                                <div
                                    class="btn-add-bank d-flex justify-center align-center text-center"
                                >
                                    <v-btn
                                        size="large"
                                        color="#0085AE"
                                        text="Cancelar"
                                        @click="addBank = false"
                                    />
                                    <v-btn
                                        size="large"
                                        :loading="loading"
                                        color="#70BA44"
                                        text="Finalizar"
                                        @click="continuar"
                                    />
                                </div>
                            </v-form>
                        </div>
                    </v-col>
                </v-row>
            </v-card>
        </div>
        <UserLoading v-else />
    </UserPanel>
    <v-dialog v-model="dialog" persistent width="600">
        <v-card>
            <v-card-text>
                <div class="content-info-form">
                    <h1 class="mb-5">Editar Tarjeta</h1>
                    <v-form ref="formBank">
                        <div class="section-banks">
                            <v-row>
                                <v-col cols="12" class="pa-0">
                                    <div class="w-100">
                                        <div>
                                            <v-select
                                                label="Seleccione una entidad financiera"
                                                v-model="form1.mrc_bank_id"
                                                :items="banks"
                                                class="ip-form inpt-general mb-2"
                                                item-title="name_bank"
                                                :rules="bankRules"
                                                item-value="id"
                                            >
                                                <template
                                                    #item="{ item, props }"
                                                >
                                                    <v-list-item v-bind="props">
                                                        <template #title>
                                                            <div
                                                                @click="
                                                                    getTypesAccount(
                                                                        item.raw
                                                                    )
                                                                "
                                                                class="d-flex justify-star align-center"
                                                            >
                                                                <img
                                                                    width="25"
                                                                    height="25"
                                                                    class="mr-3"
                                                                    :src="
                                                                        getImage(
                                                                            item
                                                                                .raw
                                                                                .icon
                                                                        )
                                                                    "
                                                                />
                                                                {{
                                                                    item.raw
                                                                        .name_bank
                                                                }}
                                                            </div>
                                                        </template>
                                                    </v-list-item>
                                                </template>
                                            </v-select>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <div class="w-100">
                                        <div>
                                            <v-select
                                                label="Selecciona Tipo de cuenta"
                                                v-model="
                                                    form1.mrc_type_account_id
                                                "
                                                :items="typeAccounts"
                                                class="ip-form inpt-general mb-2"
                                                item-title="account_name"
                                                :rules="typeAccountRules"
                                                item-value="id"
                                            >
                                                <template
                                                    #item="{ item, props }"
                                                >
                                                    <v-list-item v-bind="props">
                                                        <template #title>
                                                            <div
                                                                @click="
                                                                    searchLimit(
                                                                        item.raw
                                                                    )
                                                                "
                                                                class="d-flex justify-star align-center"
                                                            >
                                                                {{
                                                                    item.raw
                                                                        .account_name
                                                                }}
                                                            </div>
                                                        </template>
                                                    </v-list-item>
                                                </template>
                                            </v-select>
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <div class="w-100">
                                        <div>
                                            <v-text-field
                                                label="Ingrese número de cuenta"
                                                v-model="form1.number_account"
                                                class="ip-form inpt-general mb-2"
                                                :rules="numberRules"
                                            />
                                        </div>
                                    </div>
                                </v-col>
                                <v-col cols="12" class="pa-0">
                                    <div class="w-100">
                                        <div>
                                            <v-text-field
                                                label="Agrégale un alias a tu cuenta"
                                                v-model="form1.alias_account"
                                                class="ip-form inpt-general mb-2"
                                                :rules="aliasAccountRules"
                                            />
                                        </div>
                                    </div>
                                </v-col>
                            </v-row>
                            <div class="section-type-account">
                                <div
                                    @click=";(money = 1), (errorMoney = true)"
                                    :class="
                                        money === 1 && errorMoney
                                            ? 'type-account active'
                                            : !errorMoney
                                            ? 'type-account error'
                                            : 'type-account'
                                    "
                                >
                                    <v-icon
                                        size="17"
                                        class="mr-1"
                                        v-if="money === 1"
                                        >mdi-check-circle-outline</v-icon
                                    >Soles
                                </div>
                                <div
                                    @click=";(money = 2), (errorMoney = true)"
                                    :class="
                                        money === 2 && errorMoney
                                            ? 'type-account active'
                                            : !errorMoney
                                            ? 'type-account error'
                                            : 'type-account'
                                    "
                                >
                                    <v-icon
                                        size="17"
                                        class="mr-1"
                                        v-if="money === 2"
                                        >mdi-check-circle-outline</v-icon
                                    >Dolares
                                </div>
                            </div>
                        </div>
                        <div class="d-flex justify-center align-center mt-7">
                            <div>
                                <v-checkbox
                                    v-model="accountTypeCity"
                                    color="#61C028"
                                    class="rd-pex"
                                    hide-details
                                >
                                    <template v-slot:label>
                                        <div>
                                            <span
                                                class="dl-underline"
                                                href=""
                                                :style="`${
                                                    headline !== null &&
                                                    !headline
                                                        ? 'color:red'
                                                        : 'color: #0085AE'
                                                }`"
                                                >La cuenta ingresada es de
                                                provincia</span
                                            >
                                        </div>
                                    </template>
                                </v-checkbox>
                            </div>
                        </div>
                        <div class="d-flex justify-center align-center mb-2">
                            <div>
                                <v-checkbox
                                    v-model="headline"
                                    color="#61C028"
                                    :rules="headlineRules"
                                    :class="`${
                                        headline !== null && !headline
                                            ? 'rd-pex error'
                                            : 'rd-pex'
                                    }`"
                                    hide-details
                                >
                                    <template v-slot:label>
                                        <div>
                                            <span
                                                class="dl-underline"
                                                href=""
                                                :style="`${
                                                    headline !== null &&
                                                    !headline
                                                        ? 'color:red'
                                                        : 'color: #0085AE'
                                                }`"
                                                >Declaro que soy el(la) titular
                                                de la cuenta.</span
                                            >
                                        </div>
                                    </template>
                                </v-checkbox>
                            </div>
                        </div>

                        <div
                            class="btn-add-bank d-flex justify-center align-center text-center"
                        >
                            <v-btn
                                size="large"
                                color="#0085AE"
                                text="Cancelar"
                                @click=";(dialog = false), getData()"
                            />
                            <v-btn
                                size="large"
                                :loading="loading"
                                color="#70BA44"
                                text="Finalizar"
                                @click="continuar"
                            />
                        </div>
                    </v-form>
                </div>
            </v-card-text>
        </v-card>
    </v-dialog>
    <v-dialog v-model="dialogDelete" persistent width="500">
        <v-card class="dialog-delete-account">
            <v-card-text>
                <h3 class="color-blue text-center mb-4">
                    Eliminar Cuenta Bancaria
                </h3>
                <div class="text-center">
                    Estas seguro de eliminar esta cuenta bancaria?
                </div>
            </v-card-text>

            <v-card-actions>
                <div class="w-100 d-flex justify-end align-center">
                    <v-btn
                        size="large"
                        color="#0085AE"
                        text="Cancelar"
                        @click="dialogDelete = false"
                    />
                    <v-btn
                        size="large"
                        outlined
                        color="red"
                        :loading="loading"
                        text="Borrar"
                        @click="deleteData"
                    />
                </div>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import UserLoading from '../components/UserLoading.vue'
import UserPanel from '../components/UserPanel.vue'
import { computed, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'

const userStore = userUserStore()
const authStore = userAuthStore()
const addBank = ref(false)
const form1 = ref({
    mrc_bank_id: null,
    mrc_type_account_id: null,
    number_account: '',
    alias_account: ''
})
const formBank = ref(null)
const loading = ref(null)
const banksUser = ref([])
const firstContent = ref(true)
const dialog = ref(false)
const dialogDelete = ref(false)
const dataDelete = ref(0)

const banks = ref([])
const typeAccounts = ref([])
const money = ref(null)
const headline = ref(null)
const errorMoney = ref(true)
const accountTypeCity = ref(null)

const limitNumber = ref(0)
const limitNumberMax = ref(0)

const bankRules = [(v) => !!v || 'Seleccionar un banco']
const typeAccountRules = [(v) => !!v || 'Seleccionar un tipo de cuenta']
const aliasAccountRules = [(v) => !!v || 'Ingrese un alias']
const numberRules = [
    (v) => Number.isInteger(Number(v)) || 'Solo números',
    (v) => !!v || 'Ingresa un número de cuenta',
    (v) =>
        v.length >= limitNumber.value ||
        `Minimo ${limitNumber.value} caracteres.`,
    (v) =>
        v.length <= limitNumberMax.value ||
        `Maximo ${limitNumberMax.value} caracteres.`
]
const headlineRules = [(v) => !!v || 'Campos obligatorios']

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

onMounted(async () => {
    banks.value = authStore.banks
    getData()
})

const getTypesAccount = async (data) => {
    typeAccounts.value = await data.typesAccounts
    form1.value.mrc_type_account_id = null
    form1.value.number_account = ''
}

const searchLimit = async (data) => {
    limitNumber.value = await data.digits
    limitNumberMax.value = await data.digits_max
    form1.value.number_account = ''
}

const getData = async () => {
    const result = await userStore.getListBanksUser()
    if (result.success) {
        banksUser.value = result.data
        authStore.setBank(result.data)
        firstContent.value = false
    }
}

const continuar = async () => {
    const valid1 = await formBank.value.validate()
    loading.value = true
    if (valid1.valid) {
        const data = {
            ...form1.value,
            typeMoney: money.value,
            accountHolder: headline.value,
            type: 1,
            accountTypeCity: accountTypeCity.value
        }
        const result = await userStore.sendValidateBank(data)
        if (result.success) {
            loading.value = false
            addBank.value = false
            dialog.value = false
            getData()
        } else {
            loading.value = false
        }
    } else {
        loading.value = false
        if (headline.value === null || !headline.value) {
            headline.value = false
        } else headline.value = headline.value
        if (money.value === null || !money.value) {
            errorMoney.value = false
        } else errorMoney.value = true
    }
}

const getImage = (img) => {
    return new URL(`../../../assets/svg/banks/${img}.svg`, import.meta.url).href
}

const setData = async (data) => {
    errorMoney.value = true
    headline.value = null
    addBank.value = false
    const ta = banks.value.filter((dl) => dl.id === data.mrc_bank_id)
    typeAccounts.value = ta[0].typesAccounts
    limitNumber.value = typeAccounts.value.filter(
        (dl) => dl.id === data.mrc_type_account_id
    )[0].digits
    limitNumberMax.value = typeAccounts.value.filter(
        (dl) => dl.id === data.mrc_type_account_id
    )[0].digits_max
    form1.value = data
    money.value = data.type_money
    headline.value = data.account_holder === 1 ? true : false
    dialog.value = true
}

const addNewBank = () => {
    money.value = null
    form1.value = {
        mrc_bank_id: null,
        mrc_type_account_id: null,
        number_account: '',
        alias_account: ''
    }
    headline.value = null
    addBank.value = !addBank.value
}

const openDeleteData = (data) => {
    dataDelete.value = data.id
    dialogDelete.value = true
}

const deleteData = async (data) => {
    loading.value = true
    const result = await userStore.deleteBankUser(dataDelete.value)
    if (result.success) {
        dialogDelete.value = false
        loading.value = false
        getData()
    }
}
</script>

<style lang="scss">
.content {
    &-title {
        color: #00acac;
        font-size: 17px;
    }
    &-info {
        margin-top: 10px;
        background: #fff;
        border-radius: 18px;
        box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
        padding: 25px;
        color: #0081a2;
        font-family: 'Archivo-SemiBold';

        &-add {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 123px;
            gap: 15px;
            cursor: pointer;
        }

        &-first {
            display: flex;
            justify-content: flex-start;
            align-items: center;

            p {
                text-overflow: ellipsis;
                white-space: nowrap;
                overflow: hidden;
            }

            &-account {
                border-left: 4px solid $blue2;
                padding-left: 10px;
                p {
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    overflow: hidden;
                }
                @media screen and (max-width: 600px) {
                    border: none;
                    padding: unset;
                }
            }
        }

        &-form {
            .v-text-field .v-field {
                border: 1.5px solid $green;
                border-radius: 18px;
                color: $blue;
                font-family: 'Archivo-SemiBold';
                padding-left: 5px;
                height: 50px;
                box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
                background: white;
            }

            .section-type-account {
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 25px;
                margin-top: 30px;
                .type-account {
                    cursor: pointer;
                    width: 150px;
                    height: 38px;
                    border-radius: 13.5px;
                    color: #70ba44;
                    background: #fff;
                    box-shadow: rgba(112, 186, 68, 0.3) 0px 19px 38px,
                        rgba(112, 186, 68, 0.22) 0px 15px 12px;
                    text-align: center;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    &.active {
                        background: #70ba44;
                        color: #fff;
                    }
                    &.error {
                        border: 1px solid red;
                    }
                    @media screen and (max-width: 600px) {
                        margin: 15px 0;
                        width: 100%;
                    }
                }
                @media screen and (max-width: 600px) {
                    display: inline-block;
                    width: 100%;
                    margin-top: 30px;
                }
            }
            .btn-add-bank {
                gap: 20px;
                button {
                    border-radius: 18px;
                    width: 200px;
                    @media screen and (max-width: 600px) {
                        margin-bottom: 15px;
                        margin-top: 15px;
                        width: auto !important;
                    }
                }
            }
        }
    }
}

.v-card.dialog-delete-account {
    border-radius: 20px !important;
}
.card-pagos {
    box-shadow: none !important;
    background: transparent !important;
}
</style>
