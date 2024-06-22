<template>
  <v-app>
    <v-main>
      <UserNavigation />

      <div>
        <div><LinkPathNav :route="`stores/${storeId}`" :clickableSegments="[0, 1]" /></div>
        <div class="ml-6">
          <h1 class="text-3xl font-bold">Store</h1>
        </div>
        <div v-if="store">
          <v-card class="mx-auto" max-width="400">
              <v-img
                :src="store.image_url ? store.image_url : defaultShopImage"
                height="200"
                class="text-white"
                cover
                gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.5)"
              >
                <v-card-title>
                  <v-icon v-if="store.hidden">mdi-eye-off</v-icon>
                  {{ store.name }}
                </v-card-title>
              </v-img>

              <v-card-subtitle class="pt-4">
                Created at: {{ store.created_at }}
              </v-card-subtitle>

              <v-card-actions>
                <router-link :to="{ path: '/stores/' + store.id }">
                  <v-btn color="blue">Voltar</v-btn>
                </router-link>
                <router-link :to="{ path: '/stores/' + store.id + '/edit' }">
                  <v-btn color="orange">Editar</v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
        </div>
        <div class="ml-6 mt-4">
          <h2 class="text-3xl font-bold ">Products</h2>
          <router-link :to=" { path: `/stores/${storeId}/products/new`}">
            <v-btn class="bg-red-accent-4 mt-4" prepend-icon="mdi-plus">
              Novo Produto
            </v-btn>
          </router-link>
        </div>
        <div v-if="products.length > 0">
          <v-row class="mt-5 ml-5 mr-5">
            <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4" lg="3">
              <v-card class="mx-auto" max-width="400">
                <v-img
                  :src="product.image_url ? product.image_url : defaultShopImage"
                  height="200"
                  class="text-white"
                  cover
                  gradient="to bottom, rgba(0,0,0,.5), rgba(0,0,0,.5)"
                >
                  <v-card-title>
                  <v-icon v-if="product.hidden">mdi-eye-off</v-icon>
                    {{ product.title }}
                  </v-card-title>
                </v-img>

                <v-card-subtitle class="pt-4">
                  #{{ product.id }}
                </v-card-subtitle>
                <v-card-text>
                  <div v-if="product.expires_at">
                    <Countdown :expires-at="product.expires_at" />
                  </div>
                  <div v-else>
                    ⠀
                  </div>
                  <div class="font-bold">{{product.price ? product.price  : '⠀'}}</div>
                </v-card-text>
                <v-card-actions>
                  <router-link :to="{ path: `/stores/${storeId}/products/${product.id}/edit` }">
                    <v-btn color="orange">Editar</v-btn>
                  </router-link>
                  <v-btn color="red" @click="openDeleteModal(product)">Deletar</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <div v-if="isStoreLoaded  && pagination.next" class="text-center m-6">
            <v-btn color="red-accent-4" @click="fetchMoreProducts">Carregar mais produtos</v-btn>
          </div>
          <v-dialog v-model="dialogDelete" max-width="500">
            <v-card>
              <v-card-title class="headline">
                Confirmar Exclusão
              </v-card-title>
              <v-card-text>
                Tem certeza que deseja deletar o produto "{{ selectedProduct.title }}"? É uma ação permanente!
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogDelete = false">
                  Cancelar
                </v-btn>
                <v-btn color="red darken-1" text @click="confirmDelete">
                  Deletar
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </div>
        <div v-else>
          <p>Não há produtos disponíveis.</p>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getStore } from '@/api/storeAPI';
import { getAllStoreProducts, deleteStoreProduct } from '@/api/productAPI';
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage';
import defaultShopImage from '@/assets/shop-default-256.png';
import { StoreResponse, ProductResponse, Pagination } from '@/dtos/storeDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';
import Countdown from '@/components/CountdownProduct.vue';
import UserNavigation from '@/components/UserNavigation.vue';

const route = useRoute();
const router = useRouter();

const errorMessage = ref('');
const store = ref<StoreResponse | null>(null);
const products = ref<ProductResponse[]>([]);
const storeId = route.params.storeId as string;
const pagination = ref<Pagination>({ current: 1, pages: 1 });

const isStoreLoaded = ref(false);
const dialogDelete = ref(false);
const selectedProduct = ref<ProductResponse | null>(null);

onMounted(() => {
  fetchStore();
});

const fetchStore = async () => {
  try {
    const response = await getStore(storeId);
    store.value = response;
    isStoreLoaded.value = true;
    fetchProducts();
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    console.log(errorMessage.value);
  }
};

const fetchProducts = async () => {
  if (!isStoreLoaded.value) {
    return;
  }

  try {
    const response = await getAllStoreProducts(storeId);
    products.value = response.products;
    pagination.value = response.pagination;
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    console.log(errorMessage.value);
  }
};

const fetchMoreProducts = async () => {
  if (!isStoreLoaded.value || !pagination.value.next) {
    return;
  }

  try {
    const response = await getAllStoreProducts(storeId, pagination.value.next);
    products.value = [...products.value, ...response.products];
    pagination.value = response.pagination;
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    console.log(errorMessage.value);
  }
};

const openDeleteModal = (product: ProductResponse) => {
  selectedProduct.value = product;
  dialogDelete.value = true;
};

const confirmDelete = async () => {
  try {
    await deleteStoreProduct(storeId, selectedProduct.value.id);
    fetchProducts()
    dialogDelete.value = false;
  } catch (error) {
    // errorMessage.value = standardizeErrorMessage(error);
  }
};
</script>