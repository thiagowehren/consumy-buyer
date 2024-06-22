<template>
  <div v-if="expiresAt" >
    <span class="bg-red-600 text-white rounded">{{ formattedTime }}</span>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, onUnmounted } from 'vue';

const props = defineProps<{
  expiresAt: string;
}>();

const formattedTime = ref('');

function calculateTimeLeft() {
  const now = new Date().getTime();
  const expirationDate = new Date(props.expiresAt).getTime();
  const diff = expirationDate - now;

  let timeLeft = {};

  if (diff > 0) {
    timeLeft = {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / 1000 / 60) % 60),
      seconds: Math.floor((diff / 1000) % 60)
    };
  }

  formattedTime.value = `${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`;
}

const intervalId = setInterval(calculateTimeLeft, 1000);

onUnmounted(() => {
  clearInterval(intervalId);
});
</script>
