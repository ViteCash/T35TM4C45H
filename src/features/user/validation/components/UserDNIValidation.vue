<template>
    <div class="d-flex flex-column ga-6 ga-md-14 w-100">
        <div class="d-flex flex-column ga-2">
            <h4 class="text-center text-h4 text-lagoon-shade">
                Validación de Documento de Identidad
            </h4>
            <h5 class="text-center text-h5 text-seafoam-light">
                Recuerda tener a la mano tu documento de identidad.
            </h5>
        </div>
        <div
            class="d-flex justify-center ga-4 ga-md-16 flex-wrap flex-md-nowrap"
        >
            <div class="d-flex flex-column align-center justify-center">
                <div class="btn-open-files" v-if="viewImage.imgview1 === null">
                    <label
                        for="upload1"
                        :class="errorImgs.img1 ? 'err-img' : ''"
                        ><span
                            >Adjunta la foto del lado frontal de tu documento. </span
                        ><img src="@/assets/svg/icons/file.svg" alt="cuadors"
                    /></label>
                    <input
                        type="file"
                        @change="createBase64ImageF"
                        style="display: none"
                        name="file"
                        id="upload1"
                        accept="image/png, image/jpeg"
                    />
                </div>
                <div
                    class="dlt-image cursor-pointer"
                    @click="viewImage.imgview1 = null"
                    v-if="viewImage.imgview1"
                >
                    <v-icon color="red">mdi-image-remove</v-icon> Borrar
                </div>
                <img
                    src="@/assets/images/dnifrontal.png"
                    alt=""
                    v-if="viewImage.imgview1 === null"
                    width="300"
                />
                <img
                    v-else
                    :src="`data:image/png;base64,${viewImage.imgview1}`"
                    alt=""
                    width="300"
                />
            </div>
            <div class="d-flex flex-column align-center justify-center">
                <div class="btn-open-files" v-if="viewImage.imgview2 === null">
                    <label
                        for="upload2"
                        :class="errorImgs.img2 ? 'err-img' : ''"
                        ><span
                            >Adjunta la foto del lado posterior de tu
                            documento.</span
                        >
                        <img src="@/assets/svg/icons/file.svg" alt="cuadors"
                    /></label>
                    <input
                        type="file"
                        @change="createBase64ImageP"
                        style="display: none"
                        name="file2"
                        id="upload2"
                        accept="image/png, image/jpeg"
                    />
                </div>
                <div
                    class="dlt-image cursor-pointer"
                    @click="viewImage.imgview2 = null"
                    v-if="viewImage.imgview2"
                >
                    <v-icon color="red">mdi-image-remove</v-icon> Borrar
                </div>
                <div>
                    <img
                        src="@/assets/images/dniposterior.png"
                        alt=""
                        v-if="viewImage.imgview2 === null"
                        width="300"
                    />
                    <img
                        v-else
                        :src="`data:image/png;base64,${viewImage.imgview2}`"
                        alt=""
                        width="300"
                    />
                </div>
            </div>
        </div>
        <div class="d-flex justify-center">
            <v-btn
                :disabled="loadingData1 && loadingData2"
                :loading="loading"
                color="#70BA44"
                rounded="lg"
                size="large"
                text="Continuar"
                @click="continuar()"
            />
        </div>
    </div>
</template>

<script>
import { reactive, ref } from 'vue'
import { useDisplay } from 'vuetify'
import { userUserStore } from '@/stores/user'
import { userAuthStore } from '@/stores/auth'
import Compressor from 'compressorjs'

export default {
    emits: ['sendData'],
    setup(props, ctx) {
        const dniFrontal = ref(null)
        const dniPosterior = ref(null)
        const base64Frontal = ref()
        const loading = ref(false)
        const userStore = userUserStore()
        const authStore = userAuthStore()
        const loadingData1 = ref(true)
        const loadingData2 = ref(true)

        const viewImage = reactive({
            imgview1: null,
            imgview2: null
        })

        const fileSend = ref()

        const mostrarImg = reactive({
            type: 1,
            img1: null,
            img2: null
        })
        const errorImgs = reactive({
            img1: false,
            img2: false
        })

        const createBase64ImageF = async (event) => {
            const file = event.target.files
            let nameFile = file[0]?.name.split('.')
            base64Frontal.value = file[0]
            new Compressor(file[0], {
                quality: 0.6,
                success(result) {
                    let file = new File(
                        [result],
                        `DNI_FRONTAL-${authStore.user.dni}.${
                            nameFile[nameFile.length - 1]
                        }`,
                        { lastModified: Date.now() }
                    )
                    fileSend.value = file
                    const reader = new FileReader()
                    reader.readAsDataURL(result)
                    reader.onload = () => {
                        const base64 = reader.result
                        viewImage.imgview1 = base64.split(',')[1]
                        errorImgs.img1 = false
                        mostrarImg.img1 = `dni/${
                            authStore.user.dni
                        }/DNI_FRONTAL-${authStore.user.dni}.${
                            nameFile[nameFile.length - 1]
                        }`
                    }
                    reader.onerror = (error) => reject(error)
                    sendImageS3(1)
                }
            })
        }

        const createBase64ImageP = (event) => {
            const file = event.target.files
            let nameFile = file[0]?.name.split('.')
            base64Frontal.value = file[0]
            new Compressor(file[0], {
                quality: 0.6,
                success(result) {
                    let file = new File(
                        [result],
                        `DNI_POSTERIOR-${authStore.user.dni}.${
                            nameFile[nameFile.length - 1]
                        }`,
                        { lastModified: Date.now() }
                    )
                    fileSend.value = file
                    const reader = new FileReader()
                    reader.readAsDataURL(result)
                    reader.onload = () => {
                        const base64 = reader.result
                        viewImage.imgview2 = base64.split(',')[1]
                        errorImgs.img2 = false
                        mostrarImg.img2 = `dni/${
                            authStore.user.dni
                        }/DNI_POSTERIOR-${authStore.user.dni}.${
                            nameFile[nameFile.length - 1]
                        }`
                    }
                    reader.onerror = (error) => reject(error)
                    sendImageS3(2)
                }
            })
        }

        const sendImageS3 = async (type) => {
            const formData = new FormData()
            formData.append('file', fileSend.value)
            const result = await userStore.sendImage(formData)
            if (result.success) {
                if (type === 1) loadingData1.value = false
                else loadingData2.value = false
            }
        }

        const continuar = async () => {
            try {
                if (viewImage.imgview1 === null) {
                    errorImgs.img1 = true
                }
                if (viewImage.imgview2 === null) {
                    errorImgs.img2 = true
                }
                if (!errorImgs.img1 && !errorImgs.img2) {
                    loading.value = true
                    const result = await userStore.sendValidate(mostrarImg)

                    if (result.success) {
                        await userStore.stateUser()
                        setTimeout(() => {
                            loading.value = false
                            ctx.emit('sendData')
                        }, 3000)
                    }
                }
            } catch (error) {
                loading.value = false
            }
        }

        return {
            dniFrontal,
            dniPosterior,
            createBase64ImageF,
            createBase64ImageP,
            mostrarImg,
            errorImgs,
            continuar,
            loading,
            viewImage,
            sendImageS3,
            loadingData1,
            loadingData2
        }
    },
    data() {
        return {}
    },
    computed: {
        responsive() {
            const mobile = useDisplay()
            return mobile.value
        }
    }
}
</script>

<style lang="scss" scoped>
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
        position: relative;
        cursor: pointer;
        font-size: 15px;
        &.err-img {
            border: red;
            color: red;
            background: rgb(255, 0, 0, 20%);
            transition: 0.3s ease-in-out;
        }
        @media screen and (max-width: 959px) {
            padding: 10px 20px;
            font-size: 14px;
        }
    }
}

.dlt-image {
    color: red;
    font-weight: bold;
    padding-bottom: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
}
</style>
