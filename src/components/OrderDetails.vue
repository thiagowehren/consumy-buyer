<template>
  <v-app>
    <v-main>
      <template v-if="!props.orderId">
        <UserNavigation />
      </template>

      <div v-if="order" class="order-details">
        <div><LinkPathNav :route="`orders/${orderId}`" :clickableSegments="[0, 1]" /></div>

        <h2 class="text-3xl font-bold ml-4">Detalhes do Pedido</h2>
        <div class="flex ml-4 mt-4 mb-4 space-x-4">
          <v-card :class="getOrderCardClass(order.state)">
            <v-card-title>ID: #{{ order.id }}</v-card-title>
            <v-card-text>Total: {{ order.total_price }}</v-card-text>
            <v-card-text>Criado em: {{ order.created_at }}</v-card-text>
            <v-card-subtitle>Status: {{ order.state }}</v-card-subtitle>
          </v-card>
          <div>
            <h3>Ações</h3>
            <div class="order-action flex flex-col space-y-2">
              <v-btn
                color="light-blue-darken-3"
                :disabled="!isStateActive('accept')"
                @click.prevent="isStateActive('accept')? handleUpdateOrderState(order.id, 'accept') : null"
              >Aceitar</v-btn>

              <v-btn
                color="green-darken-4"
                :disabled="!isStateActive('dispatch')"
                @click.prevent="isStateActive('dispatch')? handleUpdateOrderState(order.id, 'dispatch') : null"
              >Enviar</v-btn>

              <v-btn
                color="red"
                :disabled="!isStateActive('cancel')"
                @click.prevent="isStateActive('cancel')? handleUpdateOrderState(order.id, 'cancel') : null"
              >Cancelar</v-btn>
            </div>
          </div>
        </div>
        
        <h3 class="text-3xl font-bold ml-4">Itens do Pedido</h3>
        <div v-if="order.order_items && order.order_items.length" class="table-container">
          <table class="order-items-table">
            <thead>
              <tr>
                <th>Imagem</th>
                <th>Produto</th>
                <th>Preço</th>
                <th>Qtde</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in order.order_items" :key="index">
                <td><img :src="item.product.image_url || defaultProductImage" :alt="'Imagem da loja'" class="product-image" /></td>
                <td>{{ item.product.title }}</td>
                <td>{{ calculateOriginalPrice(item) }}</td>
                <td>{{ item.amount }}</td>
                <td>{{ item.total_price}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-else>
        <p>Carregando detalhes do pedido...</p>
      </div>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { getOrder, updateOrderState } from '@/api/orderAPI';
import { OrderResponse, OrderItem } from '@/dtos/orderDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';
import UserNavigation from '@/components/UserNavigation.vue';
import defaultProductImage from '@/assets/dish-default-256.png';

const props = defineProps<{ orderId?: string | number }>();
const route = useRoute();
const orderId = props.orderId || route.params.orderId as string;
const order = ref<OrderResponse | null>(null);

const fetchOrder = async () => {
  try {
    const response = await getOrder(orderId);
    order.value = response.order;
  } catch (error) {
    console.error('Failed to fetch order details', error);
  }
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

const handleUpdateOrderState = async (orderId: string, state: string) => {
  try {
    const updatedOrder = await updateOrderState(orderId, state);
    order.value = updatedOrder;
    fetchOrder();
  } catch (error) {
    // console.error(`Failed to update order state to ${state}`, error);
  }
};

const isStateActive = (state: string) => {
  return order.value && order.value.possible_states.includes(state);
};

// currency: R$
const calculateOriginalPrice = (item: OrderItem): string => {
  const originalPrice = parseFloat(item.total_price.replace('R$ ', '').replace(',', '.')) / item.amount;
  return `R$ ${originalPrice.toFixed(2).replace('.', ',')}`;
};

onMounted(fetchOrder);

watchEffect(() => {
  if (order.value) {
    // console.log('Order updated:', order.value);
  }
});
</script>

<style scoped>

.table-container {
  margin: 20px auto;
  width: 90%;
}

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

.table-container {
  margin-left: auto;
  margin-right: auto;
}

.order-details {
  background: white;
  color: black;
}

.order-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.product-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.order-action {
  margin-top: 20px;
}

.active {
  cursor: pointer;
}

.inactive {
  background-color: darkgrey;
  cursor: not-allowed;
}
</style>