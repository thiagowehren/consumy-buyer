<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getAllStores } from '@/api/storeAPI';
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage';
import Paginator from '@/components/PaginatorNav.vue';
import defaultShopImage from '@/assets/shop-default-256.png';
import { Pagination } from '@/dtos/paginationDTO';
import { StoreResponse } from '@/dtos/storeDTO';
import LinkPathNav from '@/components/LinkPathNav.vue';
import UserNavigation from '@/components/UserNavigation.vue';

const route = useRoute();
const router = useRouter();

const alert = route.query.alert as string | undefined;
const notice = route.query.notice as string | undefined;
const errorMessage = ref('');

let page = 1;
if (typeof route.query.page === 'string' && !isNaN(parseInt(route.query.page))) {
  page = parseInt(route.query.page);
}

const stores = ref<StoreResponse[]>([]);
const pagination = ref<Pagination>({ current: 1, pages: 1 });
const contentLoaded = ref(false);
const dialogDelete = ref(false);
const selectedStore = ref(null);

onMounted(() => {
  fetchStores();
});

const fetchStores = async (newPage?: number) => {
  try {
    if (newPage !== undefined) {
      page = newPage;
    }

    console.log('Fetching stores for page:', page);

    const response = await getAllStores(page);
    stores.value = response.stores;
    pagination.value = response.pagination;
    contentLoaded.value = true;
    console.log(pagination.value);
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    console.log(errorMessage.value);
  }
};
</script>

<template>
  <v-app>
    <v-main>
      <UserNavigation />

      <div>
        <LinkPathNav :route="`/stores`" :clickableSegments="[0]" />
      </div>
      <div>
        <div class="ml-6">
          <h1 class="text-3xl font-bold ">Lojas</h1>
        </div>

        <Paginator :pagination="pagination" path="/stores" @page-change="fetchStores" />

        <v-row v-if="contentLoaded && stores.length > 0" class="mt-5 ml-5 mr-5">
          <v-col v-for="store in stores" :key="store.id" cols="12" sm="6" md="4" lg="3">
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
                <router-link :to="{ path: '/stores/' + store.id }">
                  <v-btn color="blue">Ver Produtos</v-btn>
                </router-link>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <div v-else-if="contentLoaded && stores.length === 0" class="ml-6">
          <p>Não há lojas disponíveis no momento.</p>
        </div>

        <div v-else class="ml-6">
          <p>Aguarde enquanto carregamos as lojas...</p>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.v-card-title {
  font-size: 24px;
  font-weight: bold;
}
.v-card-subtitle {
  font-size: 14px;
}
</style>
