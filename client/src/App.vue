<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";

const isDarkMode = ref(true);
const isMenuOpen = ref(false);
const router = useRouter();

function applyTheme() {
  const theme = isDarkMode.value ? "dark" : "light";
  document.documentElement.setAttribute("data-theme", theme);
  document.body.classList.toggle("dark-mode", isDarkMode.value);
  document.body.classList.toggle("light-mode", !isDarkMode.value);
  localStorage.setItem("coverly-theme", theme);
}

function toggleDarkMode() {
  isDarkMode.value = !isDarkMode.value;
  applyTheme();
}

function toggleMenu() { isMenuOpen.value = !isMenuOpen.value; }
router.afterEach(() => { isMenuOpen.value = false; });

onMounted(() => {
  const saved = localStorage.getItem("coverly-theme");
  if (saved === "dark" || saved === "light") {
    isDarkMode.value = saved === "dark";
  } else {
    isDarkMode.value = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? true;
  }
  applyTheme();

  // follow OS only if user hasn't chosen manually
  const mq = window.matchMedia?.("(prefers-color-scheme: dark)");
  mq?.addEventListener?.("change", (e) => {
    if (!localStorage.getItem("coverly-theme")) {
      isDarkMode.value = e.matches;
      applyTheme();
    }
  });
});

watch(isDarkMode, applyTheme);

// Export the toggler if your button calls it
// (make sure your toggle button uses @click="toggleDarkMode")
</script>


<template>
  <div id="app">
    <a href="#main" class="skip-link">Skip to content</a>

    <header class="site-header">
      <div class="container nav-row">
        <router-link to="/" class="brand">
          <span class="logo-dot" aria-hidden="true"></span>
          <span class="brand-word">Coverly</span>
        </router-link>

        <button
          class="nav-toggle"
          @click="toggleMenu"
          :aria-expanded="isMenuOpen ? 'true' : 'false'"
          aria-controls="primary-menu"
          title="Menu"
        >
          <span class="bar" />
          <span class="bar" />
          <span class="bar" />
          <span class="sr-only">Toggle menu</span>
        </button>

        <nav class="site-nav" aria-label="Primary">
          <ul class="nav-links" :class="{ open: isMenuOpen }" id="primary-menu">
            <li><router-link to="/" exact-active-class="active">Home</router-link></li>
            <li><router-link to="/about" exact-active-class="active">About</router-link></li>
            <li><router-link to="/cover-letter" exact-active-class="active">Cover Letter</router-link></li>
            <li><router-link to="/contact" exact-active-class="active">Contact</router-link></li>

            <li class="divider" aria-hidden="true"></li>

            <!-- NEW: pill toggle (no dependency on the old slider UI) -->
            <li>
              <button
                class="theme-toggle"
                :aria-pressed="isDarkMode"
                :title="isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'"
                @click="toggleDarkMode"
              >
                <span class="thumb" :class="{ right: !isDarkMode }"></span>
                <span class="icon left" aria-hidden="true">🌙</span>
                <span class="icon right" aria-hidden="true">☀️</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <main id="main">
      <router-view />
    </main>

    <footer class="site-footer">
      <div class="container">
        <p>&copy; 2025 Ryan Fischback. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style>
/* ——— Skip link ——— */
.skip-link{position:absolute;left:-9999px;top:-9999px}
.skip-link:focus{left:12px;top:12px;z-index:9999;background:var(--section-background);color:var(--text-color);padding:8px 12px;border-radius:8px;border:1px solid color-mix(in srgb,var(--text-color) 20%,transparent);text-decoration:none}

/* ——— Header ——— */
.site-header{position:sticky;top:0;z-index:1000;backdrop-filter:saturate(140%) blur(10px);background:var(--navbar-background);border-bottom:1px solid color-mix(in srgb,var(--text-color) 12%,transparent)}
.nav-row{display:flex;align-items:center;justify-content:space-between;gap:16px;padding:10px 0}

/* Brand */
.brand{display:inline-flex;align-items:center;gap:10px;text-decoration:none;color:var(--text-color);font-weight:800;letter-spacing:.2px;font-size:1.2rem;line-height:1}
.logo-dot{width:18px;height:18px;border-radius:50%;background:linear-gradient(135deg,var(--button-background),#ff7d4a);box-shadow:0 0 0 3px color-mix(in srgb,var(--text-color) 10%,transparent)}

/* Nav */
.site-nav{position:relative}
.nav-links{display:flex;align-items:center;gap:12px;list-style:none;margin:0;padding:0}
.nav-links a{color:var(--text-color);text-decoration:none;padding:8px 10px;border-radius:10px;display:inline-flex;align-items:center;height:40px;transition:background-color .2s ease}
.nav-links a:hover,.nav-links a.active{background:color-mix(in srgb,var(--text-color) 12%,transparent)}
.divider{width:1px;height:24px;background:color-mix(in srgb,var(--text-color) 16%,transparent);margin:0 4px}

/* CTA */
.nav-cta{background:var(--button-background);color:#fff!important;padding:10px 14px;border-radius:12px;border:1px solid color-mix(in srgb,var(--button-background) 20%,transparent)}
.nav-cta:hover{background:var(--button-background-hover)}

/* Hamburger */
.nav-toggle{display:none;position:relative;width:44px;height:36px;border:1px solid color-mix(in srgb,var(--text-color) 18%,transparent);background:transparent;color:var(--text-color);border-radius:10px;cursor:pointer}
.nav-toggle .bar{position:absolute;left:9px;right:9px;height:2px;background:var(--text-color)}
.nav-toggle .bar:nth-child(1){top:10px}.nav-toggle .bar:nth-child(2){top:17px}.nav-toggle .bar:nth-child(3){top:24px}

@media (max-width:960px){
  .nav-toggle{display:inline-flex;align-items:center;justify-content:center}
  .nav-links{position:absolute;right:0;top:calc(100% + 10px);flex-direction:column;align-items:stretch;gap:6px;padding:10px;min-width:230px;background:var(--section-background);border:1px solid color-mix(in srgb,var(--text-color) 10%,transparent);border-radius:12px;box-shadow:0 12px 30px rgba(0,0,0,.15);display:none}
  .nav-links.open{display:flex}
  .divider{display:none}
  .cta-li{order:3}
}

/* ——— Pill theme toggle (independent of old slider CSS) ——— */
.theme-toggle{
  position:relative; width:64px; height:32px; border-radius:999px;
  border:1px solid color-mix(in srgb,var(--text-color) 18%,transparent);
  background:color-mix(in srgb,var(--text-color) 12%,transparent);
  cursor:pointer; display:inline-flex; align-items:center; justify-content:center;
}
.theme-toggle .thumb{
  position:absolute; left:3px; top:3px;
  width:26px; height:26px; border-radius:50%;
  background:var(--section-background);
  box-shadow:0 2px 6px rgba(0,0,0,.15);
  transform:translateX(0); transition:transform .18s ease;
}
.theme-toggle .thumb.right{ transform:translateX(32px); }
.theme-toggle .icon{ position:absolute; font-size:14px; opacity:.9 }
.theme-toggle .icon.left{ left:10px } .theme-toggle .icon.right{ right:10px }

/* Footer */
.site-footer{background:var(--footer-background);color:var(--text-color);text-align:center;padding:20px 0 32px;border-top:1px solid color-mix(in srgb,var(--text-color) 10%,transparent)}

/* Focus */
:focus-visible{outline:3px solid color-mix(in srgb,var(--accent-color) 55%,transparent);outline-offset:2px}
</style>
