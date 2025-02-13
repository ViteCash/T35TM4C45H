<template>
    <div class="d-flex justify-center align-center">
        <v-form ref="formBank" class="d-flex flex-column ga-12">
            <div class="d-flex flex-column ga-4 align-center">
                <h4 class="text-center text-h4 text-lagoon-shade">
                    Ingrese cuenta bancaria
                </h4>
                <v-alert
                    color="#0081a2"
                    type="info"
                    variant="tonal"
                    border="start"
                    text="Recuerda que para poder realizar una nueva operación, debe
                    tener al menos una cuenta ingresada."
                />
            </div>
            <div v-if="addCard" class="section-banks">
                <v-container>
                    <v-row>
                        <v-col cols="12" lg="6" md="6" sm="6">
                            <div class="w-100">
                                <div>
                                    <label for="" class="color-green"
                                        >Seleccione una entidad
                                        financiera</label
                                    >
                                    <v-select
                                        v-model="form1.mrc_bank_id"
                                        :items="banks"
                                        variant="outlined"
                                        class="ip-form"
                                        item-title="name_bank"
                                        :rules="bankRules"
                                        item-value="id"
                                    >
                                        <template #item="{ item, props }">
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
                                                                    item.raw
                                                                        .icon
                                                                )
                                                            "
                                                        />
                                                        {{ item.raw.name_bank }}
                                                    </div>
                                                </template>
                                            </v-list-item>
                                        </template>
                                    </v-select>
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" lg="6" md="6" sm="6">
                            <div class="w-100">
                                <div>
                                    <label for="" class="color-green"
                                        >Selecciona Tipo de cuenta</label
                                    >
                                    <v-select
                                        v-model="form1.mrc_type_account_id"
                                        :items="typeAccounts"
                                        variant="outlined"
                                        class="ip-form"
                                        item-title="account_name"
                                        :rules="typeAccountRules"
                                        item-value="id"
                                    >
                                        <template #item="{ item, props }">
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
                        <v-col cols="12" lg="6" md="6" sm="6">
                            <div class="w-100">
                                <div>
                                    <label for="" class="color-green"
                                        >Ingrese número de cuenta</label
                                    >
                                    <v-text-field
                                        v-model="form1.number_account"
                                        variant="outlined"
                                        label=""
                                        class="ip-form"
                                        type="number"
                                        :rules="numberRules"
                                    />
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" lg="6" md="6" sm="6">
                            <div class="w-100">
                                <div>
                                    <label for="" class="color-green"
                                        >Agrégale un alias a tu cuenta</label
                                    >
                                    <v-text-field
                                        v-model="form1.alias_account"
                                        variant="outlined"
                                        label=""
                                        class="ip-form"
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
                            <v-icon size="17" class="mr-1" v-if="money === 1"
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
                            <v-icon size="17" class="mr-1" v-if="money === 2"
                                >mdi-check-circle-outline</v-icon
                            >Dolares
                        </div>
                    </div>
                </v-container>
            </div>
            <div v-if="addCard" class="d-flex justify-center align-center mt-2">
                <div>
                    <v-checkbox
                        v-model="accountTypeCity"
                        color="#61C028"
                        class="rd-pex"
                        hide-details
                    >
                        <template v-slot:label>
                            <div>La cuenta ingresada es de provincia</div>
                        </template>
                    </v-checkbox>
                </div>
            </div>
            <div v-if="addCard" class="d-flex justify-center align-center">
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
                                Aceptar
                                <a
                                    class="dl-underline"
                                    href=""
                                    :style="`${
                                        headline !== null && !headline
                                            ? 'color:red'
                                            : 'color:#61C028'
                                    }`"
                                    >Declaro que soy el(la) titular de la
                                    cuenta.</a
                                >
                            </div>
                        </template>
                    </v-checkbox>
                </div>
            </div>

            <div
                v-if="addCard"
                class="text-center position-relative ga-3 d-flex justify-center align-center"
            >
                <v-btn
                    color="#70BA44"
                    rounded="lg"
                    size="large"
                    :loading="loading"
                    text="Finalizar"
                    @click="continuar"
                />
                <v-btn
                    rounded="lg"
                    size="large"
                    color="red"
                    text="Cancelar"
                    @click="addCard = !addCard"
                />
            </div>
            <div
                v-else
                class="d-flex justify-center align-center ga-4 flex-wrap flex-sm-nowrap"
            >
                <v-btn
                    color="#70BA44"
                    rounded="lg"
                    size="large"
                    prepend-icon="mdi-plus"
                    text="Agregar cuenta"
                    @click="addCard = !addCard"
                />
                <v-btn
                    variant="outlined"
                    rounded="lg"
                    size="large"
                    color="#70BA44"
                    prepend-icon="mdi-skip-next"
                    :loading="loading"
                    text="Omitir"
                    @click="omitir"
                />
            </div>
        </v-form>
    </div>
</template>

<script>
import { computed, onMounted, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'

export default {
    setup(props, ctx) {
        const form1 = ref({
            id: null,
            mrc_bank_id: null,
            mrc_type_account_id: null,
            number_account: '',
            alias_account: ''
        })
        const formBank = ref(null)
        const loading = ref(null)
        const authStore = userAuthStore()
        const userStore = userUserStore()

        const banks = ref([])
        const typeAccounts = ref([])
        const money = ref(null)
        const headline = ref(null)
        const accountTypeCity = ref(false)
        const errorMoney = ref(true)

        const limitNumber = ref(0)
        const limitNumberMax = ref(0)
        const addCard = ref(false)

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

        const omitir = async () => {
            loading.value = true
            const data = {
                ...form1.value,
                typeMoney: money.value,
                accountHolder: headline.value,
                type: 2
            }
            const result = await userStore.sendValidateBank(data)
            if (result.success) {
                // agregar el envio de correo
                await userStore.stateUser()
                setTimeout(() => {
                    loading.value = false
                    ctx.emit('sendData')
                }, 3000)
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
                    await userStore.stateUser()
                    setTimeout(() => {
                        loading.value = false
                        ctx.emit('sendData')
                    }, 3000)
                }
            } else {
                if (headline.value === null || !headline.value) {
                    headline.value = false
                } else headline.value = headline.value
                if (money.value === null || !money.value) {
                    errorMoney.value = false
                } else errorMoney.value = true

                loading.value = false
            }
        }

        const { mobile } = useDisplay()
        const responsive = computed(() => mobile.value)

        const getImage = (img) => {
            return new URL(
                `../../../../assets/svg/banks/${img}.svg`,
                import.meta.url
            ).href
        }

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
        onMounted(() => {
            banks.value = authStore.banks
        })

        return {
            form1,
            formBank,
            loading,
            userStore,
            banks,
            typeAccounts,
            money,
            headline,
            errorMoney,
            bankRules,
            typeAccountRules,
            aliasAccountRules,
            numberRules,
            headlineRules,
            accountTypeCity,
            responsive,
            getImage,
            continuar,
            getTypesAccount,
            searchLimit,
            omitir,
            addCard
        }
    }
}
</script>

<style lang="scss">
.v-text-field .v-field {
    border: 1.5px solid $green;
    border-radius: 18px;
    color: $blue;
    font-family: 'Archivo-SemiBold';
    padding-left: 5px;
    height: 54px;
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
    background: white;
}

.text-lagoon-shade {
    color: #005e81;
}

.text-seafoam-light {
    color: #0081a2;
}

.btn-open-files {
    color: #0081a2;
    display: flex;
    justify-content: center;
    align-items: center;
    label {
        padding: 18px 29px;
        background: rgb(155, 210, 201, 20%);
        border-radius: 18px;
        display: flex;
        justify-content: center;
        gap: 40px;
        align-items: center;
        &.err-img {
            border: red;
            color: red;
            background: rgb(255, 0, 0, 20%);
            transition: 0.3s ease-in-out;
        }
    }
}

.color-green {
    color: #00acac;
}

.section-type-account {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 25px;
    margin-top: 25px;
    .type-account {
        cursor: pointer;
        width: 150px;
        height: 38px;
        border-radius: 13.5px;
        color: #70ba44;
        background: #fff;
        box-shadow: rgba(112, 186, 68, 0.3) 0px 9px 29px,
            rgba(112, 186, 68, -0.78) 0px 5px 7px;
        text-align: center;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 99;
        &.active {
            background: #70ba44;
            color: #fff;
        }
        &.error {
            border: 1px solid red;
        }
    }
}

.rd-pex .v-label {
    font-size: 17px;
    @media screen and (max-width: 600px) {
        font-size: 12.4px;
    }
}
.rd-pex.v-selection-control--dirty .v-selection-control__input .v-icon::before {
    content: '\F0132' !important;
    color: #00acac;
}
.rd-pex
    .v-selection-control--dirty
    .v-selection-control__input
    .v-icon::before {
    content: '\F0132' !important;
    color: #00acac;
}
.rd-pex .v-selection-control__input .v-icon::before {
    content: '\F0131' !important;
    color: #00acac;
}

.rd-pex.error .v-selection-control__input .v-icon::before {
    content: '\F0131' !important;
    color: red;
}

.cont-btns {
    @media screen and (max-width: 959px) {
        display: grid !important;
        text-align: center;
        .omitir {
            margin-top: 20px;
        }
    }
}
</style>
