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
      <section class="contact">
        <div class="container">
          <h2>Contact Us</h2>
          <p>
            Reach out to us for any inquiries or feedback, this app is meant to
            help make your life easier!
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

/* Additional styles */
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
