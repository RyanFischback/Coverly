<template>
  <Modal :visible="visible" title="Sign Up" @close="close">
    <form @submit.prevent="handleSignup">
      <input v-model="username" placeholder="Username" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input
        v-model="password"
        type="password"
        placeholder="Password"
        required
      />

      <div class="actions">
        <button type="submit">Create Account</button>
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
  (e: "signedUp", auth: { token: string; user: any }): void;
}>();

const close = () => emit("close");

const username = ref("");
const email = ref("");
const password = ref("");
const apiUrl = import.meta.env.VITE_API_URL;

const handleSignup = async () => {
  const response = await axios.post(apiUrl + "/graphql", {
    query: `
      mutation Signup($username: String!, $email: String!, $password: String!) {
        signup(username: $username, email: $email, password: $password) {
          token
          user { id username email }
        }
      }
    `,
    variables: {
      username: username.value,
      email: email.value,
      password: password.value,
    },
  });

  const auth = response.data.data.signup;
  localStorage.setItem("token", auth.token);
  emit("signedUp", auth);
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
