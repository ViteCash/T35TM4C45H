<template>
    <div
        class="d-flex flex-column ga-6 my-16 my-lg-0 w-100 justify-center align-center"
        style="animation: EntrarRight 0.9s ease"
    >
        <v-row class="w-100">
            <v-col cols="3" class="text-start px-0">
                <slot name="leftBtn" />
            </v-col>
            <v-col cols="6"
                ><h4 class="text-h4 text-blue-2 text-center">{{ title }}</h4>
            </v-col>
            <v-col cols="3" class="text-end px-0">
                <slot name="rightBtn" />
            </v-col>
        </v-row>

        <div
            class="d-flex ga-5 flex-column flex-grow-1 w-100 overflow-y-auto overflow-x-hidden pa-1 pr-4"
        >
            <slot />
        </div>
    </div>
</template>
<script setup>
const props = defineProps(['title'])
</script>
