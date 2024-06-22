<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import { OrderResponse } from '@/dtos/orderDTO';
import OrderDetails from '@/components/OrderDetails.vue';

const props = defineProps<{ order: OrderResponse }>();

const emits = defineEmits(['close']);

const closeModal = () => {
  emits('close');
};
</script>

<template>
  <div class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <v-btn class="close-button" icon="mdi-close" style="z-index: 9999;" @click="closeModal"></v-btn>
      <OrderDetails :orderId="order.id" />
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  color: black;
  padding: 20px;
  border-radius: 8px;
  position: relative;
  width: 80%;
  max-width: 600px;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}
</style>
