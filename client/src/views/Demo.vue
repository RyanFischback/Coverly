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

    <!-- Display the result in a stylized "window" -->
    <div v-if="apiResult" class="api-result-window">
      <div class="window-header">
        <span>API Result</span>
        <span class="copy-content" @click="copyToClipboard">
          <i class="copy-icon">📋 Copy</i>
        </span>
      </div>
      <div class="window-body">
        <p>{{ apiResult }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import axios from "axios";

const userInput = ref<string>("");
const apiResult = ref<string>("");

const fetchOAIResult = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/openai/request",
      {
        content: userInput.value,
      }
    );
    apiResult.value = response.data; // Adjust according to your API response structure
  } catch (error) {
    console.error("Error fetching result:", error);
    apiResult.value = "Error fetching result";
  }
};

const copyToClipboard = async () => {
  try {
    if (apiResult.value) {
      // Copy the API result to the clipboard
      await navigator.clipboard.writeText(apiResult.value);
      alert("API result copied to clipboard!");
    } else {
      alert("Nothing to copy!");
    }
  } catch (err) {
    console.error("Failed to copy to clipboard: ", err);
    alert("Failed to copy to clipboard.");
  }
};
</script>

<style scoped>
.demo-page {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.demo-page form {
  display: flex;
  flex-direction: column;
  max-width: 500px;
  margin: 0 auto;
  width: 100%;
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

/* Window styling */
.api-result-window {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  max-width: 500px;
  width: 100%;
  margin-top: 20px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

.window-header {
  background-color: var(--background-color-dark);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.window-header .copy-content {
  cursor: pointer;
  color: #007bff;
  display: flex;
  align-items: center;
}

.window-header .copy-content:hover {
  text-decoration: underline;
}

.copy-icon {
  margin-right: 5px;
}

.window-body {
  padding: 15px;
  background-color: var(--background-color-dark);
  text-align: left;
}
</style>
