<template>
    <div class="d-flex justify-center align-center h-100">
        <v-row class="contents-row" no-gutters>
            <v-col cols="7" v-if="!isMobile">
                <div
                    class="banner h-100 d-flex justify-center align-center position-relative"
                >
                    <slot name="left" />
                </div>
            </v-col>
            <v-col
                class="d-flex flex-column justify-center align-center"
                :cols="isMobile ? `12` : `5`"
            >
                <div class="d-flex flex-column align-center py-6 ga-5 ga-md-10">
                    <div class="text-center">
                        <a href="/login">
                            <img
                                class="w-75"
                                src="@/assets/images/Logo.png"
                                alt="Logo"
                            />
                        </a>
                    </div>
                    <slot name="right" />
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
import { useDisplay } from 'vuetify'
import { computed } from 'vue'

const { mobile } = useDisplay()
const isMobile = computed(() => mobile.value)
</script>

<style lang="scss">
.banner img {
    position: absolute;
    &.frame {
        animation: EntrarLeft 1.5s ease;
        z-index: 1;
        width: calc(100% - 200px);
        height: auto;
    }
    @media screen and (min-width: 1441px) {
        width: calc(100% - 300px) !important;
    }
}
</style>
