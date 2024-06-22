<template>
  <div class="text-center">
    <v-pagination
      v-model="currentPage"
      :length="pagination.pages"
      :total-visible="7"
      :prev-text="'Previous'"
      :next-text="'Next'"
      :first-text="'First'"
      :last-text="'Last'"
      :show-prev-next="true"
      :show-first-last="true"
    ></v-pagination>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits, computed } from 'vue';
import { Pagination } from '../dtos/paginationDTO';
import { useRouter } from 'vue-router';

const props = defineProps<{
  pagination: Pagination;
  path: string;
}>();

const emit = defineEmits(['page-change']);
const router = useRouter();
const currentPage = ref(getPageFromURL());

function getPageFromURL(): number {
  const searchParams = new URLSearchParams(router.currentRoute.value.query);
  const page = parseInt(searchParams.get('page') || '1', 10);
  return isNaN(page) ? 1 : page;
}

watch(currentPage, (newPage) => {
  const url = new URL(props.path, import.meta.env.VITE_DELIVERY_API_URL);
  url.searchParams.set('page', newPage.toString());
  router.push(url.pathname + url.search);
  emit('page-change', newPage);
});
</script>