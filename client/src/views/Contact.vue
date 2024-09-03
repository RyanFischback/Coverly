<!-- src/views/Contact.vue -->
<template>
  <div class="contact-page">
    <section class="contact">
      <div class="container">
        <h2>Contact Me</h2>
        <p>
          Reach out to me for any inquiries or feedback, this app is meant to
          help make your life easier!
        </p>
        <form @submit.prevent="sendMessage">
          <label for="name">Name:</label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            placeholder="Your Name"
            required
          />
          <label for="email">Email:</label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            placeholder="Your Email"
            required
          />
          <label for="message">Message:</label>
          <textarea
            id="message"
            v-model="form.message"
            placeholder="Your Message"
            required
          ></textarea>
          <button type="submit">Send Message</button>
        </form>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({
  name: "",
  email: "",
  message: "",
});

const apiUrl = import.meta.env.VITE_API_URL;

const sendMessage = async () => {
  try {
    const response = await fetch(`${apiUrl}/api/contact/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form.value),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = await response.json();
    alert(data.success);
  } catch (error) {
    console.error("Error sending message:", error);
    alert(error);
  }
};
</script>

<style>
.contact {
  padding: 40px 0;
  background-color: var(--section-background);
}

.contact h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  color: var(--text-color);
}

.contact form {
  max-width: 600px;
  margin: 0 auto;
}

.contact label {
  display: block;
  margin: 10px 0 5px;
  font-size: 1.1em;
}

.contact input,
.contact textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-bottom: 10px;
}

.contact button {
  background-color: var(--accent-color);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2em;
}

.contact button:hover {
  background-color: #e64a19;
}
</style>
