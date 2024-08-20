<!-- src/App.vue -->
<script setup lang="ts">
import { ref, watchEffect } from "vue";

const isDarkMode = ref(true);

const toggleDarkMode = () => {
  isDarkMode.value = !isDarkMode.value;
  document.body.classList.toggle("dark-mode", isDarkMode.value);
  document.body.classList.toggle("light-mode", !isDarkMode.value);
};

// Apply the initial mode
watchEffect(() => {
  document.body.classList.toggle("dark-mode", isDarkMode.value);
  document.body.classList.toggle("light-mode", !isDarkMode.value);
});
</script>

<template>
  <div>
    <!-- Header Section -->
    <header>
      <div class="container">
        <h1>Coverly</h1>
        <nav>
          <router-link to="/">Home</router-link>
          <router-link to="/about">About</router-link>
          <router-link to="/services">Services</router-link>
          <router-link to="/contact">Contact</router-link>
          <!-- Toggle Slider -->
          <div class="slider-container">
            <label class="switch">
              <input
                type="checkbox"
                :checked="isDarkMode"
                @change="toggleDarkMode"
              />
              <span class="slider"></span>
            </label>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main>
      <section class="hero">
        <div class="container">
          <h2>Welcome to Our Business</h2>
          <p>Discover our top-notch services designed to drive your success.</p>
          <button>Get Started</button>
        </div>
      </section>

      <section class="services">
        <div class="container">
          <h2>Our Services</h2>
          <div class="service">
            <h3>Consulting</h3>
            <p>
              Expert advice to help you make informed decisions and achieve your
              goals.
            </p>
          </div>
          <div class="service">
            <h3>Development</h3>
            <p>
              High-quality development services to build and enhance your
              digital presence.
            </p>
          </div>
          <div class="service">
            <h3>Marketing</h3>
            <p>
              Effective strategies to grow your brand and reach your target
              audience.
            </p>
          </div>
        </div>
      </section>

      <section class="about">
        <div class="container">
          <h2>About Us</h2>
          <p>
            Our team is dedicated to delivering exceptional service and results.
            We are passionate about what we do and committed to your success.
          </p>
        </div>
      </section>

      <section class="contact">
        <div class="container">
          <h2>Contact Us</h2>
          <p>
            Reach out to us for any inquiries or to start a project. We are here
            to help you succeed.
          </p>
          <form>
            <label for="name">Name:</label>
            <input type="text" id="name" placeholder="Your Name" required />
            <label for="email">Email:</label>
            <input type="email" id="email" placeholder="Your Email" required />
            <label for="message">Message:</label>
            <textarea
              id="message"
              placeholder="Your Message"
              required
            ></textarea>
            <button type="submit">Send Message</button>
          </form>
        </div>
      </section>
    </main>

    <!-- Footer Section -->
    <footer>
      <div class="container">
        <p>&copy; 2024 Ryan Fischback. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* CSS Variables */
:root {
  --background-color-light: #f4f4f4;
  --background-color-dark: #2c2c2c;
  --text-color-light: #333333;
  --text-color-dark: #ffffff;
  --primary-color: #004d99;
  --secondary-color: #00bfae;
  --accent-color: #ff5722;
  --button-background: #004d99;
  --button-background-hover: #003d80;
  --header-background: #004d99;
  --footer-background: #004d99;
  --hero-background: #00bfae;
  --section-background: #ffffff;
}

body.light-mode {
  --background-color: var(--background-color-light);
  --text-color: var(--text-color-light);
  --button-background: var(--button-background);
  --button-background-hover: var(--button-background-hover);
  --header-background: var(--header-background);
  --footer-background: var(--footer-background);
  --hero-background: var(--hero-background);
  --section-background: var(--section-background);
}

body.dark-mode {
  --background-color: var(--background-color-dark);
  --text-color: var(--text-color-dark);
  --button-background: var(--secondary-color);
  --button-background-hover: #009688;
  --header-background: var(--header-background);
  --footer-background: var(--footer-background);
  --hero-background: #003d80;
  --section-background: #333333;
}

body {
  background-color: var(--background-color);
  color: var(--text-color);
  margin: 0;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  line-height: 1.6;
}

/* Container */
.container {
  width: 80%;
  margin: 0 auto;
}

/* Header */
header {
  background-color: var(--header-background);
  padding: 20px 0;
}

header h1 {
  margin: 0;
  color: var(--text-color);
  font-size: 2em;
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

nav a {
  color: var(--text-color);
  text-decoration: none;
  margin: 0 15px;
  font-size: 1.1em;
}

nav a:hover {
  color: var(--accent-color);
}

/* Hero Section */
.hero {
  background-color: var(--hero-background);
  color: var(--text-color);
  padding: 60px 0;
  text-align: center;
}

.hero h2 {
  margin: 0;
  font-size: 2.5em;
}

.hero p {
  font-size: 1.2em;
}

.hero button {
  background-color: var(--accent-color);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2em;
  margin-top: 20px;
}

.hero button:hover {
  background-color: #e64a19;
}

/* Services Section */
.services {
  padding: 40px 0;
  background-color: var(--section-background);
}

.services h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  color: var(--text-color);
}

.service {
  background-color: var(--section-background);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.service h3 {
  margin: 0;
  color: var(--text-color);
  font-size: 1.5em;
}

.service p {
  font-size: 1.1em;
  margin: 10px 0;
}

/* About Section */
.about {
  padding: 40px 0;
}

.about h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 2em;
  color: var(--text-color);
}

/* Contact Section */
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

/* Footer */
footer {
  background-color: var(--footer-background);
  color: var(--text-color);
  text-align: center;
  padding: 20px 0;
}

footer p {
  margin: 0;
  font-size: 1.1em;
}

/* Slider Styles */
.slider-container {
  display: flex;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: 0.4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  border-radius: 50%;
  left: 4px;
  bottom: 4px;
  background-color: var(--text-color);
  transition: 0.4s;
}

input:checked + .slider {
  background-color: #2196f3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}
</style>
