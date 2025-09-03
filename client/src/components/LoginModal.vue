<template>
  <Modal :visible="visible" title="Log In" @close="close">
    <form @submit.prevent="handleLogin">
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <div class="actions">
        <button type="submit">Log In</button>
        <button type="button" @click="close">Cancel</button>
      </div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";
import Modal from "./Modal.vue";

const { visible } = defineProps<{ visible: boolean }>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "signedIn", auth: { token: string; user: any }): void;
}>();

const close = () => emit("close");

const email = ref("");
const password = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

const handleLogin = async () => {
  const response = await axios.post(apiUrl + "/graphql", {
    query: `
      mutation Login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
          token
          user { id username email }
        }
      }
    `,
    variables: {
      email: email.value,
      password: password.value,
    },
  });

  const auth = response.data.data.login;
  localStorage.setItem("token", auth.token);
  emit("signedIn", auth);
  close();
};
</script>

<style scoped>
.actions {
  margin-top: 12px;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
