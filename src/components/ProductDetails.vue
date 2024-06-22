<script setup lang="ts">
import { ref, watch } from 'vue';
import { ProductResponse } from '@/dtos/productDTO';
import defaultProductImage from '@/assets/dish-default-256.png'; 

const productInfo = ref<ProductResponse | null>(null);

const props = defineProps<{
  product: ProductResponse | null;
  storeId: string;
}>();

watch(() => props.product, (newValue) => {
  productInfo.value = newValue;
});
</script>

<template>
  <div>
    <div v-if="product">
      <img :src="product.image_url ? product.image_url : defaultProductImage" alt="Imagem do Produto" style="width: 100px; height: 100px;">
      <p>Title: {{ product.title }}</p>
      <p>Price: {{ product.price }}</p>
      <p v-if="product.hidden">Hidden: {{ product.hidden }}</p>
      <router-link :to="'/stores/' + storeId + '/products/' + product.id + '/edit'">Editar</router-link>
    </div>
  </div>
</template>
