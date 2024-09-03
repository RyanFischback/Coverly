<template>
  <div>
    <main>
      <section class="hero">
        <div class="container">
          <h2>Welcome to the Coverly App!</h2>
          <p>An AI Assisted Cover Letter Generator</p>
          <!-- Use RouterLink instead of button -->
          <router-link to="/demo" class="get-started-button"
            >Get Started</router-link
          >
        </div>
      </section>
    </main>
  </div>
</template>

<script></script>

<style>
/* Keep the same styles for the button */
.get-started-button {
  background-color: var(--accent-color);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 4px;
  font-size: 1.2em;
  margin-top: 20px;
  display: inline-block;
  text-align: center;
  text-decoration: none;
}

.get-started-button:hover {
  background-color: #e64a19;
}
</style>
