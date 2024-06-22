<script setup lang="ts">
import { ref, onMounted, defineModel } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getStore, createStore, updateStore } from '@/api/storeAPI';
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage';
import { StoreResponse, CreateStore } from '@/dtos/storeDTO';
import { storeFormErrorMessages } from '@/helpers/constants/storeFormErrorMessages';
import defaultShopImage from '@/assets/shop-default-256.png';
import LinkPathNav from '@/components/LinkPathNav.vue';
import UserNavigation from '@/components/UserNavigation.vue';

const route = useRoute();
const router = useRouter();

const errorMessage = ref('');
const isLoading = ref(false);

const storeId = route.params.storeId as string | undefined;
const isEditMode = ref(!!storeId);

const name = defineModel<string>('name');
const nameOriginal = ref<string>();
const hidden = defineModel<boolean>('hidden', { default: false });
const image = ref<File | null>(null);

let storeData: StoreResponse | null = null;

const fetchStore = async () => {
  try {
    const response = await getStore(storeId);
    storeData = response;
    name.value = storeData.name;
    nameOriginal.value = storeData.name;
    hidden.value = storeData.hidden;
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    router.push({ path: '/stores', query: { alert: errorMessage.value } });
  }
};

onMounted(() => {
  if (isEditMode.value) {
    fetchStore();
  }
});

const nameRules = [
  (value: string) => !!value || storeFormErrorMessages.name.required,
  (value: string) => (value && value.length >= 3) || storeFormErrorMessages.name.invalid
];

const validateForm = () => {
  const nameValid = nameRules.every(rule => rule(name.value) === true);
  valid.value = nameValid;
};

const onSubmit = async () => {
  if (isLoading.value) {
    return;
  }
  
  isLoading.value = true;
  if (!name.value || name.value.length < 3) {
    isLoading.value = false;
    return;
  }

  try {
    const storeData: Partial<CreateStore['store']> = { name: name.value, hidden: hidden.value };

    if (image.value) {
      storeData.image = image.value;
    }

    if (isEditMode.value && storeId) {
      await updateStore(storeId, storeData);
      router.go(0); // Reload current route
    } else {
      await createStore(storeData);
      router.push({ path: '/stores', query: { notice: 'Loja criada com sucesso.' } });
    }
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
  } finally {
    isLoading.value = false;
  }
};

const onFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    image.value = file;
  }
};
</script>

<template>
  <v-app>
    <v-main>
      <UserNavigation />

      <div >
        <div v-if="isEditMode">
          <LinkPathNav :route="`/stores/${storeId}/edit`" :clickableSegments="[0, 1, 2]" />
        </div>
        <div v-else>
          <LinkPathNav :route="`/stores/new`" :clickableSegments="[0, 1]" />
        </div>
        <div class="container mx-auto">
            <h1 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Editar loja' : 'Nova loja' }}</h1>
          <div class="flex items-start">
            <div class="w-1/3 flex flex-col">
              <p class="text-1xl font-bold mb-4">{{ nameOriginal }}</p>
              <div v-if="isEditMode && storeData">
                <img :src="storeData.image_url ? storeData.image_url : defaultShopImage" alt="Imagem da loja"
                  class="w-40 h-40 rounded-lg">
              </div>
              <div v-else>
                <img :src="defaultShopImage" alt="Imagem da loja" class="w-40 h-40 rounded-lg">
              </div>
            </div>
            <div class="w-2/3 pl-8">
              <form novalidate @submit.prevent="onSubmit">
                <v-text-field 
                  v-model="name" 
                  label="Name" 
                  required 
                  variant="underlined" 
                  :rules="nameRules" 
                  @input="validateForm"
                  class="mb-4"
                ></v-text-field>
                <div class="flex items-center mb-4">
                  <v-checkbox v-model="hidden" :label="hidden ? 'Oculta' : 'Visível'">
                    <template #append>
                      <v-icon>{{ hidden ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                    </template>
                  </v-checkbox>
                </div>
                  <v-file-input 
                    @change="onFileChange" 
                    chips 
                    clearable
                    accept="image/png, image/jpeg, image/bmp"
                    label="Insira uma imagem para a loja"
                    prepend-icon="mdi-image"
                    placeholder="Arquivos *.PNG, *.JPEG e *.BMP"
                    class="mb-4"
                  ></v-file-input>
                <v-btn v-if="!isLoading" color="primary" type="submit" class="ml-auto">
                  {{ isEditMode ? 'Atualizar' : 'Criar' }}
                </v-btn>
                <v-btn v-else color="primary" disabled class="ml-auto">
                  <v-progress-circular indeterminate size="24" width="2" color="white"></v-progress-circular>
                </v-btn>
              </form>
            </div>
          </div>
        </div>
      </div>
    </v-main>
  </v-app>
</template>