<script setup lang="ts">
import { ref, onMounted, toRaw } from 'vue';
import { getAllStores } from '@/api/storeAPI';
import { getDashboardData } from '@/api/dashboardAPI';
import { PointDetails, DashboardResponse } from '@/dtos/dashboardDTO';
import { StoreResponse } from '@/dtos/storeDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';
import UserNavigation from '@/components/UserNavigation.vue';
import defaultShopImage from '@/assets/shop-default-256.png';
import LineChart from '@/components/LineChart.vue'

const stores = ref<StoreResponse[]>([]);
const currentStoreId = ref<string | null>(null);
const storePagination = ref<Pagination>({ current: 1, pages: 1 });
const dashboardData = ref<DashboardResponse>({ data: [] });
const loading = ref(false);
const loadingDashboard = ref(false);

onMounted(() => {
  fetchStores();
});

const fetchStores = async (page = 1) => {
  try {
    const response = await getAllStores(page);
    stores.value.push(...response.stores);
    storePagination.value = response.pagination;
    console.log("Stores fetched:", stores.value);
  } catch (error) {
    console.error('Failed to fetch stores', error);
  }
};

const fetchDashboardData = async (storeId: string) => {
  try {
    loadingDashboard.value = true;
    const response = await getDashboardData(storeId);
    console.log("Dashboard data received:", response);

    const formattedData: PointDetails[] = Object.entries(response.data).map(([date, value]) => ({
      x: date,
      y: value
    }));
    dashboardData.value = { data: formattedData };
    console.log("Formatted dashboard data:", formattedData);
  } catch (error) {
    console.error('Failed to fetch dashboard data', error);
  } finally {
    loadingDashboard.value = false;
  }
};

const fetchMoreStores = () => {
  if (storePagination.value.next) {
    fetchStores(storePagination.value.current + 1);
  }
};

const handleStoreSelected = (storeId: string) => {
  currentStoreId.value = storeId;
  fetchDashboardData(storeId);
  console.log("Current store ID:", currentStoreId.value);
};
</script>


<template>
  <v-app>
    <v-main>
      <UserNavigation />
      <div>
        <LinkPathNav :route="`/dashboard`" :clickableSegments="[0]" />
      </div>

      <section>
        <div class="ml-6">
          <h1 class="text-3xl font-bold ">Dashboard</h1>
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
          <v-btn v-if="storePagination.next" icon @click="fetchMoreStores" class="load-more-btn mr-4">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </section>

      <section v-if="currentStoreId">
        <div class="ml-6">
          <h2 class="text-3xl font-bold">Dashboard da loja selecionada</h2>
        </div>
        <div v-if="loadingDashboard">
          <p class="mt-4 ml-6">Carregando dados do dashboard...</p>
        </div>
        <div v-else-if="dashboardData.data.length == 0">
          <p class="mt-4 ml-6">Não há dados suficientes para exibir o dashboard.</p>
        </div>
        <div v-else-if="dashboardData.data.length > 0">
          <LineChart :data="dashboardData.data" />
        </div>
        <div v-else>
          <p class="mt-4 ml-6">Erro inesperado.</p>
        </div>
      </section>
      
      <section v-else>
        <div class="ml-6">
          <p class="mt-4 ml-6">Selecione uma loja antes de visualizar os dados do dashboard.</p>
        </div>
      </section>
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

.store-item.active {
  border: 2px solid blue;
}
</style>
