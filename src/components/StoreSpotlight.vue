<template>
  <div class="px-12 py-8">
    <div class="flex justify-between space-x-2">
      <div class="flex flex-1 flex-col space-y-8">
        <h2 class="text-2xl font-bold mb-4">Destaques ({{ stores.length }})</h2>
        <div v-if="stores.length > 0" class="mr-4">
          <div v-for="store in stores" :key="store.id" class="bg-white rounded-lg p-4 shadow-md flex items-center mb-4">
            <img :src="store.image_url ? store.image_url : defaultStoreImage" alt="Imagem da Loja" class="w-40 h-40 object-cover rounded-lg mr-4">
            <div>
              <h3 class="text-lg font-semibold mb-2">{{ store.name }}</h3>
              <ul v-if="store.products && store.products.length > 0">
                <li v-for="product in store.products.slice(0, 3)" :key="product.id" class="flex items-center space-x-2 mb-2">
                  <img :src="product.image_url ? product.image_url : defaultProductImage" alt="Imagem do Produto" class="w-16 h-16 object-cover rounded-full">
                  <span class="text-gray-600">{{ product.title }}</span>
                  <span class="text-gray-400">{{ product.price }}</span>
                </li>
              </ul>
              <p v-else class="text-gray-600">Nenhum produto disponível para ser destacado.</p>
            </div>
          </div>
        </div>
        <div v-else>
          <p class="text-gray-600">
            Nenhuma loja disponível para ser destacada, crie uma
            <RouterLink :to="{ name: 'store-new' }">
              <v-btn color="red" density="compact" variant="text">
                nova loja
              </v-btn>
            </RouterLink>
          </p>
        </div>
      </div>
      <div class="flex flex-col space-y-4 ml-24">
        <div class="bg-orange-lighten-1 rounded-full w-20 h-20"></div>
        <div class="bg-light-green-accent-1 rounded-full w-20 h-20"></div>
        <div class="bg-red-accent-1 rounded-full w-20 h-20"></div>
        <div class="bg-orange-lighten-5 rounded-full w-20 h-20"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getAllStores } from '@/api/storeAPI';
import { getAllStoreProducts } from '@/api/productAPI';
import defaultStoreImage from '@/assets/shop-default-256.png';
import defaultProductImage from '@/assets/dish-default-256.png';

const stores = ref([]);

const fetchStores = async () => {
  try {
    const response = await getAllStores({ limit: 3, sortBy: 'createdAt', sortOrder: 'desc' });
    const fetchedStores = response.stores.slice(0, 3);

    for (let i = 0; i < fetchedStores.length; i++) {
      const store = fetchedStores[i];
      const productsResponse = await getAllStoreProducts(store.id);
      store.products = productsResponse.products.slice(0, 3);
    }

    stores.value = fetchedStores;
  } catch (error) {
    // console.error(error);
  }
};

onMounted(fetchStores);
</script>