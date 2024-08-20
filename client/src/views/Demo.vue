<template>
  <div class="demo-page">
    <form @submit.prevent="fetchOAIResult">
      <!-- Job Details Section -->
      <div class="section">
        <h2>Job Posting</h2>
        <label for="jobPosting">Enter the full job posting:</label>
        <textarea
          id="jobPosting"
          v-model="jobPosting"
          placeholder="Enter the full job posting here..."
          required
        ></textarea>
      </div>

      <!-- User Information Section -->
      <div class="section">
        <h2>Candidate Information</h2>
        <label for="userInfo">Enter your qualifications:</label>
        <textarea
          id="userInfo"
          v-model="userInfo"
          placeholder="Enter your resume here, and any additional information related to the job posting..."
          required
        ></textarea>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="!isFormValid"
        :title="
          !isFormValid
            ? 'Please fill out both fields to enable the submit button.'
            : ''
        "
      >
        Submit
      </button>
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
import { ref, computed } from "vue";
import axios from "axios";

// Define data objects for job posting and user information
const jobPosting = ref<string>("");
const userInfo = ref<string>("");

// Define the API result
const apiResult = ref<string>("");

// Computed property to check if both fields are filled
const isFormValid = computed(() => {
  return jobPosting.value.trim() !== "" && userInfo.value.trim() !== "";
});

const fetchOAIResult = async () => {
  try {
    const response = await axios.post(
      "http://localhost:3000/api/openai/fetch",
      {
        jobPosting: sanitizeInput(jobPosting.value),
        userInfo: sanitizeInput(userInfo.value),
      }
    );
    apiResult.value = response.data; // Adjust according to your API response structure
  } catch (error) {
    console.error("Error fetching result:", error);
    apiResult.value = "Error fetching result";
  }
};

// Function to sanitize inputs
const sanitizeInput = (input: string) => {
  return input.replace(/</g, "&lt;").replace(/>/g, "&gt;");
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

.section {
  margin-bottom: 20px;
}

.demo-page form {
  display: flex;
  flex-direction: column;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.demo-page label {
  margin-bottom: 10px;
}

.demo-page textarea {
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-bottom: 10px;
  width: 100%;
  resize: vertical;
}

.demo-page button {
  background-color: var(--accent-color);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2em;
  transition: background-color 0.3s;
}

.demo-page button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.demo-page button:hover:not(:disabled) {
  background-color: #e64a19;
}

/* Window styling */
.api-result-window {
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
  max-width: 600px;
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
