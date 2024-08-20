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
        :disabled="!isFormValid || loading"
        :title="
          !isFormValid
            ? 'Please fill out both fields to enable the submit button.'
            : ''
        "
      >
        <span v-if="loading" class="spinner"></span>
        <span v-else>Submit</span>
      </button>
    </form>

    <!-- Display the result in a stylized "window" -->
    <div v-if="apiResult" class="api-result-window">
      <div class="window-header">
        <span>API Result</span>
        <div class="header-buttons">
          <span class="copy-content" @click="copyToClipboard">
            <i class="copy-icon">📋 Copy</i>
          </span>
          <span class="export-content" @click="exportToPDF">
            <i class="export-icon">📄 Export to PDF</i>
          </span>
        </div>
      </div>
      <div class="window-body">
        <div v-html="apiResult" class="formatted-result"></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import axios from "axios";
import jsPDF from "jspdf";

// Define data objects for job posting and user information
const jobPosting = ref<string>("");
const userInfo = ref<string>("");

// Define the API result
const apiResult = ref<string>("");

// Define the loading state
const loading = ref<boolean>(false);

// Computed property to check if both fields are filled
const isFormValid = computed(() => {
  return jobPosting.value.trim() !== "" && userInfo.value.trim() !== "";
});

const fetchOAIResult = async () => {
  loading.value = true; // Start loading
  try {
    const response = await axios.post(
      "http://localhost:3000/api/openai/fetch",
      {
        jobPosting: sanitizeInput(jobPosting.value),
        userInfo: sanitizeInput(userInfo.value),
      }
    );

    // Handle rate limit headers if available
    const rateLimitReset = response.headers["x-ratelimit-reset"];
    if (rateLimitReset) {
      const resetTime = parseInt(rateLimitReset, 10) * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilReset = resetTime - currentTime;
      if (timeUntilReset > 0) {
        console.log(
          `Rate limit exceeded. Please wait ${Math.ceil(
            timeUntilReset / 1000
          )} seconds.`
        );
        return; // Prevent further requests until the limit resets
      }
    }

    if (response.status !== 200) {
      throw new Error(response.statusText);
    }

    apiResult.value = response.data; // Adjust according to your API response structure
    console.log(response.data);
  } catch (error) {
    console.error("Error fetching result:", error);

    if (error.response && error.response.status === 429) {
      const retryAfter = error.response.headers["retry-after"];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000; // Fallback to 1 minute
      alert(`Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} `);
    } else if (error.response.status === 400) {
      alert(`Error fetching result: ${error.response.data.error}`);
    } else {
      alert("An unexpected error occured");
    }
  } finally {
    loading.value = false; // End loading
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

const exportToPDF = async () => {
  if (apiResult.value) {
    const doc = new jsPDF();

    // Set font size and style
    doc.setFontSize(12);
    doc.setFont("Helvetica", "normal");

    // Split the text into lines to fit within the PDF width
    const margin = 10;
    const pageWidth = doc.internal.pageSize.width;
    const lineWidth = pageWidth - 2 * margin;
    const lines = doc.splitTextToSize(apiResult.value, lineWidth);

    // Add text to the PDF document
    doc.text(lines, margin, margin + 16); // Adjust the vertical positioning as needed

    doc.save("cover-letter.pdf");
  } else {
    alert("No content to export!");
  }
};
</script>

<style scoped>
/* General styles for demo page */
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
  position: relative;
}

.demo-page button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.demo-page button:hover:not(:disabled) {
  background-color: #e64a19;
}

/* Spinner styling */
.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ffffff;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 10px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
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
  background-color: var(--background-color);
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  font-weight: bold;
}

.header-buttons {
  display: flex;
  gap: 15px; /* Space between the buttons */
}

.window-header .copy-content {
  cursor: pointer;
  color: #007bff;
}

.window-header .copy-content:hover {
  text-decoration: underline;
}

.copy-icon {
  margin-right: 5px;
}

.window-header .export-content {
  cursor: pointer;
  color: #007bff;
}

.window-header .export-content:hover {
  text-decoration: underline;
}

.export-icon {
  margin-right: 5px;
}

.window-body {
  padding: 15px;
  background-color: var(--background-color);
  text-align: left;
}

.formatted-result {
  white-space: pre-wrap; /* Ensures whitespace and line breaks are preserved */
  font-family: "Courier New", Courier, monospace; /* Monospaced font for better alignment */
}
</style>
