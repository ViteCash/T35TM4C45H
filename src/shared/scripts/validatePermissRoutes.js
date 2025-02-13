import { userAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

export function validateRoutes(value) {
    if (value === 'user') {
        value = 'users'
    }
    if (value === 'pago') {
        value = 'pagos'
    }

    const authStore = userAuthStore()
    const router = useRouter()

    let module = authStore.user.modulePermissions.find(
        (dt) => dt.module.view === value
    )
    if (module) {
        return module.edit === 0 ? false : true
    } else {
        router.push('/dashboard/')
    }
}
