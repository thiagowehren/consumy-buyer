<template>
  <v-app-bar flat color="#fff">
    <div class="flex items-center justify-between font-sans w-full">
      <div class="flex items-center space-x-2 ml-4">
        <h1 class="text-3xl font-bold text-red-accent-4 ml-4">Delivery</h1>
      </div>
      <v-dialog max-width="500">
        <template v-slot:activator="{ props: activatorProps }">
          <v-btn v-bind="activatorProps" exact text class="text-red-accent-4" icon="mdi-magnify"></v-btn>
        </template>
        <template v-slot:default="{ isActive }">
          <v-card title="Pesquisa">
            <v-card-text>
              <v-text-field
                v-model="searchQuery"
                label="Pesquisar"
                prepend-inner-icon="mdi-magnify"
                @input="debouncedSearch"
              ></v-text-field>
            </v-card-text>
            <v-divider></v-divider>
            <v-expansion-panels>
              <!-- stores -->
              <v-expansion-panel>
                  <v-card v-if="searchResultsVisible">
                    <v-card-title>
                      <h2>Stores</h2>
                    </v-card-title>
                    <v-card-text>
                      <v-list>
                        <v-list-item v-for="store in searchResults.stores" :key="store.id" class="bg-grey-lighten-3 mb-1">
                          <a :href="'/stores/' + store.id">
                            <div class="flex items-center">
                              <div>
                                <v-img :src="store.image_url ? store.image_url : defaultStoreImage" alt="Imagem da Loja" class="w-24 h-24 object-cover rounded-lg mr-4" cover/>
                              </div>
                              <div>
                                <div class="flex items-center">
                                  <div v-html="highlightText(store.name, searchQuery)"></div>
                                </div>
                              </div>
                            </div>
                          </a>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
                
              </v-expansion-panel>

              <!-- products -->
              <v-expansion-panel>
              
                  <v-card v-if="searchResultsVisible">
                    <v-card-title>
                      <h2>Products</h2>
                    </v-card-title>
                    <v-card-text>
                      <v-list>
                        <v-list-item v-for="product in searchResults.products" :key="product.id">
                          <a :href="'/stores/' + product.store_id">
                            <div class="flex items-center">
                              <div>
                                <v-img :src="product.image_url ? product.image_url : defaultProductImage" cover alt="Imagem do Produto" class="w-24 h-24 object-cover rounded-lg mr-4"/>
                              </div>
                              <div class="flex-1 pd-2">
                                <span v-html="highlightText(product.title, searchQuery)"></span>
                                <br>
                                <span class="text-gray-400">{{ product.price }}</span>
                              </div>
                            </div>
                          </a>
                        </v-list-item>
                      </v-list>
                    </v-card-text>
                  </v-card>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </template>
      </v-dialog>

      <div class="flex items-center space-x-4">
        <v-btn to="/" exact text class="text-red-accent-4">Home</v-btn>
        <v-btn to="/stores" exact text class="text-red-accent-4">Lojas</v-btn>
        <v-btn to="/orders" exact text class="text-red-accent-4">Pedidos</v-btn>
        <v-btn exact text class="text-red-accent-4" icon="mdi-bell-outline"></v-btn>
      </div>
      <div class="flex items-center space-x-4">
        <template v-if="isLoggedIn">
          <div class="flex items-center space-x-4">
            <span v-if="currentUser.email" class="text-red-accent-4 underline">{{ currentUser.email }}</span>
            <v-btn @click="logout" class="text-red-accent-4" append-icon="mdi-logout" text>
              Sair
            </v-btn>
          </div>
        </template>
        <template v-else>
          <div class="mr-2">
            <RouterLink :to="{ name: 'login' }">
              <v-btn class="text-red-accent-4" text prepend-icon="mdi-login">
                Entrar
              </v-btn>
            </RouterLink>
            <RouterLink :to="{ name: 'signup' }">
              <v-btn class="bg-red-accent-4" prepend-icon="mdi-account-plus" variant="tonal">
                Criar Conta
              </v-btn>
            </RouterLink>
          </div>
        </template>
      </div>
    </div>
  </v-app-bar>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { Auth } from '@/auth';
import { searchAll } from '@/api/searchAPI';
import { debounce } from 'lodash';
import defaultProductImage from '@/assets/dish-default-256.png';
import defaultStoreImage from '@/assets/shop-default-256.png';

const auth = new Auth();
const isLoggedIn = ref(auth.isLoggedIn());
const currentUser = ref(auth.currentUser());
const router = useRouter();

const logout = () => {
  auth.SignOut(() => {
    isLoggedIn.value = auth.isLoggedIn();
    currentUser.value = auth.currentUser();
    if (router.currentRoute.value.name === 'home') {
      router.go(0);
    } else {
      router.push({ name: 'home' });
    }
  });
};

const searchQuery = ref('');
const searchResults = ref({ stores: [], products: [] });
const searchResultsVisible = ref(false);

const performSearch = async () => {
  console.log('Pesquisando por:', searchQuery.value);
  try {
    const response = await searchAll(searchQuery.value);
    searchResults.value = response.search;
    searchResultsVisible.value = true;
  } catch (error) {
    console.log(error);
  } finally {
    // isLoading.value = false;
  }
};

const highlightText = (originalText, query) => {
  let highlightedText = '';
  const uniqueQueryChars = Array.from(new Set(query.toLowerCase().split('')));
  
  for (let i = 0; i < originalText.length; i++) {
    const char = originalText[i];
    const charLower = char.toLowerCase();

    if (uniqueQueryChars.includes(charLower)) {
      highlightedText += `<b>${char}</b>`;
    } else {
      highlightedText += char;
    }
  }
  
  return highlightedText;
};


const debouncedSearch = debounce(performSearch, 300)

watchEffect(() => {
  isLoggedIn.value = auth.isLoggedIn();
  currentUser.value = auth.currentUser();
});
</script>
