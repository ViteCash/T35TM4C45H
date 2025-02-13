import axios from 'axios'
import { defineStore } from 'pinia'
import { userAuthStore } from '@/stores/auth'

export const userUserStore = defineStore('user', {
    state: () => ({
        userState: null,
        tokenSend: null,
        loading: false
    }),
    getters: {
        getStateUser(state) {
            return state.userState
        }
    },
    actions: {
        async stateLoadingGeneral(paylod) {
            this.loading = await paylod
        },
        async stateUser() {
            try {
                const authStore = userAuthStore()
                const result = await axios.get(
                    `/api/stateUser/${authStore.user.id}`
                )
                if (result.data.success) {
                    this.userState = result.data.data[0].state
                    return result.data.data
                }
            } catch (error) {}
        },
        async sendValidate(form) {
            try {
                const authStore = userAuthStore()
                const result = await axios.post(
                    `/api/validateDataUser/${authStore.user.id}`,
                    form
                )
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async sendImage(form) {
            try {
                const authStore = userAuthStore()
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                const result = await axios.post(`/api/sendImage`, form, config)
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async sendValidateBank(form) {
            try {
                const result = await axios.post(`/api/validateDataBank`, form)
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async getListBanksUser(form) {
            try {
                const result = await axios.get(`/api/listBanksUser`)
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async deleteBankUser(form) {
            try {
                const result = await axios.get(`/api/deleteBankUser/${form}`)
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async generateUrlImage(form) {
            try {
                const result = await axios.post(`/api/generateUrl`, form)
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async listOrders(params) {
            try {
                const result = await axios.get(`/api/listOrders`, {
                    params
                })
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async newOrder(form) {
            try {
                const result = await axios.post(`/api/newOrder`, form)
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async sendImageOrder(form, codigo) {
            try {
                const authStore = userAuthStore()
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                const result = await axios.post(
                    `/api/sendImageOrder/${codigo}`,
                    form,
                    config
                )
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async finalyOrder(codigo) {
            try {
                const result = await axios.get(`/api/saveOrder/${codigo}`)
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async aplicatePromoCode(form) {
            try {
                const result = await axios.post(`/api/promocode`, form)
                if (result.data.success) {
                    return result.data
                }
            } catch (error) {}
        },
        async sendEmail(form) {
            try {
                const config = {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                const result = await axios.post(
                    import.meta.env.VITE_APP_URL_SENDEMAIL,
                    form,
                    config
                )
            } catch (error) {}
        },
        setTokenEmail(payload) {
            this.tokenSend = payload
        }
    },
    persist: {
        storage: sessionStorage // data in sessionStorage is cleared when the page session ends.
    }
})
