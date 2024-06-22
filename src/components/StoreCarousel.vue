<script setup lang="ts">
import { ref } from 'vue';
import { StoreResponse } from '@/dtos/storeDTO';
import { Pagination } from '@/dtos/paginationDTO';
import defaultProductImage from '../assets/shop-default-256.png'

const props = defineProps({
  stores: Array as () => StoreResponse[],
  storePagination: Object as () => Pagination
});
const emit = defineEmits(['store-selected', 'load-more']);

const selectedStoreId = ref(null);

const selectStore = (storeId) => {
  selectedStoreId.value = storeId;
  emit('store-selected', storeId);
};

const loadMore = () => {
  emit('load-more');
};
</script>

<template>
  <div class="carousel-container">
    <div class="carousel">
      <div v-for="store in stores" :key="store.id" @click="selectStore(store.id)">
        <div class="store-container">
          <div :class="{ 'store-item': true, 'active': store.id === selectedStoreId }">
            <img :src="store.image_url ? store.image_url : defaultProductImage" alt="Store image" style="width: 100px; height: 100px;"/>
            <span>{{ store.name }}</span>
          </div>
        </div>
      </div>
      <div><button @click="loadMore" v-if="storePagination.next">Carregar Mais</button></div>
    </div>
  </div>
</template>

<style scoped>
.carousel-container {
  width: 100%;
  height: 300px;
  overflow-x: auto;
  overflow-y: hidden;
}

.carousel {
  display: flex;
  padding-bottom: 20px;
}

.store-container {
  padding: 10px;
}

.store-item {
  cursor: pointer;
  padding: 10px;
}

.store-item.active {
  border: 2px solid blue;
}

.new-order-indicator {
  color: red;
  font-size: 20px;
}
</style>