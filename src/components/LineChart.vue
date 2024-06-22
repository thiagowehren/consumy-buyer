<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full md:w-full lg:w-3/4 h-auto">
      <h2 class="flex justify-center">Vendas dos últimos (30 dias)</h2>
      <canvas id="line-chart"></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Chart from 'chart.js/auto';
import 'chartjs-adapter-date-fns';

interface PointDetails {
  x: string;
  y: number;
}

const props = defineProps<{
  data: PointDetails[];
}>();

let chartRef = null;

onMounted(() => {
  if (!chartRef) {
    const ctx = document.getElementById('line-chart');
    chartRef = new Chart(ctx, {
      type: 'line',
      data: {
        labels: props.data.map(point => point.x),
        datasets: [
          {
            label: 'Vendas',
            data: props.data.map(point => point.y),
            borderColor: '#0f0',
            backgroundColor: '#0f0',
            borderWidth: 2,
          },
        ],
      },
      options: {
  scales: {
    x: {
      type: 'time',
      time: {
        unit: 'day',
        tooltipFormat: 'dd MMM yyyy', // tooltip formart
        displayFormats: {
          day: 'dd MMM' // X format
        }
      },
    },
    y: {
      beginAtZero: true,
    },
  },
  plugins: {
    tooltip: {
      callbacks: {
        title: function(context) {
          let title = '';
          const month = context[0].raw.x.getMonth();
          const year = context[0].raw.x.getFullYear();
          title += `${year}-${month + 1}`;
          return title;
        },
      },
    },
  },
},
    });
  }
});
</script>