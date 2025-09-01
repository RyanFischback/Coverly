<!-- src/views/Contact.vue -->
<template>
  <div class="contact-page">
    <section class="contact">
      <div class="container">
        <article class="contact-card">
          <header class="header">
            <h1>Contact</h1>
            <p class="sub">
              Reach out for any inquiries or feedback—Coverly is here to make
              your life easier.
            </p>
          </header>

          <form @submit.prevent="sendMessage" novalidate>
            <div class="grid">
              <div class="field">
                <label for="name">Name</label>
                <input
                  id="name"
                  type="text"
                  v-model.trim="form.name"
                  placeholder="Your name"
                  required
                  autocomplete="name"
                />
              </div>

              <div class="field">
                <label for="email">Email</label>
                <input
                  id="email"
                  type="email"
                  v-model.trim="form.email"
                  placeholder="you@example.com"
                  required
                  autocomplete="email"
                  inputmode="email"
                />
              </div>
            </div>

            <div class="field">
              <label for="message">Message</label>
              <textarea
                id="message"
                v-model.trim="form.message"
                placeholder="How can we help?"
                required
                rows="6"
                @input="autoGrow($event)"
              ></textarea>
            </div>

            <div class="actions">
              <button type="submit" :disabled="loading">
                <span v-if="loading" class="spinner" aria-hidden="true"></span>
                <span>{{ loading ? "Sending..." : "Send message" }}</span>
              </button>
            </div>

            <p
              v-if="status"
              class="status"
              :class="statusType"
              role="status"
              aria-live="polite"
            >
              {{ status }}
            </p>
          </form>
        </article>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const form = ref({ name: "", email: "", message: "" });
const loading = ref(false);
const status = ref("");
const statusType = ref<"success" | "error">("success");

const apiUrl = import.meta.env.VITE_API_URL;

const autoGrow = (e: Event) => {
  const ta = e.target as HTMLTextAreaElement;
  ta.style.height = "auto";
  ta.style.height = Math.min(ta.scrollHeight, 900) + "px";
};

const sendMessage = async () => {
  if (!form.value.name || !form.value.email || !form.value.message) return;
  loading.value = true;
  status.value = "";

  try {
    const response = await fetch(`${apiUrl}/api/contact/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form.value),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok)
      throw new Error(data?.error || response.statusText || "Failed to send");

    statusType.value = "success";
    status.value = data?.success || "Thanks! Your message has been sent.";
    form.value = { name: "", email: "", message: "" };
  } catch (err: any) {
    statusType.value = "error";
    status.value = err?.message || "Something went wrong. Please try again.";
    console.error("Error sending message:", err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Neutralize any aggressive global section rules */
.contact-page .contact {
  display: block;
  min-height: auto;
  padding: clamp(28px, 5vw, 64px) 0;
  background: var(--section-background);
  text-align: left;
}

.contact-card {
  max-width: 760px;
  margin: 0 auto;
  padding: clamp(18px, 2.6vw, 28px);
  background: var(--section-background);
  border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}

.header h1 {
  margin: 0 0 6px;
  font-size: clamp(24px, 3.4vw, 32px);
  line-height: 1.15;
}
.sub {
  margin: 0 0 16px;
  color: var(--muted-color, #8b8f98);
}

/* Robust grid: no overlap, wraps gracefully */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
  margin-bottom: 8px;
}

/* Let form controls shrink properly inside grid columns */
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.field * {
  min-width: 0;
}

label {
  font-weight: 600;
}

input,
textarea {
  width: 100%;
  max-width: 100%;
  border: 1px solid #cfcfcf;
  border-radius: 12px;
  background: var(--background-color);
  color: var(--text-color);
  padding: 12px 14px;
  outline: none;
  font: inherit;
  min-height: 44px; /* touch target */
  transition: box-shadow 0.15s ease, border-color 0.15s ease,
    background-color 0.15s ease;
  box-sizing: border-box;
}
textarea {
  line-height: 1.5;
  resize: vertical;
  min-height: 160px;
}

input:focus,
textarea:focus {
  border-color: var(--accent-color, #ff5722);
  box-shadow: 0 0 0 5px
    color-mix(in srgb, var(--accent-color, #ff5722) 22%, transparent);
  background: color-mix(in srgb, var(--background-color) 94%, transparent);
}

/* Actions */
.actions {
  display: flex;
  justify-content: flex-start;
  gap: 12px;
  margin-top: 6px;
}
button[type="submit"] {
  background: var(--button-background, #ff5722);
  color: #fff;
  border: 1px solid
    color-mix(in srgb, var(--button-background, #ff5722) 20%, transparent);
  padding: 12px 18px;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  min-height: 44px;
  transition: background-color 0.2s, transform 0.12s;
}
button[type="submit"]:hover {
  background: var(--button-background-hover, #e64a19);
  transform: translateY(-1px);
}
button[type="submit"]:disabled {
  background: #c9c9c9;
  cursor: not-allowed;
  transform: none;
}

/* Status message */
.status {
  margin-top: 10px;
}
.status.success {
  color: #16a34a;
}
.status.error {
  color: #ef4444;
}

/* Spinner */
.spinner {
  border: 3px solid rgba(255, 255, 255, 0.35);
  border-left: 3px solid #ffffff;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-right: 10px;
  vertical-align: middle;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
