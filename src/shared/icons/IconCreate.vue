<template>
    <svg
        :height="size"
        :width="size"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 -960 960 960"
        fill="#FFFFFF"
    >
        <path
            d="M646.67-127.67v-120h-120v-66.66h120v-120h66.66v120h120v66.66h-120v120h-66.66ZM160-240v-66.67h288.33q-1 18.34-.83 32.67.17 14.33 3.17 34H160Zm0-164v-66.67h384q-19.17 13.53-34.58 30.43Q494-423.33 482-404H160Zm0-164.67v-66.66h600v66.66H160Zm0-164.66V-800h600v66.67H160Z"
        />
    </svg>
</template>
<script setup>
const props = defineProps(['size'])
</script>
