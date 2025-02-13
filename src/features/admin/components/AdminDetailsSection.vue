<template>
    <section class="d-flex flex-column ga-5 w-100">
        <h5 class="text-h5 text-lagoon-shade border-b-md pb-2 border-info">
            {{ title }}
        </h5>
        <slot />
    </section>
</template>
<script setup>
defineProps(['title'])
</script>
