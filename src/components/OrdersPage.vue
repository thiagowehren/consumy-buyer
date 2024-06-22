<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllStores } from '@/api/storeAPI';
import { getAllStoreOrders } from '@/api/orderAPI';
import { OrderResponse } from '@/dtos/orderDTO';
import { StoreResponse } from '@/dtos/storeDTO';
import { Pagination } from '@/dtos/paginationDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';
import UserNavigation from '@/components/UserNavigation.vue';
import OrderModal from '@/components/OrderModal.vue';
import defaultShopImage from '@/assets/shop-default-256.png';

const stores = ref<StoreResponse[]>([]);
const orders = ref<OrderResponse[]>([]);
const currentStoreId = ref<string | null>(null);
const storePagination = ref<Pagination>({ current: 1, pages: 1 });
const orderPagination = ref<Pagination>({ current: 1, pages: 1 });
const dialogOrderDetails = ref(false);
const selectedOrder = ref<OrderResponse | null>(null);

onMounted(() => {
  fetchStores();
});

const fetchStores = async (page = 1) => {
  try {
    const response = await getAllStores(page);
    stores.value.push(...response.stores);
    storePagination.value = response.pagination;
  } catch (error) {
    console.error('Failed to fetch stores', error);
  }
};

const fetchOrders = async (storeId: string, page = 1) => {
  if (currentStoreId.value && page === 1) {
    orders.value = [];
  }

  try {
    const response = await getAllStoreOrders(storeId, page);
    orders.value.push(...response.orders);
    orderPagination.value = response.pagination;
  } catch (error) {
    console.error('Failed to fetch orders', error);
  }
};

const fetchMoreStores = () => {
  if (storePagination.value.next) {
    fetchStores(storePagination.value.current + 1);
  }
};

const fetchMoreOrders = () => {
  if (orderPagination.value.next) {
    fetchOrders(currentStoreId.value as string, orderPagination.value.current + 1);
  }
};

const handleStoreSelected = (storeId: string) => {
  currentStoreId.value = storeId;
  fetchOrders(currentStoreId.value);
};

const openOrderDetails = (order: OrderResponse) => {
  selectedOrder.value = order;
  dialogOrderDetails.value = true;
};

const getOrderCardClass = (state: string) => {
  switch (state) {
    case 'completed':
      return 'bg-grey-darken-4';
    case 'created':
      return 'bg-light-blue-darken-3';
    case 'accepted':
      return 'bg-green-darken-4';
    case 'dispatched':
      return 'bg-indigo-darken-2';
    case 'cancelled':
      return 'bg-grey-darken-2';
    default:
      return 'bg-grey';
  }
};

const closeModal = () => {
  selectedOrder.value = null;
};
</script>

<template>
  <v-app>
    <v-main>
      <UserNavigation />
      <div>
        <LinkPathNav :route="`/orders`" :clickableSegments="[0]" />
      </div>

      <section>
        <div class="ml-6">
          <h1 class="text-3xl font-bold ">Orders</h1>
        </div>
        <p v-if="stores.length === 0">Aviso: Não há lojas para serem selecionadas.</p>

        <div class="store-carousel bg-grey-lighten-4 mx-10">
          <div 
          class="store-item" 
          v-for="store in stores" 
          :key="store.id" 
          @click="handleStoreSelected(store.id)"
          :class="{ 'active': store.id === currentStoreId }">
          
            <v-card>
              <v-img :src="store.image_url ? store.image_url : defaultShopImage" height="150px" width="150px" cover></v-img>
              <v-card-title class="text-center">{{ store.name }}</v-card-title>
            </v-card>
          </div>
          <v-btn icon @click="fetchMoreStores" class="load-more-btn mr-4">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </section>

      <section>
        <div class="ml-6">
          <h2 class="text-3xl font-bold ">Pedidos da loja selecionada</h2>
        </div>
        <div v-if="!currentStoreId">
          <p class="mt-4 ml-6">Selecione uma loja antes de visualizar os pedidos.</p>
        </div>
        <div v-else-if="orders.length === 0">
          <p class="mt-4 ml-6">Não há pedidos disponíveis para esta loja.</p>
        </div>
        <div v-else>
          <v-container fluid>
            <v-row>
              <v-col
                v-for="order in orders"
                :key="order.id"
                cols="12"
                sm="6"
                md="4"
                class="order-card"
                @click="openOrderDetails(order)"
              >
                <v-card :class="getOrderCardClass(order.state)">
                  <v-card-title>#{{ order.id }}</v-card-title>
                  <v-card-text>{{ order.total_price }}</v-card-text>
                  <v-card-subtitle>status: {{ order.state }}</v-card-subtitle>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
          <div v-if="orderPagination.next" class="text-center m-6">
            <v-btn color="red-accent-4" @click="fetchMoreOrders">Carregar Mais Pedidos</v-btn>
          </div>
        </div>
      </section>

      <OrderModal v-if="selectedOrder" :order="selectedOrder" @close="closeModal" />
    </v-main>
  </v-app>
</template>

<style scoped>
.store-carousel {
  display: flex;
  overflow-x: auto;
  padding: 1rem 0;
  max-width: 100%;
  white-space: nowrap;
  margin-bottom: 1rem;
  gap: 1rem;
}

.store-item {
  flex: 0 0 auto;
  cursor: pointer;
  max-width: 150px;
}

.store-item v-card {
  max-width: 150px;
}

.load-more-btn {
  flex: 0 0 auto;
  align-self: center;
}

.v-container {
  max-width: 100%;
  overflow-x: hidden;
}

.bg-blue {
  background-color: #0000ff; /* Azul */
}

.bg-green {
  background-color: #00ff00; /* Verde */
}

.bg-light-blue {
  background-color: #87ceeb; /* Azul Claro */
}

.bg-orange {
  background-color: #ffa500; /* Laranja */
}

.bg-grey {
  background-color: #d3d3d3; /* Cinza */
}

.bg-red {
  background-color: #ff0000; /* Vermelho */
}

.order-card {
  cursor: pointer;
  margin-bottom: 1rem;
}

.store-item.active {
  border: 2px solid blue;
}
</style>
