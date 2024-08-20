<template>
  <div>
    <h1>Home Page</h1>
    <router-link to="/about">Go to About</router-link>

    <!-- Input form for the user to provide content -->
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

<script>
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      userInput: "", // To hold the user's input
      apiResult: null, // To hold the result from the API
    };
  },
  methods: {
    async fetchOAIResult() {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/openai/request",
          {
            content: this.userInput, // Pass the user input to the backend
          }
        );
        this.apiResult = response.data; // Assuming API returns the result directly
      } catch (error) {
        console.error("Error fetching result:", error);
        this.apiResult = "An error occurred. Please try again.";
      }
    },
  },
};
</script>

<style>
/* Add styles here */
</style>
