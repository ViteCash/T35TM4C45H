<template>
    <div class="d-flex flex-column ga-8 ga-md-16 w-100 mt-16 mt-md-0">
        <div :class="`content-section-active ${'active' + sectionActive}`">
            <div class="d-flex" v-for="(item, index) in sections" :key="index">
                <div
                    :class="`item ${
                        sectionActive == index + 1
                            ? 'active'
                            : sectionActive === 4
                            ? 'active-global'
                            : ''
                    }`"
                >
                    {{ index + 1 }}
                </div>
                <div
                    :class="`circle-pass ${'active' + (index + 1)}`"
                    v-if="sections - 1 !== index"
                >
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </div>
        </div>
        <div>
            <UserDNIValidation
                v-if="sectionActive === 1"
                @send-data="clickPass1(2)"
            />
            <UserIDValidation
                v-if="sectionActive === 2"
                @send-data="clickPass1(3)"
            />
            <UserBankValidation
                v-if="sectionActive === 3"
                @send-data="clickPass1(4)"
            />
            <UserEndValidation v-if="sectionActive === 4" />
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

import UserEndValidation from '../components/UserEndValidation.vue'
import UserDNIValidation from '../components/UserDNIValidation.vue'
import UserIDValidation from '../components/UserIDValidation.vue'
import UserBankValidation from '../components/UserBankValidation.vue'

import { userUserStore } from '@/stores/user'

const userStore = userUserStore()
const sectionActive = ref(1)
const sections = ref(3)

const newlva = computed(() => userStore.getStateUser)

onMounted(async () => {
    const staeValidate = newlva.value
    sectionActive.value = parseInt(staeValidate)
})

const clickPass1 = (value) => {
    sectionActive.value = value
}
</script>

<style lang="scss" scoped>
.content-section-active {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 10px;
    .item {
        width: 40px;
        height: 40px;
        color: #005e81;
        text-align: center;
        justify-content: center;
        align-items: center;
        display: flex;
        font-family: 'Archivo-Bold';
        font-size: 18px;
        &.active {
            border-radius: 50%;
            background: #b9dfd9;
        }
        &.active-global {
            border-radius: 50%;
            background: #00acac;
        }
    }
    &.active0 {
        .item {
            border-radius: 50%;
            background: #b9dfd9;
        }
        .circle-pass {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 11px;
            div {
                width: 7px;
                height: 8px;
                transform: rotate(45deg);
                background: rgba(0, 172, 172, 0.25);
                margin: 0 5.5px;
                &:nth-child(2) {
                    background: rgba(0, 172, 172, 0.25);
                }
                &:nth-child(3) {
                    background: rgba(0, 172, 172, 0.25);
                }
            }
        }
    }
    &.active1 {
        .circle-pass {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 11px;
            &.active1 {
                div {
                    width: 7px;
                    height: 8px;
                    transform: rotate(45deg);
                    background: #00acac;
                    margin: 0 5.5px;
                    &:nth-child(2) {
                        background: rgba(0, 172, 172, 0.5);
                    }
                    &:nth-child(3) {
                        background: rgba(0, 172, 172, 0.25);
                    }
                }
            }
            div {
                width: 7px;
                height: 8px;
                transform: rotate(45deg);
                background: rgba(0, 172, 172, 0.25);
                margin: 0 5.5px;
                &:nth-child(2) {
                    background: rgba(0, 172, 172, 0.25);
                }
                &:nth-child(3) {
                    background: rgba(0, 172, 172, 0.25);
                }
            }
        }
    }

    &.active2 {
        .circle-pass {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 11px;
            &.active2 {
                div {
                    width: 7px;
                    height: 8px;
                    transform: rotate(45deg);
                    background: rgba(0, 172, 172, 0.25);
                    margin: 0 5.5px;
                    &:nth-child(2) {
                        background: rgba(0, 172, 172, 0.25);
                    }
                    &:nth-child(3) {
                        background: rgba(0, 172, 172, 0.25);
                    }
                }
            }
            div {
                width: 7px;
                height: 8px;
                transform: rotate(45deg);
                background: rgba(0, 172, 172, 0.25);
                margin: 0 5.5px;
                &:nth-child(2) {
                    background: rgba(0, 172, 172, 0.25);
                }
                &:nth-child(3) {
                    background: #00acac;
                }
            }
        }
    }

    &.active3 {
        .circle-pass {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 11px;
            &.active1 {
                div {
                    width: 7px;
                    height: 8px;
                    transform: rotate(45deg);
                    background: rgba(0, 172, 172, 0.25);
                    margin: 0 5.5px;
                    &:nth-child(2) {
                        background: rgba(0, 172, 172, 0.25);
                    }
                    &:nth-child(3) {
                        background: rgba(0, 172, 172, 0.25);
                    }
                }
            }
            &.active3 {
                div {
                    width: 7px;
                    height: 8px;
                    transform: rotate(45deg);
                    background: rgba(0, 172, 172, 0.25);
                    margin: 0 5.5px;
                    &:nth-child(2) {
                        background: rgba(0, 172, 172, 0.25);
                    }
                    &:nth-child(3) {
                        background: rgba(0, 172, 172, 0.25);
                    }
                }
            }
            div {
                width: 7px;
                height: 8px;
                transform: rotate(45deg);
                background: rgba(0, 172, 172, 0.25);
                margin: 0 5.5px;
                &:nth-child(2) {
                    background: rgba(0, 172, 172, 0.5);
                }
                &:nth-child(3) {
                    background: #00acac;
                }
            }
        }
    }

    &.active4 {
        .circle-pass {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 11px;
            div {
                width: 7px;
                height: 8px;
                transform: rotate(45deg);
                background: #00acac;
                margin: 0 5.5px;
            }
        }
    }
}
</style>
