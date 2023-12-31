<script setup>
import { RouterView } from "vue-router";
import Navbar from './components/Navbar.vue';

</script>
<template>
  <div>
    <Navbar/>
    <RouterView  class="pt-5"/>
  </div>
</template>