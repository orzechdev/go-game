<template>
<app-layout toolbarTitle="Go Game">
    <router-view></router-view>
</app-layout>
</template>

<script>
import AppLayout from './components/AppLayout'

export default {
    components: {
        AppLayout
    },
    name: "App",
};
</script>
