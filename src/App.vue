<template>
    <v-app>
        <component :is="layout">
            <v-main>
                <router-view v-slot="{ Component }">
                    <transition name="route" mode="out-in">
                        <component :is="Component" />
                    </transition>
                </router-view>
            </v-main>
        </component>
    </v-app>
</template>

<script>
export default {
    name: 'App',

    computed: {
        layout() {
            return this.$route.meta.layout
        }
    }
}
</script>
