<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getAllUserOrders } from '@/api/orderAPI';
import { OrderResponse } from '@/dtos/orderDTO';
import { StoreResponse } from '@/dtos/storeDTO';
import { Pagination } from '@/dtos/paginationDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';
import UserNavigation from '@/components/UserNavigation.vue';
import OrderModal from '@/components/OrderModal.vue';
import defaultShopImage from '@/assets/shop-default-256.png';

const orders = ref<OrderResponse[]>([]);
const orderPagination = ref<Pagination>({ current: 1, pages: 1 });
const dialogOrderDetails = ref(false);
const selectedOrder = ref<OrderResponse | null>(null);

onMounted(() => {
  fetchOrders(1);
});


const fetchOrders = async (page = 1) => {
  if (page === 1) {
    orders.value = [];
  }

  try {
    const response = await getAllUserOrders(page);
    orders.value.push(...response.orders);
    orderPagination.value = response.pagination;
  } catch (error) {
    console.error('Failed to fetch orders', error);
  }
};

const fetchMoreOrders = () => {
  if (orderPagination.value.next) {
    fetchOrders(orderPagination.value.current + 1);
  }
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
          <h1 class="text-3xl font-bold ">Meus Pedidos</h1>
        </div>
        <p v-if="orders.length === 0">Aviso: Não há histórico de pedidos.</p>
      </section>

      <section>
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
  background-color: #0000ff;
}

.bg-green {
  background-color: #00ff00;
}

.bg-light-blue {
  background-color: #87ceeb;
}

.bg-orange {
  background-color: #ffa500;
}

.bg-grey {
  background-color: #d3d3d3;
}

.bg-red {
  background-color: #ff0000;
}

.order-card {
  cursor: pointer;
  margin-bottom: 1rem;
}
</style>
