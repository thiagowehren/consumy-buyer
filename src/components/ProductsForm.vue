<script setup lang="ts">
import { ref, onMounted, defineModel } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { getStoreProduct, createStoreProduct, updateStoreProduct } from '@/api/productAPI';
import { standardizeErrorMessage } from '@/helpers/standardizeErrorMessage';
import { ProductResponse, CreateProduct } from '@/dtos/productDTO';
import { productFormErrorMessages } from '@/helpers/constants/productFormErrorMessages';
import defaultProductImage from '@/assets/dish-default-256.png';
import LinkPathNav from '@/components/LinkPathNav.vue';
import UserNavigation from '@/components/UserNavigation.vue';

const route = useRoute();
const router = useRouter();

const errorMessage = ref('');
const isLoading = ref(false);

const storeId = route.params.storeId as string | undefined;
const productId = route.params.productId as string | undefined;
const isEditMode = ref(!!productId);

const title = defineModel<string>('title');
const titleOriginal = ref<string>();
const price = defineModel<string>('price');
const hidden = defineModel<boolean>('hidden', { default: false });
const image = ref<File | null>(null);

const expires_in = defineModel<number>('expires_in', { default: 0 });
const expiresInOptions = [
  { label: 'Nunca', value: 0 },
  { label: '5 seconds', value: 5 },
  { label: '30 minutes', value: 1800 },
  { label: '1 hour', value: 3600 },
  { label: '4 hours', value: 14400 },
  { label: '8 hours', value: 28800 },
  { label: '16 hours', value: 57600 },
  { label: '1 day', value: 86400 }
];

let product: ProductResponse | null = null;

const fetchProduct = async () => {
  try {
    const response = await getStoreProduct(storeId, productId);
    product = response;
    title.value = product.title;
    titleOriginal.value = product.title;
    price.value = product.price;
    hidden.value = product.hidden;
    expires_in.value = product.expires_in;
  } catch (error) {
    errorMessage.value = standardizeErrorMessage(error);
    router.push({ path: `/stores/${storeId}`, query: { alert: errorMessage.value } });
  }
};

onMounted(() => {
  if (isEditMode.value) {
    fetchProduct();
  }
});

const titleRules = [
  (value: string) => !!value || productFormErrorMessages.title.required,
  (value: string) => (value && value.length >= 1) || productFormErrorMessages.title.invalid
];

const validateForm = () => {
  const titleValid = titleRules.every(rule => rule(title.value) === true);
  valid.value = titleValid;
};

const onSubmit = async () => {
  if (isLoading.value) {
    return;
  }

  isLoading.value = true;

  const titleValid = titleRules.every(rule => rule(title.value) === true);

  if (!titleValid) {
    isLoading.value = false;
    return;
  }

  try {
    const productData: Partial<CreateProduct['product']> = {
      title: title.value,
      price: price.value,
      hidden: hidden.value,
      expires_in: expires_in.value
    };

    if (image.value) {
      productData.image = image.value;
    }

    if (isEditMode.value && storeId) {
      await updateStoreProduct(storeId, productId, productData);
      router.go(0); // Reload current route
    } else {
      await createStoreProduct(storeId, productData);
      router.push({ path: `/stores/${storeId}`, query: { notice: 'Produto criado com sucesso.' } });
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

      <div>
        <div v-if="isEditMode">
          <LinkPathNav :route="`/stores/${storeId}/products/${productId}/edit`" :clickableSegments="[0, 1, 4]" />
        </div>
        <div v-else>
          <LinkPathNav :route="`/stores/${storeId}/products/new`" :clickableSegments="[0, 1, 3]" />
        </div>
        <div class="container mx-auto">
          <h1 class="text-2xl font-bold mb-4">{{ isEditMode ? 'Editar Produto' : 'Novo Produto' }}</h1>
          <div class="flex items-start">
            <div class="w-1/3 flex flex-col">
              <p class="text-1xl font-bold mb-4">{{ titleOriginal }}</p>
              <div v-if="isEditMode && product">
                <img :src="product.image_url ? product.image_url : defaultProductImage" alt="Imagem do Produto" class="w-40 h-40 rounded-lg">
              </div>
              <div v-else>
                <img :src="defaultProductImage" alt="Imagem Padrão do Produto" class="w-40 h-40 rounded-lg">
              </div>
            </div>
            <div class="w-2/3 pl-8">
              <form novalidate @submit.prevent="onSubmit">
                <v-text-field 
                  v-model="title" 
                  label="Título" 
                  required 
                  variant="underlined" 
                  :rules="titleRules" 
                  @input="validateForm"
                  class="mb-4"
                ></v-text-field>
                <v-text-field 
                  v-model="price" 
                  label="Preço" 
                  required 
                  variant="underlined"
                  class="mb-4"
                ></v-text-field>
                <div class="flex items-center mb-4">
                  <v-checkbox v-model="hidden" :label="hidden ? 'Oculto' : 'Visível'">
                    <template #append>
                      <v-icon>{{ hidden ? 'mdi-eye-off' : 'mdi-eye' }}</v-icon>
                    </template>
                  </v-checkbox>
                </div>
                <v-select
                  v-model="expires_in"
                  :items="expiresInOptions"
                  item-value="value"
                  variant="underlined"
                  item-title="label"
                  label="Expiração"
                  class="mb-4"
                ></v-select>
                <v-file-input 
                    @change="onFileChange" 
                    chips 
                    clearable
                    accept="image/png, image/jpeg, image/bmp"
                    label="Insira uma imagem para o produto"
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
