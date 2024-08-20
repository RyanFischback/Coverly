<template>
  <div class="demo-page">
    <form @submit.prevent="fetchOAIResult">
      <label for="userInput">Enter your request:</label>
      <input
        type="text"
        id="userInput"
        v-model="userInput"
        placeholder="Ask something..."
        required
      />
      <button type="submit">Submit</button>
    </form>

    <!-- Display the result -->
    <div v-if="apiResult">
      <h2>API Result:</h2>
      <p>{{ apiResult }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios"; // Ensure axios is installed and imported

const userInput = ref("");
const apiResult = ref("");

const fetchOAIResult = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/openai/request",
      {
        content: userInput.value,
      }
    );
    apiResult.value = response.data.result; // Adjust according to your API response structure
  } catch (error) {
    console.error("Error fetching result:", error);
    apiResult.value = "Error fetching result";
  }
};
</script>

<style scoped>
.demo-page {
  padding: 20px;
}

.demo-page h1 {
  font-size: 2em;
  margin-bottom: 20px;
}

.demo-page form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
}

.demo-page label {
  margin-bottom: 10px;
}

.demo-page input {
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-bottom: 10px;
}

.demo-page button {
  background-color: var(--accent-color);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2em;
}

.demo-page button:hover {
  background-color: #e64a19;
}

.demo-page .api-result {
  margin-top: 20px;
}
</style>
