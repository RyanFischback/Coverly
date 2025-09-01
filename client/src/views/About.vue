<template>
  <div class="about-page">
    <section class="about hero-about">
      <div class="container">
        <article class="about-card">
          <h1>About Coverly</h1>
          <p class="lead">
            Coverly helps you turn any job posting into a sharp, personalized
            cover letter—fast.
          </p>
          <p class="text">
            Paste the job description and your resume. Add optional details like
            company, role, location, or tone. We’ll generate a concise letter
            that highlights what matters most for that role, ready to copy or
            export to PDF.
          </p>

          <router-link to="/cover-letter" class="btn primary"
            >Create your cover letter</router-link
          >
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
/* Center the card within the viewport without relying on global section rules */
.hero-about {
  display: grid;
  place-items: center;
  min-height: clamp(520px, 70vh, 760px);
  padding: clamp(28px, 5vw, 64px) 0;
  background: var(--section-background);
}

.about-card {
  text-align: center;
  max-width: 760px;
  margin: 0 auto;
  padding: clamp(18px, 2.6vw, 28px);
  background: var(--section-background);
  border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0 0 8px;
  font-size: clamp(24px, 3.4vw, 32px);
  line-height: 1.15;
}
.lead {
  margin: 0 0 10px;
  color: var(--muted-color, #8b8f98);
}
.text {
  margin: 0 auto 16px;
  max-width: 68ch;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 18px;
  min-height: 44px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid color-mix(in srgb, var(--text-color) 12%, transparent);
}
.primary {
  background: var(--button-background, #ff5722);
  color: #fff;
}
.primary:hover {
  background: var(--button-background-hover, #e64a19);
}
</style>
