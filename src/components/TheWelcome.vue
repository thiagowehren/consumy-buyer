<script setup>
import { ref } from 'vue'
import { RouterLink } from 'vue-router';
import UserNavigation from '@/components/UserNavigation.vue';
import StoreSpotlight from '@/components/StoreSpotlight.vue';
import defaultShopImage from '@/assets/shop-default-256.png';
import { Auth } from '@/auth';

const auth = new Auth()
const isLoggedIn = ref(auth.isLoggedIn())

</script>

<template>
  <div class="flex flex-col min-h-screen">
    <header class="">
      <UserNavigation />
    </header>
    <template v-if="isLoggedIn">
      <StoreSpotlight />
    </template>
    
    <template v-else>
      <div class="flex flex-1 items-center justify-between px-12">
        <div class="max-w-lg">
          <h1 class="text-6xl font-bold leading-tight mb-4">Vendedores <span class="text-red-accent-4">DELIVERY</span></h1>
          <p class="text-lg text-gray-600 mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit ut aliquam, purus sit amet luctus venenatis, lectus magna fringilla urna, porttitor rhoncus dolor purus non enim.</p>
          <RouterLink :to="{ name: 'about' }">
                <button class="bg-black text-white text-xl px-4 py-3 rounded hover:bg-blue-700">Sobre</button>
              </RouterLink>
        </div>
        <div class="flex space-x-4">
          <div class="flex flex-col space-y-4">
            <div class="bg-orange-lighten-1 rounded-full w-40 h-20"></div>
            <div class="bg-light-green-accent-1 rounded-full w-40 h-40 flex items-center justify-center">
              <img :src="defaultShopImage" alt="Shop Default Image" class="rounded-full w-24 h-24 object-cover">
            </div>
          </div>
          <div class="flex flex-col space-y-4">
            <div class="bg-red-accent-1 rounded-full w-40 h-40"></div>
            <div class="bg-orange-lighten-5 rounded-full w-40 h-20"></div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>