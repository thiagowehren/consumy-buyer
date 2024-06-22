<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Auth } from '@/auth';
import { formErrorMessages } from '@/helpers/constants/authFormErrorMessages';
import UserNavigation from '@/components/UserNavigation.vue';
import defaultShopImage from '@/assets/shop-default-256.png';

const router = useRouter();
const email = ref('');
const password = ref('');
const loading = ref(false);
const valid = ref(false);

const emailRules = [
  value => !!value || formErrorMessages.email.required,
  value => /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(value) || formErrorMessages.email.invalid
];

const passwordRules = [
  value => !!value || formErrorMessages.password.required,
  value => (value && value.length >= 6) || formErrorMessages.password.minLength
];

function validateForm() {
  const emailValid = emailRules.every(rule => rule(email.value) === true);
  const passwordValid = passwordRules.every(rule => rule(password.value) === true);
  valid.value = emailValid && passwordValid;
}

function onSubmit() {
  if (!valid.value) {
    return;
  }

  loading.value = true;

  let auth = new Auth(false);
  auth.Login(
    email.value,
    password.value,
    () => {
      router.push('/');
      loading.value = false;
    },
    () => {
      loading.value = false;
    }
  );
}
</script>

<template>
  <v-app class="h-screen bg-grey-lighten-4">
    <v-main class="flex justify-center items-center">
      <UserNavigation />
      <div class="w-full max-w-3xl bg-white rounded-lg shadow-lg flex p-4 pt-8">
        
        <!-- section1 -->
        <div class="w-1/2 flex flex-col items-start justify-start pr-4">
          <div class="w-full flex justify-start mb-4">
            <img :src="defaultShopImage" alt="Shop Default Image" class="w-24 h-24">
          </div>
          <div class="mb-4 pl-4">
            <p class="text-2xl font-bold">Faça Login</p>
            <p class="text-gray-600">Use sua conta parceiro!</p>
          </div>
        </div>
        
        <!-- seciton2 -->
        <div class="w-1/2 flex flex-col justify-center pt-4">
          <v-form v-model="valid" @submit.prevent="onSubmit">
            <v-text-field
              v-model="email"
              :rules="emailRules"
              label="E-mail"
              required
              variant="underlined"
              placeholder="email@exemplo.com"
              @input="validateForm"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :rules="passwordRules"
              label="Senha"
              required
              clearable
              variant="underlined"
              type="password"
              @input="validateForm"
              class="mb-4"
            ></v-text-field>

            <div class="flex justify-between items-center">
              <RouterLink :to="{ name: 'signup' }" class="text-red-accent-4">Criar conta</RouterLink>
              <v-btn :loading="loading" height="48" color="red-accent-4" dark type="submit">
                {{ loading ? '' : 'Log in' }}
                <template v-slot:loader>
                  <v-progress-circular indeterminate size="24" width="2" color="white"></v-progress-circular>
                </template>
              </v-btn>
            </div>
          </v-form>
        </div>
      </div>
    </v-main>
  </v-app>
</template>

