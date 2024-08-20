<template>
  <div>
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
  </div>
</template>

<script></script>

<style>
/* Add styles here */
</style>
