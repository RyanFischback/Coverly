<template>
  <div>
    <main>
      <section class="hero">
        <div class="container">
          <h2>Welcome to the Coverly App!</h2>
          <p>An AI Assisted Cover Letter Generator</p>

          <div class="video-wrapper">
            <iframe
              width="1020"
              height="630"
              src="https://www.youtube.com/embed/CqfWSt1JQzE"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>

          <!-- Get Started Button -->
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

/* Add spacing and style for the video */
.video-wrapper {
  margin: 30px 0; /* Adds space above and below the video */
  display: flex;
  justify-content: center;
}
</style>
