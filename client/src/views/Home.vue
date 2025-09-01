<template>
  <div class="home-page">
    <section class="hero hero-landing">
      <div class="container">
        <div class="hero-inner">
          <h1>Tailored cover letters</h1>
          <p class="sub">
            Paste the job description and your resume. Add optional details if
            you want. Get a focused, role-ready letter in seconds.
          </p>

          <router-link to="/cover-letter" class="btn primary large">
            Get started
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.hero-landing {
  background: radial-gradient(
      900px 420px at 20% -10%,
      color-mix(in srgb, var(--accent-color) 12%, transparent) 0%,
      transparent 65%
    ),
    radial-gradient(
      900px 420px at 120% 10%,
      color-mix(in srgb, var(--primary-color, #0b5bd3) 12%, transparent) 0%,
      transparent 65%
    ),
    var(--background-color);
}

.hero-inner {
  text-align: center;
  max-width: 860px;
  margin: 0 auto;
  padding: clamp(36px, 7vw, 96px) 0;
}

.hero-inner h1 {
  margin: 0 0 10px;
  font-size: clamp(32px, 5.4vw, 48px);
  line-height: 1.12;
}

.sub {
  margin: 0 auto 20px;
  color: var(--muted-color, #9aa0a6);
  max-width: 68ch;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 18px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  border: 1px solid color-mix(in srgb, var(--text-color) 12%, transparent);
  min-height: 44px;
}
.btn.primary {
  background: var(--button-background, #ff5722);
  color: #fff;
}
.btn.primary:hover {
  background: var(--button-background-hover, #e64a19);
}
.btn.large {
  padding: 14px 22px;
  font-size: 1.05rem;
}
</style>
