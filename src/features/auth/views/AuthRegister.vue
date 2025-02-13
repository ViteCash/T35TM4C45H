<template>
    <AuthWrapper>
        <template #left>
            <img
                v-if="!successRegister"
                class="frame"
                src="@/assets/images/frame-register.png"
                alt="Persona registrando su información"
                width="661"
                height="590"
            />
            <img
                v-else
                class="frame"
                src="@/assets/images/frame-register-success.png"
                alt="Registro exitoso"
                width="661"
                height="590"
            />
        </template>
        <template #right>
            <AuthCard title="Regístrate" v-if="!successRegister">
                <div class="d-flex flex-column ga-8">
                    <div
                        :class="`content-section-register ${
                            !validateRegister1 && !validateRegister2
                                ? 'active1'
                                : 'active2'
                        }`"
                    >
                        <div
                            :class="`item ${
                                !validateRegister1 && !validateRegister2
                                    ? 'active'
                                    : ''
                            }`"
                        >
                            1
                        </div>
                        <div class="circle-pass">
                            <div></div>
                            <div></div>
                            <div></div>
                        </div>
                        <div
                            :class="`item ${
                                validateRegister1 && !validateRegister2
                                    ? 'active'
                                    : ''
                            }`"
                        >
                            2
                        </div>
                    </div>
                    <v-form
                        v-if="!validateRegister1 && !validateRegister2"
                        ref="formRegister1"
                        class="d-flex flex-column ga-5"
                        @submit.prevent="sendRegister"
                    >
                        <div class="d-flex flex-column ga-2">
                            <div class="d-flex flex-column ga-2">
                                <v-text-field
                                    v-model="form1.nombres"
                                    :rules="nameRules"
                                    label="Nombres"
                                    class="ip-form inpt-general"
                                    :class="nameRules"
                                />
                                <v-text-field
                                    v-model="form1.apellido_paterno"
                                    :rules="lastFirstNameRules"
                                    class="ip-form inpt-general"
                                    label="Apellido paterno"
                                />
                                <v-text-field
                                    v-model="form1.apellido_materno"
                                    :rules="lastSecondNameRules"
                                    class="ip-form inpt-general"
                                    label="Apellido materno"
                                />
                            </div>
                            <div class="d-flex align-center ga-2">
                                <div class="w-33">
                                    <v-select
                                        v-model="form1.type_document"
                                        :items="type_documents"
                                        class="ip-form inpt-general"
                                        item-title="name"
                                        item-value="id"
                                        :rules="typeDocuemntRules"
                                    >
                                        <template #item="{ item, props }">
                                            <v-list-item
                                                v-bind="props"
                                                @click="
                                                    selectTypeDocuemnt(item.raw)
                                                "
                                            >
                                                <template #title>
                                                    <div
                                                        class="d-flex justify-center align-center"
                                                    >
                                                        {{ `${item.raw.name}` }}
                                                    </div>
                                                </template>
                                            </v-list-item>
                                        </template>
                                    </v-select>
                                </div>
                                <div class="w-66">
                                    <v-text-field
                                        v-model="form1.dni"
                                        :rules="dniRules"
                                        :label="namedDocument"
                                        class="ip-form inpt-general"
                                        :error-messages="
                                            errorDni ? `DNI existente` : ``
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                        <div class="d-flex ga-4 flex-column">
                            <v-btn
                                block
                                size="large"
                                rounded="lg"
                                color="#70BA44"
                                type="submit"
                                text="Siguiente"
                            />
                            <div class="register text-center">
                                <span class="text-seafoam-light">
                                    ¿Ya tienes una cuenta?
                                    <a href="/login" class="text-green-2"
                                        >Inicia sesión</a
                                    >
                                </span>
                            </div>
                        </div>
                    </v-form>
                    <v-form
                        v-if="validateRegister1 && !validateRegister2"
                        ref="formRegister2"
                        class="d-flex flex-column ga-4"
                        @submit.prevent="sendRegisterFinal"
                    >
                        <div class="d-flex flex-column ga-2">
                            <v-text-field
                                v-model="form2.email"
                                :rules="emailRules"
                                label="Email"
                                class="ip-form inpt-general"
                            />
                            <v-text-field
                                v-model="form2.phone"
                                :rules="phoneRules"
                                label="Celular"
                                class="ip-form inpt-general"
                            />
                            <v-text-field
                                :append-inner-icon="
                                    show1 ? 'mdi-eye' : 'mdi-eye-off'
                                "
                                :type="show1 ? 'text' : 'password'"
                                v-model="password"
                                :rules="passwordRules"
                                label="Contraseña"
                                class="ip-form inpt-general"
                                @click:append-inner="show1 = !show1"
                            />
                            <v-text-field
                                :append-inner-icon="
                                    show2 ? 'mdi-eye' : 'mdi-eye-off'
                                "
                                :type="show2 ? 'text' : 'password'"
                                v-model="confirmPassword"
                                :rules="matchRule"
                                label="Confirmar Contraseña"
                                class="ip-form inpt-general"
                                @click:append-inner="show2 = !show2"
                            />
                            <v-text-field
                                v-model="form2.referredCode"
                                label="Codigo de Referencia"
                                class="ip-form inpt-general inpt-referencial"
                            />
                        </div>
                        <div class="d-flex flex-column">
                            <div class="d-flex flex-column ga-1">
                                <p style="color: #0081a2">
                                    Persona políticamente expuesta
                                </p>
                                <v-radio-group
                                    v-model="politicPerson"
                                    inline
                                    :rules="politicDataRules"
                                    hide-details=""
                                >
                                    <v-radio
                                        color="#00ABAC"
                                        value="false"
                                        :class="`${
                                            politicPerson !== null &&
                                            !politicPerson
                                                ? 'rd-pex error'
                                                : 'rd-pex'
                                        }`"
                                    >
                                        <template v-slot:label>
                                            <div>No</div>
                                        </template>
                                    </v-radio>
                                    <v-radio
                                        color="#00ABAC"
                                        value="true"
                                        :class="`${
                                            politicPerson !== null &&
                                            !politicPerson
                                                ? 'rd-pex error'
                                                : 'rd-pex'
                                        }`"
                                    >
                                        <template v-slot:label>
                                            <div>Si</div>
                                        </template>
                                    </v-radio>
                                </v-radio-group>
                            </div>
                            <v-checkbox
                                v-model="tc"
                                color="#61C028"
                                :rules="TCRules"
                                :class="`${
                                    tc !== null && !tc
                                        ? 'rd-pex error'
                                        : 'rd-pex'
                                }`"
                                hide-details
                            >
                                <template v-slot:label>
                                    <div class="text-body-1">
                                        Aceptar
                                        <a
                                            class="dl-underline"
                                            href=""
                                            :style="`${
                                                tc !== null && !tc
                                                    ? 'color:red'
                                                    : 'color:#61C028'
                                            }`"
                                            >Términos y condiciones</a
                                        >
                                    </div>
                                </template>
                            </v-checkbox>
                            <v-checkbox
                                v-model="politicData"
                                color="#61C028"
                                :rules="PDRules"
                                :class="`${
                                    politicData !== null && !politicData
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
                                                politicData !== null &&
                                                !politicData
                                                    ? 'color:red'
                                                    : 'color:#61C028'
                                            }`"
                                            >Política de datos</a
                                        >
                                    </div>
                                </template>
                            </v-checkbox>
                        </div>
                        <div class="d-flex ga-4 flex-column">
                            <div class="text-center">
                                <v-btn
                                    v-if="
                                        validateRegister1 && !validateRegister2
                                    "
                                    prepend-icon="mdi-chevron-left"
                                    variant="text"
                                    size="large"
                                    rounded="lg"
                                    color="#005e81"
                                    text="Atras"
                                    @click="retroceder"
                                />
                            </div>
                            <v-btn
                                color="#70BA44"
                                rounded="lg"
                                size="large"
                                :loading="loading"
                                type="submit"
                                text="Registrar"
                            />
                            <div class="register text-center">
                                <span class="text-seafoam-light">
                                    ¿Ya tienes una cuenta?
                                    <a href="/login" class="text-green-2"
                                        >Inicia sesión</a
                                    >
                                </span>
                            </div>
                        </div>
                    </v-form>
                </div>
            </AuthCard>
            <div v-else>
                <h1 class="h-100 text-center text-seafoam-light text-h4">
                    ¡Bienvenido!<br />
                    Ya eres parte de Mr. Cash!
                </h1>
            </div>
        </template>
    </AuthWrapper>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { userAuthStore } from '@/stores/auth'
import AuthWrapper from '../components/AuthWrapper.vue'
import AuthCard from '../components/AuthCard.vue'

const authStore = userAuthStore()
const form1 = ref({
    dni: '',
    type_document: 1,
    nombres: '',
    apellido_materno: '',
    apellido_paterno: ''
})
const form2 = ref({ email: '', phone: '', referredCode: '' })
const password = ref('')
const confirmPassword = ref('')
const politicPerson = ref(null)
const tc = ref(null)
const politicData = ref(null)
const router = useRouter()
const show1 = ref(false)
const show2 = ref(false)
const loading = ref(false)

const errorDni = ref(false)

const formRegister1 = ref(null)
const formRegister2 = ref(null)
const validateRegister1 = ref(false)
const validateRegister2 = ref(false)
const successRegister = ref(false)
const digitDefault = ref(8)
const namedDocument = ref('DNI')

const type_documents = [
    { id: 1, name: 'DNI', digit: 8, nameComplete: 'DNI' },
    { id: 2, name: 'CE', digit: 9, nameComplete: 'C. de Extranjeria' }
]

const sendRegister = async () => {
    try {
        const result = await authStore.validateDni(form1)
        if (result.success) {
            const valid1 = await formRegister1.value.validate()
            validateRegister1.value = valid1.valid
        } else {
            errorDni.value = true
            setTimeout(() => {
                errorDni.value = false
            }, 2000)
        }
    } catch (error) {}
}

const sendRegisterFinal = async () => {
    loading.value = true
    const valid2 = await formRegister2.value.validate()
    const data = {
        ...form1.value,
        ...form2.value,
        referredCode: form2.value.referredCode.toUpperCase(),
        password: password.value,
        politic_person: politicPerson.value === 'true',
        t_c: tc.value,
        politic_data: politicData.value
    }
    if (valid2.valid) {
        try {
            const result = await authStore.registro(data)
            if (result.success) {
                setTimeout(() => {
                    router.push('/login')
                    loading.value = true
                }, 5000)
                successRegister.value = true
            } else {
                alert(result.message)
            }
        } catch (error) {
            loading.value = false
        }
    } else {
        if (politicPerson.value === null || !politicPerson.value) {
            politicPerson.value = false
        } else politicPerson.value = politicPerson.value
        if (tc.value === null || !tc.value) {
            tc.value = false
        } else tc.value = tc.value
        if (politicData.value === null || !politicData.value) {
            politicData.value = false
        } else politicData.value = politicData.value
        loading.value = false
    }
}

const selectTypeDocuemnt = (value) => {
    form1.value.type_document = value.id
    digitDefault.value = value.digit
    namedDocument.value = value.nameComplete
}

const retroceder = async () => {
    validateRegister1.value = false
}

const nameRules = [(v) => !!v || 'Nombres obligatorio']

const lastFirstNameRules = [(v) => !!v || 'Apellido paterno obligatorio']

const lastSecondNameRules = [(v) => !!v || 'Apellido materno obligatorio']

const typeDocuemntRules = [(v) => !!v || 'Campos obligatorios']

const dniRules = [
    (v) => !!v || `${namedDocument.value} obligatorio`,
    (v) => v.length <= digitDefault.value || `${namedDocument.value} invalido`,
    (v) => v.length >= digitDefault.value || `${namedDocument.value} invalido`,
    (v) => Number.isInteger(Number(v)) || 'Ingrese solo numeros'
]

const passwordRules = [
    (v) => !!v || 'Contraseña obligatorio',
    (v) =>
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/.test(v) ||
        'Ingrese un Password correcto (1 mayuscula, 1 miniscula, 1 número y un min de 8 caracteres)'
]

const phoneRules = [
    (v) => !!v || 'Celular obligatorio',
    (v) => /^[0-9]{9,9}$/.test(v) || 'Ingrese un celular valido'
]

const emailRules = [
    (v) => !!v || 'Email obligatorio',
    (v) =>
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/.test(
            v
        ) || 'Ingrese Email valido'
]

const matchRule = [
    (v) => !!v || 'Contraseña obligatorio',
    (v) => v === password.value || 'Las contraseñas no coinciden'
]

const politicDataRules = [(v) => !!v || 'Campos obligatorios']

const TCRules = [(v) => !!v || 'Campos obligatorios']

const PDRules = [(v) => !!v || 'Campos obligatorios']
</script>

<style lang="scss">
.btn-back {
    display: flex;
    align-items: center;
    font-size: 16px;
    color: $blue;
    font-weight: 700;
}

.content-section-register {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    .item {
        width: 40px;
        height: 40px;
        color: #005e81;
        text-align: center;
        justify-content: center;
        align-items: center;
        display: flex;
        font-weight: 600;
        font-size: 18px;
        @media screen and (max-width: 600px) {
            width: 26px;
            height: 26px;
            font-size: 10.45px;
        }
        &.active {
            border-radius: 50%;
            background: #b9dfd9;
        }
    }
    &.active1 {
        .circle-pass {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 11px;
            @media screen and (max-width: 600px) {
                gap: 5px;
            }
            div {
                width: 7px;
                height: 8px;
                transform: rotate(45deg);
                background: #00acac;
                margin: 0 5.5px;
                @media screen and (max-width: 600px) {
                    width: 5.2px;
                    height: 5.2px;
                }
                &:nth-child(2) {
                    background: rgba(0, 172, 172, 0.5);
                }
                &:nth-child(3) {
                    background: rgba(0, 172, 172, 0.25);
                }
            }
        }
    }

    &.active2 {
        .circle-pass {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 11px;
            @media screen and (max-width: 600px) {
                gap: 5px;
            }
            div {
                width: 7px;
                height: 8px;
                transform: rotate(45deg);
                background: rgba(0, 172, 172, 0.25);
                margin: 0 5.5px;
                @media screen and (max-width: 600px) {
                    width: 5.2px;
                    height: 5.2px;
                }
                &:nth-child(2) {
                    background: rgba(0, 172, 172, 0.5);
                }
                &:nth-child(3) {
                    background: #00acac;
                }
            }
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

.dl-underline {
    text-decoration: unset;
    font-weight: bold;
}
</style>
