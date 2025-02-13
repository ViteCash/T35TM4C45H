import axios from 'axios'
import CryptoJS from 'crypto-js'
import {defineStore} from 'pinia'

const key = 'SECRET_PASSWORD';

export const userAuthStore = defineStore('auth', {
	state: () => ({
		user: null,
		token: null,
		isLogged: true,
		banks: null,
		comissions: null,
		typeAccounts: null
	}),
	getters: {
		getUser(state) { 
      return state.user
    }
	},
	actions: {
		async login (form) {
			try {
				const password = CryptoJS.AES.encrypt(form.password, key).toString()
				const data = {...form, password: password}
				const result = await axios.post('/api/login', data)
				if (result.data.success) {
					const banks = await axios.get('/api/banks')
					const comission = await axios.get('/api/comissions')
					// const typeAccounts = await axios.get('/api/typeAccounts')
					this.banks = banks.data.data
					this.comissions = comission.data.data
					this.token = result.data.data.token
					this.user = result.data.data
					localStorage.setItem('token', JSON.stringify(result.data.data.token));
					this.isLogged = true
					return result.data
				}
			} catch (error) {
				return error.response.data
			}
		},
		async registro(form){
			try {
				const result = await axios.post('/api/crearUsuario', form)
				if (result.data.success) {
					return result.data
				}
			} catch (error) {
				return error.response.data
			}
		},

		async recoveryPassword(form) {
			try {
				const result = await axios.post('/api/recoverypassword', form)
				if (result.data.success) {
					return result.data
				}
			} catch (error) {
				return error.response.data
			}
		},

		async restorePassword(form) {
			try {
				const result = await axios.post(`/api/restorepassword`, form)
				if (result.data.success) {
					return result.data
				}
			} catch (error) {
				return error.response.data
			}
		},

		async validateDni(form) {
			try {
				const result = await axios.get(`/api/validateDni/${form.value.dni}`)
				if (result.data.success) {
					return result.data
				}
			} catch (error) {
				return error.response.data
			}
		},

		async updateDataUser(form) {
			try {
				const result = await axios.post(`/api/updateUser`, form)
				if (result.data.success) {
					return result.data
				}
			} catch (error) {
				
			}
		},

		logout() {
			this.user = null
			this.token = null
			this.isLogged = false
			this.banks = null
			localStorage.removeItem("token")
			this.router.push('/login')
		},
		setUser (payload) {
			this.user = {...this.user, ...payload}
		},
		setBank (payload) {
			this.user.userBanks = payload
		},
		setReferralCode (payload) {
			this.user.useReferredCode = payload
		}
	},
	persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  },
})