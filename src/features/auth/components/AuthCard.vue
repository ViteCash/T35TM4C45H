<template>
    <section
        class="d-flex flex-column ga-8 elevation-3 rounded-xl pa-8"
        :class="isMobile ? '' : 'w-98'"
    >
        <h1
            class="text-center text-h4 text-lagoon-shade font-weight-medium"
            style="white-space: normal; word-wrap: break-word"
        >
            {{ title }}
        </h1>
        <div class="d-flex flex-column h-100">
            <slot />
        </div>
    </section>
</template>
<script setup>
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

const { smAndDown } = useDisplay()
const isMobile = computed(() => smAndDown.value)

const props = defineProps(['title'])
</script>

<style lang="scss">
.w-98 {
    width: 394px;
}
</style>
