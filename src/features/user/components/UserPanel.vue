<template>
    <div
        class="d-flex flex-column ga-md-8 ga-5 my-12 w-100 justify-center align-center"
        style="animation: EntrarRight 0.9s ease"
    >
        <h4 class="text-h4 text-blue-2 text-center">{{ title }}</h4>
        <slot />
    </div>
</template>
<script setup>
const props = defineProps(['title'])
</script>
