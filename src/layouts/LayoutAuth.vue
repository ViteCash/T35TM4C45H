<script setup>
import Loading from '@/shared/components/LoadingGeneral.vue'
</script>

<template>
    <v-layout class="rounded rounded-md">
        <Loading />
        <v-main class="relative" relative style="min-height: 300px">
            <router-view v-slot="{ Component }">
                <transition name="route" mode="out-in">
                    <component :is="Component"></component>
                </transition>
            </router-view>
        </v-main>
    </v-layout>
</template>
