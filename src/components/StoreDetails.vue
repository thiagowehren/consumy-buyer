<template>
  <v-app>
    <v-main>
      <UserNavigation />

      <div>
        <div><LinkPathNav :route="`stores/${storeId}`" :clickableSegments="[0, 1]" /></div>
        <div class="ml-6">
          <h1 class="text-3xl font-bold">Lojas</h1>
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
                  {{ store.name }}
                </v-card-title>
              </v-img>

              <v-card-subtitle class="pt-4">
                Created at: {{ store.created_at }}
              </v-card-subtitle>

              <v-card-actions>
                <router-link :to="{ path: '/stores/' }">
                  <v-btn color="blue">Voltar</v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
        </div>
        <div class="ml-6 mt-4">
          <h2 class="text-3xl font-bold ">Produtos</h2>
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
                  <v-btn color="green" class="text-black" prepend-icon="mdi-cart" variant="flat" @click="openCartInsertionModal(product)">Adicionar</v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <div v-if="isStoreLoaded && pagination.next" class="text-center m-6">
            <v-btn color="red-accent-4" @click="fetchMoreProducts">Carregar mais produtos</v-btn>
          </div>
          <v-dialog v-model="dialogCart" max-width="600">
            <v-card>
              <v-card-title class="headline">
                Adicionar ao Carrinho
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <table class="order-items-table">
                      <thead>
                        <tr>
                          <th>Imagem</th>
                          <th>Produto</th>
                          <th>Preço</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td><img :src="selectedProduct.image_url || defaultProductImage" :alt="'Imagem do produto'" class="product-image" /></td>
                          <td>{{ selectedProduct.title }}</td>
                          <td>{{ selectedProduct.price }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" class="text-center mt-4">
                    <div>Quantidade:</div>
                    <v-row align="center" justify="center">
                      <v-col cols="4">
                        <v-btn icon @click="decrementAmount"><v-icon>mdi-minus</v-icon></v-btn>
                      </v-col>
                      <v-col cols="4">
                        <v-text-field v-model="amount" type="number" min="1" class="text-center"></v-text-field>
                      </v-col>
                      <v-col cols="4">
                        <v-btn icon @click="incrementAmount"><v-icon>mdi-plus</v-icon></v-btn>
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue darken-1" text @click="dialogCart = false">
                  Cancelar
                </v-btn>
                <v-btn color="green darken-1" text @click="confirmCartInsertion">
                  Adicionar
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
import { getAllStoreProducts } from '@/api/productAPI';
import { useCartStore } from '@/stores/cartStore';
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage';
import defaultShopImage from '@/assets/shop-default-256.png';
import defaultProductImage from '@/assets/dish-default-256.png';
import { StoreResponse, ProductResponse, Pagination } from '@/dtos/storeDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';
import Countdown from '@/components/CountdownProduct.vue';
import UserNavigation from '@/components/UserNavigation.vue';

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();

const errorMessage = ref('');
const store = ref<StoreResponse | null>(null);
const products = ref<ProductResponse[]>([]);
const storeId = route.params.storeId as string;
const pagination = ref<Pagination>({ current: 1, pages: 1 });

const isStoreLoaded = ref(false);
const dialogCart = ref(false);
const selectedProduct = ref<ProductResponse | null>(null);
const amount = ref<number>(1);

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

const openCartInsertionModal = (product: ProductResponse) => {
  selectedProduct.value = product;
  dialogCart.value = true;
  amount.value = 1;
};

const confirmCartInsertion = () => {
  if (selectedProduct.value) {
    cartStore.addToCart({
      ...selectedProduct.value,
      amount: amount.value
    });
    dialogCart.value = false;
  }
};

const incrementAmount = () => {
  amount.value++;
};

const decrementAmount = () => {
  if (amount.value > 1) {
    amount.value--;
  }
};
</script>

<style scoped>
.order-items-table {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
}

.order-items-table th,
.order-items-table td {
  padding: 12px;
  text-align: left;
}

.order-items-table th {
  background-color: #f5f5f5;
  color: #333333;
  font-weight: bold;
}

.order-items-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.order-items-table tbody tr:hover {
  background-color: #f0f0f0;
}

.product-image {
  width: 50px;
  height: 50px;
}
</style>
