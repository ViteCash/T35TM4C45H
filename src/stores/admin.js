import axios from 'axios'
import { defineStore } from 'pinia';
// import { userAuthStore } from '@/stores/auth';

export const adminAdminStore = defineStore ('admin', {
  state: () => ({
	}),
	getters: {
		
	},
  actions: {
    async getUsers (params) {
      try {
        const result = await axios.get(`/api/admin/users`, {
          params
        })
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async getDataUser (params) {
      try {
        const result = await axios.get(`/api/admin/user/${params}`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async updateUser (params) {
      try {
        const result = await axios.post(`/api/admin/user/update`,params)
        return result.data
      } catch (error) {
        return error.response.data
      }  
    },
    async getOrders (params) {
      try {
        const result = await axios.get(`/api/admin/ordenes`, {
          params
        })
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async getDataOrden (params) {
      try {
        const result = await axios.get(`/api/admin/orden/${params}`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async updateStateOrder (params) {
      try {
        const result = await axios.post(`/api/admin/orden/${params.orderId}/update`,params.body)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async getDataResumen (params) {
      try {
        const result = await axios.post(`/api/admin/estadistic`,params)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async getPromociones (params) {
      try {
        const result = await axios.get(`/api/admin/promociones`,{
          params
        })
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async getPromocion (params) {
      try {
        const result = await axios.get(`/api/admin/promocion/${params}`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
    async updatePromotion (form) {
      try {
        const result = await axios.post(`/api/admin/promocion`,form)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }
    },
    async sendDataPromocode (form) {
      try {
        const result = await axios.post(`/api/admin/addPromoCode`,form)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }
    },
    async inactivePromotion (form) {
      try {
        const result = await axios.get(`/api/admin/promocion/inactive/${form.promocode}/${form.state}`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      } 
    },
    async saveReferredCode (form) {
      try {
        const result = await axios.post(`/api/admin/createReferredCode`,form)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        return error.response.data
      }
    },
    async editReferredCode (form) {
      try {
        const result = await axios.post(`/api/admin/editReferredCode`,form)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        return error.response.data
      }
    },
    async sendImageAdmin (form) {
      try {
        const config = {headers: {
          'Content-Type': 'multipart/form-data'
        }}
        const result = await axios.post(`/api/admin/sendImage?idUser=${form.dni}`, form.file , config)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        console.log(error)
      }
    },
    async deleteClient (form) {
      try {
        const result = await axios.delete(`/api/admin/deleteClient/${form}`)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        return error.response.data
      }
    },
    async createUserAdmin (form) {
      try {
        const result = await axios.post(`/api/admin/createUserAdmin`,form)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        return error.response.data
      }
    },
    async getEgresos (params) {
      try {
        const result = await axios.get(`/api/admin/egresoeingresos`, {
          params
        })
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        return error.response.data
      }
    },
    async addegresos (form) {
      try {
        const result = await axios.post(`/api/admin/addegresos`,form)
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        return error.response.data
      }
    },
    async deleteItemEging (item) {
      try {
        const result = await axios.delete(`/api/admin/deleteItemEging/${item}`) 
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        return error.response.data
      }
    },
    async getUsersActives (params) {
      try {
        const result = await axios.get(`/api/admin/users/actives`, {
          params
        })
        if (result.data.success) {
          return result.data
        }
      } catch (error) {
        
      }   
    },
  },
  persist: {
    storage: sessionStorage, // data in sessionStorage is cleared when the page session ends.
  }
})