<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Auth } from '@/auth';
import { formErrorMessages } from '@/helpers/constants/authFormErrorMessages';
import UserNavigation from '@/components/UserNavigation.vue';
import defaultShopImage from '@/assets/shop-default-256.png';

const router = useRouter();
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');
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

const passwordConfirmRules = [
  value => !!value || formErrorMessages.confirmPassword.required,
  value => (value && value.length >= 6) || formErrorMessages.password.minLength,
  value => value === password.value || formErrorMessages.confirmPassword.match
];

function validateForm() {
  const emailValid = emailRules.every(rule => rule(email.value) === true);
  const passwordValid = passwordRules.every(rule => rule(password.value) === true);
  const passwordConfirmValid = passwordConfirmRules.every(rule => rule(passwordConfirm.value) === true);
  valid.value = emailValid && passwordValid && passwordConfirmValid;
}

function onSubmit() {
  if (!valid.value) {
    return;
  }

  loading.value = true;

  let auth = new Auth();
  auth.SignUp(
    email.value,
    password.value,
    passwordConfirm.value,
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
            <p class="text-2xl font-bold">Criar Conta</p>
            <p class="text-gray-600">Insira suas informações abaixo</p>
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

            <v-text-field
              v-model="passwordConfirm"
              :rules="passwordConfirmRules"
              label="Confirmar Senha"
              required
              clearable
              variant="underlined"
              type="password"
              @input="validateForm"
              class="mb-4"
            ></v-text-field>

            <div class="flex justify-between items-center">
              <RouterLink :to="{ name: 'login' }" class="text-red-accent-4">Já possui conta? Faça login</RouterLink>
              <v-btn :loading="loading" height="48" color="red-accent-4" dark type="submit">
                {{ loading ? '' : 'Criar Conta' }}
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