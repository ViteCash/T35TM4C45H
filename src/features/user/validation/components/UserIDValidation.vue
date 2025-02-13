<template>
    <div class="d-flex flex-column ga-8 ga-md-16 w-100">
        <div class="d-flex flex-column align-center ga-4">
            <h4 class="text-center text-h4 text-lagoon-shade">
                Validación de Identidad
            </h4>
            <v-alert color="#0081a2" type="info" variant="tonal" border="start"
                >Tiene que ser una foto
                <span class="font-weight-bold">SELFIE</span> mostrando su rostro
                y dni</v-alert
            >
        </div>
        <div class="d-flex flex-column align-center">
            <div class="btn-open-files">
                <label for="upload1" :class="errorImgs.img1 ? 'err-img' : ''"
                    >Adjunta una foto selfie con dni.
                    <img src="@/assets/svg/icons/file.svg" alt="cuadors"
                /></label>
                <input
                    type="file"
                    @change="createBase64ImageF"
                    style="display: none"
                    id="upload1"
                    accept="image/*;capture=camera"
                />
            </div>

            <div class="d-flex align-center">
                <img
                    src="@/assets/images/frame-identidad.png"
                    alt=""
                    v-if="viewImage.imgview1 === null"
                    height="300"
                />
                <img
                    v-else
                    :src="`data:image/png;base64,${viewImage.imgview1}`"
                    alt=""
                    height="300"
                />
            </div>
        </div>
        <div class="d-flex justify-center">
            <v-btn
                :disabled="loadingData"
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
import { computed, reactive, ref, watch } from 'vue'
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
        const fileSend = ref()
        const loadingData = ref(true)
        const viewImage = reactive({
            imgview1: null
        })
        const mostrarImg = reactive({
            type: 2,
            img1: null,
            img2: null
        })
        const errorImgs = reactive({
            img1: false
        })

        const createBase64ImageF = (event) => {
            const file = event.target.files
            let nameFile = file[0]?.name.split('.')
            base64Frontal.value = file[0]
            new Compressor(file[0], {
                quality: 0.6,
                success(result) {
                    let file = new File(
                        [result],
                        `FOTO_PERFIL-${authStore.user.dni}.${
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
                        }/FOTO_PERFIL-${authStore.user.dni}.${
                            nameFile[nameFile.length - 1]
                        }`
                    }
                    reader.onerror = (error) => reject(error)
                    sendImageS3()
                }
            })
        }

        const sendImageS3 = async (type) => {
            const formData = new FormData()
            formData.append('file', fileSend.value)
            const result = await userStore.sendImage(formData)
            if (result.success) {
                loadingData.value = false
            }
        }

        const continuar = async () => {
            if (viewImage.imgview1 === null) {
                errorImgs.img1 = true
            }
            if (!errorImgs.img1) {
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
        }

        return {
            dniFrontal,
            dniPosterior,
            createBase64ImageF,
            mostrarImg,
            errorImgs,
            continuar,
            loading,
            sendImageS3,
            viewImage,
            loadingData
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
        &.err-img {
            border: red;
            color: red;
            background: rgb(255, 0, 0, 20%);
            transition: 0.3s ease-in-out;
        }
    }
}
</style>
