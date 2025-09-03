<template>
  <div class="cover-letter-page">
    <div class="app-grid">
      <!-- LEFT: Form -->
      <div class="left">
        <form @submit.prevent="fetchOAIResult" novalidate>
          <!-- Required fields (stacked, full-width, but contained) -->
          <div class="section">
            <div class="section-header">
              <h2>Job Posting</h2>
              <p class="hint">
                Paste the full posting (responsibilities, requirements, etc.).
              </p>
            </div>
            <label class="sr-only" for="jobPosting"
              >Enter the full job posting</label
            >
            <textarea
              id="jobPosting"
              v-model="jobPosting"
              placeholder="Paste the full job posting here..."
              required
              @input="onTAInput"
              ref="jobPostingEl"
            />
            <div class="meta-row">
              <small>{{ counts.jobPosting }} characters</small>
            </div>
          </div>

          <div class="section">
            <div class="section-header">
              <h2>Your Resume</h2>
              <p class="hint">
                Paste your resume or a concise experience summary.
              </p>
            </div>
            <label class="sr-only" for="userInfo">Paste your resume text</label>
            <textarea
              id="userInfo"
              v-model="userInfo"
              placeholder="Paste your resume or a concise summary of your experience..."
              required
              @input="onTAInput"
              ref="userInfoEl"
            />
            <!-- <div class="resume-upload">
              <input
                type="file"
                id="resumeFile"
                accept=".pdf,.doc,.docx,.txt"
                @change="onResumeSelected"
                ref="resumeFileInput"
                hidden
              />
              <button
                type="button"
                class="pill"
                @click="resumeFileInput?.click()"
              >
                Upload Resume
              </button>
            </div> -->
            <div class="meta-row">
              <small>{{ counts.userInfo }} characters</small>
            </div>
          </div>

          <!-- Optional Details -->
          <div class="section">
            <details class="optional" :open="hasAnyOptional">
              <summary>
                Optional details (company, role, location, etc.)
                <span class="summary-note" v-if="hasAnyOptional">• filled</span>
              </summary>

              <div class="optional-grid">
                <div class="field">
                  <label for="companyName">Company</label>
                  <input
                    id="companyName"
                    v-model="optional.companyName"
                    placeholder="e.g., Coverly Inc."
                  />
                </div>
                <div class="field">
                  <label for="roleTitle">Role Title</label>
                  <input
                    id="roleTitle"
                    v-model="optional.roleTitle"
                    placeholder="e.g., Frontend Engineer"
                  />
                </div>
                <div class="field">
                  <label for="location">Location</label>
                  <input
                    id="location"
                    v-model="optional.location"
                    placeholder="e.g., Halifax, NS"
                  />
                </div>
                <div class="field">
                  <label for="jobUrl">Job URL</label>
                  <input
                    id="jobUrl"
                    v-model="optional.jobUrl"
                    placeholder="https://..."
                    inputmode="url"
                  />
                </div>
                <div class="field">
                  <label for="hiringManager">Hiring Manager</label>
                  <input
                    id="hiringManager"
                    v-model="optional.hiringManager"
                    placeholder="e.g., Jane Doe"
                  />
                </div>
                <div class="field">
                  <label for="tone">Tone</label>
                  <select id="tone" v-model="optional.tone">
                    <option value="">(auto)</option>
                    <option value="professional">Professional</option>
                    <option value="friendly">Friendly</option>
                    <option value="enthusiastic">Enthusiastic</option>
                    <option value="formal">Formal</option>
                    <option value="gen-z">Gen-Z</option>
                  </select>
                </div>
              </div>

              <!-- Custom key/value pairs -->
              <div class="kv-wrap">
                <h3>Custom fields</h3>
                <div
                  v-for="(row, idx) in customFields"
                  :key="row.id"
                  class="kv-row"
                >
                  <input
                    :id="`kv-key-${idx}`"
                    v-model="row.key"
                    placeholder="Field (e.g., companyLocation)"
                    class="kv-key"
                  />
                  <input
                    :id="`kv-val-${idx}`"
                    v-model="row.value"
                    placeholder="Value (e.g., Toronto, ON)"
                    class="kv-val"
                  />
                  <button
                    type="button"
                    class="pill danger"
                    aria-label="Remove field"
                    @click="removeCustomField(idx)"
                  >
                    ✕
                  </button>
                </div>
                <button type="button" class="pill" @click="addCustomField">
                  + Add field
                </button>
              </div>

              <!-- Freeform optional areas -->
              <div class="field-stack">
                <label for="companyDetails">Company notes (optional)</label>
                <textarea
                  id="companyDetails"
                  v-model="companyDetails"
                  placeholder="Anything else about the company you'd like to include..."
                  @input="onTAInput"
                />
                <div class="meta-row">
                  <small>{{ counts.companyDetails }} characters</small>
                </div>

                <label for="extraInfo">Other notes (optional)</label>
                <textarea
                  id="extraInfo"
                  v-model="extraInfo"
                  placeholder="Any additional preferences or constraints..."
                  @input="onTAInput"
                />
                <div class="meta-row">
                  <small>{{ counts.extraInfo }} characters</small>
                </div>
              </div>
            </details>
          </div>

          <!-- Sticky submit (mobile-first) -->
          <div class="form-footer">
            <div class="progress" aria-hidden="true">
              <span :class="['dot', jobPosting.trim() ? 'done' : '']"></span>
              <span :class="['dot', userInfo.trim() ? 'done' : '']"></span>
              <span class="progress-text">{{ completionPct }}% ready</span>
            </div>

            <button
              type="submit"
              :disabled="!isFormValid || loading"
              :title="
                !isFormValid ? 'Fill the required fields to enable submit' : ''
              "
            >
              <span v-if="loading" class="spinner" aria-hidden="true"></span>
              <Text v-else :disabled="!isFormValid">Generate Cover Letter</Text>
            </button>
          </div>

          <p class="shortcut-hint">
            Tip: press <kbd>⌘</kbd>/<kbd>Ctrl</kbd> + <kbd>Enter</kbd> to
            generate
          </p>
        </form>
      </div>

      <!-- RIGHT: Sticky preview/result -->
      <aside class="right">
        <div class="preview-card" ref="previewEl">
          <div v-if="apiResult" class="api-result-window">
            <div class="window-header">
              <span>Result</span>
              <div class="header-buttons">
                <button
                  type="button"
                  class="action-btn"
                  @click="copyToClipboard"
                >
                  <span class="icon" aria-hidden="true">📋</span>
                  <span>Copy</span>
                </button>
                <button type="button" class="action-btn" @click="exportToPDF">
                  <span class="icon" aria-hidden="true">📄</span>
                  <span>Export PDF</span>
                </button>
              </div>
            </div>
            <div class="window-body">
              <div v-html="apiResult" class="formatted-result"></div>
            </div>
          </div>

          <!-- Improved empty state -->
          <div v-else class="empty-preview">
            <div class="empty-icon" aria-hidden="true">✍️</div>
            <h3>Ready when you are</h3>
            <p class="empty-sub">
              Paste the job posting and your resume, then hit <em>Generate</em>.
              Your letter will appear here.
            </p>

            <ul class="empty-list">
              <li><strong>Step 1:</strong> Paste the full job posting</li>
              <li><strong>Step 2:</strong> Paste your resume</li>
              <li>
                <strong>Optional:</strong> Add company, role, location & tone
              </li>
            </ul>

            <div class="tips">
              <span class="chip">Use a clear role title</span>
              <span class="chip">Add hiring manager if known</span>
              <span class="chip">Keep resume paste tidy</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
  <!-- <SignupModal
    :visible="showSignupModal"
    @close="showSignupModal = false"
    @signedUp="auth = $event"
  /> -->
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted } from "vue";
import axios from "axios";
import jsPDF from "jspdf";
import Text from "../components/Text.vue";
// import SignupModal from "../components/SignupModal.vue";

type Tone =
  | ""
  | "professional"
  | "friendly"
  | "enthusiastic"
  | "formal"
  | "gen-z";
interface OptionalBlock {
  companyName?: string;
  roleTitle?: string;
  location?: string;
  jobUrl?: string;
  hiringManager?: string;
  tone?: Tone;
}
interface CustomFieldRow {
  id: string;
  key: string;
  value: string;
}

const jobPosting = ref<string>("");
const userInfo = ref<string>("");

const optional = ref<OptionalBlock>({});
const companyDetails = ref<string>("");
const extraInfo = ref<string>("");

const customFields = ref<CustomFieldRow[]>([]);

const apiResult = ref<string>("");
const loading = ref<boolean>(false);

// const showSignupModal = ref(false);
// const auth = ref<{ token?: string; user?: any }>({});
// const resumeFileInput = ref<HTMLInputElement | null>(null);

const counts = ref<Record<string, number>>({
  jobPosting: 0,
  userInfo: 0,
  companyDetails: 0,
  extraInfo: 0,
});

const updateCounts = () => {
  counts.value.jobPosting = jobPosting.value.length;
  counts.value.userInfo = userInfo.value.length;
  counts.value.companyDetails = companyDetails.value.length;
  counts.value.extraInfo = extraInfo.value.length;
};

const autoGrow = (ta: HTMLTextAreaElement | null) => {
  if (!ta) return;
  ta.style.height = "auto";
  ta.style.height = Math.min(ta.scrollHeight, 300) + "px"; // cap
  ta.style.overflowY = ta.scrollHeight > 300 ? "auto" : "hidden";
};

const onTAInput = (e: Event) => {
  updateCounts();
  autoGrow(e.target as HTMLTextAreaElement);
};

const isFormValid = computed(
  () => jobPosting.value.trim() !== "" && userInfo.value.trim() !== ""
);
const hasAnyOptional = computed(() => {
  const o = optional.value;
  const hasStructured = !!(
    o.companyName ||
    o.roleTitle ||
    o.location ||
    o.jobUrl ||
    o.hiringManager ||
    o.tone
  );
  const hasTextAreas = !!(companyDetails.value || extraInfo.value);
  const hasCustom = customFields.value.some((r) => r.key || r.value);
  return hasStructured || hasTextAreas || hasCustom;
});
const completionPct = computed(() => {
  let filled = 0;
  if (jobPosting.value.trim()) filled++;
  if (userInfo.value.trim()) filled++;
  return Math.round((filled / 2) * 100);
});

// API helpers
const rawApiUrl = import.meta.env.VITE_API_URL || "";
const baseUrl = rawApiUrl.replace(/\/+$/, "");
const url = (path: string) => `${baseUrl}${path}`;
const healthCheckUrl = url("/api/health");

const checkServerHealth = async (): Promise<boolean> => {
  try {
    const healthResponse = await axios.get(healthCheckUrl, { timeout: 5000 });
    return healthResponse.status === 200;
  } catch (error: any) {
    if (
      error?.code === "ECONNABORTED" ||
      String(error?.message || "").includes("timeout")
    ) {
      alert("The server is waking up, this may take a minute...");
    } else {
      alert("An unexpected server error occurred. Please try again later.");
    }
    return false;
  }
};

const sanitizeInput = (input: string) =>
  input.replace(/</g, "&lt;").replace(/>/g, "&gt;");

const payload = computed(() => {
  const custom: Record<string, string> = {};
  for (const row of customFields.value) {
    const k = row.key.trim();
    const v = row.value.trim();
    if (k && v) custom[k] = v;
  }
  const opt: Record<string, string> = {};
  Object.entries(optional.value || {}).forEach(([k, v]) => {
    if (v) opt[k] = String(v);
  });
  if (Object.keys(custom).length) opt.custom = JSON.stringify(custom);

  return {
    jobPosting: sanitizeInput(jobPosting.value),
    userInfo: sanitizeInput(userInfo.value),
    companyDetails: sanitizeInput(companyDetails.value),
    extraInfo: sanitizeInput(extraInfo.value),
    optional: opt,
  };
});

const previewEl = ref<HTMLElement | null>(null);
const jobPostingEl = ref<HTMLTextAreaElement | null>(null);
const userInfoEl = ref<HTMLTextAreaElement | null>(null);
// Convert plain text to minimal HTML paragraphs with controlled spacing
const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const textToHtmlParas = (raw: string) => {
  const normalized = raw.replace(/\r\n/g, "\n").trim();
  if (!normalized) return "";
  const blocks = normalized.split(/\n{2,}/); // paragraphs = 2+ newlines
  return blocks
    .map((b) => `<p>${escapeHtml(b).replace(/\n/g, "<br>")}</p>`)
    .join("");
};

// If response is HTML, lightly normalize <br> floods; else convert text → HTML
const formatResultHTML = (raw: string) => {
  const looksLikeHTML = /<\/?[a-z][\s\S]*>/i.test(raw);
  if (looksLikeHTML) {
    return raw.replace(/(<br\s*\/?>\s*){3,}/gi, "<br><br>");
  }
  return textToHtmlParas(raw);
};
const fetchOAIResult = async () => {
  loading.value = true;
  await checkServerHealth();
  try {
    const response = await axios.post(url("/api/openai/fetch"), payload.value);
    if (response.status !== 200)
      throw new Error(response.statusText || "Request failed");
    apiResult.value = formatResultHTML(String(response.data || ""));
    await nextTick();
    previewEl.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  } catch (error: any) {
    if (error?.response?.status === 429) {
      const retryAfter = error.response.headers?.["retry-after"];
      const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : 60000;
      alert(
        `Rate limit exceeded. Please wait ${Math.ceil(waitTime / 1000)} seconds`
      );
    } else if (error?.response?.status === 400) {
      alert(
        `Error fetching result: ${error.response.data?.error || "Bad request"}`
      );
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  } finally {
    loading.value = false;
  }
};

const copyToClipboard = async () => {
  try {
    if (!apiResult.value) return alert("Nothing to copy!");
    const el = document.createElement("div");
    el.innerHTML = apiResult.value;
    const text = el.innerText || el.textContent || "";
    await navigator.clipboard.writeText(text.trim());
    alert("Copied to clipboard!");
  } catch (err) {
    console.error("Failed to copy to clipboard: ", err);
    alert("Failed to copy to clipboard.");
  }
};
const exportToPDF = () => {
  if (!apiResult.value) return alert("No content to export!");
  const doc = new jsPDF();
  doc.setFontSize(12);
  doc.setFont("Helvetica", "normal");
  const margin = 16;
  const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;

  const tmp = document.createElement("div");
  tmp.innerHTML = apiResult.value;
  const plain = (tmp.innerText || "").trim();
  const lines = doc.splitTextToSize(plain, maxWidth);
  let y = margin;
  lines.forEach((line: any) => {
    if (y > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 7;
  });
  doc.save("cover-letter.pdf");
};
const addCustomField = () => {
  customFields.value.push({ id: cryptoRandomId(), key: "", value: "" });
};
const removeCustomField = (idx: number) => {
  customFields.value.splice(idx, 1);
};
const cryptoRandomId = () => Math.random().toString(36).slice(2, 10);

// Keyboard shortcut: Cmd/Ctrl + Enter
const keyHandler = (e: KeyboardEvent) => {
  if (
    (e.metaKey || e.ctrlKey) &&
    e.key === "Enter" &&
    isFormValid.value &&
    !loading.value
  ) {
    e.preventDefault();
    fetchOAIResult();
  }
};

// const onResumeSelected = async (e: Event) => {
//   const file = (e.target as HTMLInputElement).files?.[0];
//   if (!file) return;

//   // If not logged in, show signup modal first
//   if (!auth.value.token) {
//     showSignupModal.value = true;
//     return;
//   }

//   // If logged in → upload
//   const formData = new FormData();
//   formData.append("file", file);

//   // Example: if you want to push to GraphQL uploadResume mutation
//   const response = await axios.post(
//     import.meta.env.VITE_API_URL + "/graphql",
//     {
//       query: `
//       mutation UploadResume($url: String!, $fileName: String, $fileType: String) {
//         uploadResume(fileUrl: $url, fileName: $fileName, fileType: $fileType) {
//           id url uploadedAt
//         }
//       }
//     `,
//       variables: {
//         // url: "https://s3/your-upload", // TODO: configure s3
//         fileName: file.name,
//         fileType: file.type,
//       },
//     },
//     {
//       headers: { Authorization: `Bearer ${auth.value.token}` },
//     }
//   );
// };

onMounted(() => {
  updateCounts();
  autoGrow(jobPostingEl.value);
  autoGrow(userInfoEl.value);
  window.addEventListener("keydown", keyHandler);
});
</script>

<style scoped>
/* Accessibility helper */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  border: 0;
  padding: 0;
  clip: rect(0 0 0 0);
  overflow: hidden;
}

/* --- Layout: contain everything; no leaks --- */
.cover-letter-page {
  padding: 32px clamp(12px, 2.2vw, 28px);
  display: flex;
  justify-content: center;
  background: var(--background-color);
  color: var(--text-color);
}

.app-grid {
  width: min(1120px, 92%);
  margin: 0 auto;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: clamp(16px, 2vw, 24px);
}

.left,
.right {
  min-width: 0;
} /* critical to prevent overflow from children */

@media (max-width: 1024px) {
  .app-grid {
    grid-template-columns: 1fr;
  }
}

/* Cards */
.section,
.preview-card {
  background: var(--section-background);
  border: 1px solid color-mix(in srgb, var(--text-color) 8%, transparent);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  padding: clamp(16px, 2vw, 24px);
  overflow: hidden; /* contain inner controls */
}

/* Headings */
.section-header h2 {
  margin: 0 0 6px;
  font-size: 1.1rem;
}
.hint {
  margin: 0;
  color: var(--muted-color, #8b8f98);
  font-size: 0.95rem;
}

/* --- Form controls: never exceed column width --- */
textarea,
input,
select {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid #cfcfcf;
  border-radius: 12px;
  background: var(--background-color);
  color: var(--text-color);
  padding: 12px 14px;
  outline: none;
  font: inherit;
  min-height: 44px;
  transition: box-shadow 0.15s ease, border-color 0.15s ease,
    background-color 0.15s ease;
  overflow-wrap: anywhere; /* long unbroken strings won't cause overflow */
  word-break: break-word;
}
textarea {
  resize: vertical;
  min-height: 220px;
  line-height: 1.5;
}

textarea:focus,
input:focus,
select:focus {
  border-color: var(--accent-color, #ff5722);
  box-shadow: 0 0 0 5px
    color-mix(in srgb, var(--accent-color, #ff5722) 22%, transparent);
  background: color-mix(in srgb, var(--background-color) 94%, transparent);
}

.meta-row {
  display: flex;
  justify-content: flex-end;
  margin-top: 8px;
  color: var(--muted-color, #8b8f98);
}

/* Optional accordion */
details.optional summary {
  cursor: pointer;
  list-style: none;
  font-weight: 700;
  margin: -2px 0 10px;
  display: flex;
  align-items: center;
  gap: 8px;
}
details.optional summary::-webkit-details-marker {
  display: none;
}
details.optional summary::after {
  content: " ▸";
}
details.optional[open] summary::after {
  content: " ▾";
}
.summary-note {
  font-weight: 600;
  color: var(--accent-color, #ff5722);
}

/* Grids that WON'T overflow */
.optional-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  margin-bottom: 12px;
}
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}
.field * {
  min-width: 0;
}

.kv-wrap {
  margin: 6px 0 12px;
}
.kv-wrap h3 {
  font-size: 0.98rem;
  margin: 10px 0;
}
.kv-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto; /* prevent intrinsic min-width overflow */
  gap: 8px;
  align-items: center;
  margin-bottom: 8px;
}
.kv-key,
.kv-val {
  width: 100%;
  max-width: 100%;
}

.field-stack {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* Sticky submit bar */
.form-footer {
  position: sticky;
  bottom: 0;
  z-index: 5;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  margin-top: 8px;
  background: linear-gradient(
      to top,
      color-mix(in srgb, var(--section-background) 96%, transparent),
      transparent 38%
    ),
    var(--section-background);
  border: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
}
.progress {
  display: flex;
  align-items: center;
  gap: 10px;
}
.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d1d5db;
}
.dot.done {
  background: var(--accent-color, #ff5722);
}
.progress-text {
  font-size: 0.95rem;
  color: var(--muted-color, #8b8f98);
}

/* Buttons */
button[type="submit"],
.pill,
.btn {
  background-color: var(--button-background, #ff5722);
  color: #ffffff;
  border: none;
  padding: 12px 18px;
  cursor: pointer;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.12s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
button[type="submit"]:disabled {
  background-color: #c9c9c9;
  cursor: not-allowed;
}
button[type="submit"]:hover:not(:disabled) {
  background-color: var(--button-background-hover, #e64a19);
  transform: translateY(-1px);
}
.pill.danger {
  background: #ef4444;
}

/* Right column */
.right {
  position: relative;
  min-width: 0;
}
.preview-card {
  position: sticky;
  top: 10px;
}

/* Result window */
.api-result-window {
  border: 1px solid #e5e5e5;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1);
  background: var(--section-background);
}
.window-header {
  background-color: var(--header-background);
  padding: 12px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e5e5e5;
  color: var(--text-color);
  font-weight: bold;
}
.header-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 10px;
  background: transparent;
  color: var(--text-color);
  border: 1px solid color-mix(in srgb, var(--text-color) 18%, transparent);
  cursor: pointer;
  font: inherit; /* ensures no italics */
  font-weight: 600;
  line-height: 1;
  height: 34px;
  transition: background-color 0.15s ease, border-color 0.15s ease;
}

.action-btn:hover {
  background: color-mix(in srgb, var(--text-color) 10%, transparent);
  border-color: color-mix(in srgb, var(--text-color) 28%, transparent);
}

.action-btn .icon {
  font-style: normal; /* explicit: not italic */
}
.window-header .copy-content,
.window-header .export-content {
  cursor: pointer;
  color: var(--accent-color, #ff5722);
}
.window-header .copy-content:hover,
.window-header .export-content:hover {
  text-decoration: underline;
}
.copy-icon,
.export-icon {
  margin-right: 6px;
}

.window-body {
  padding: clamp(14px, 1.8vw, 20px);
  background-color: var(--section-background);
  color: var(--text-color);
  text-align: left;
}

.formatted-result {
  /* IMPORTANT: no pre-wrap now that we generate clean HTML */
  white-space: normal;
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue",
    Arial, "Noto Sans", sans-serif;
  line-height: 1.55;
  max-width: 68ch;
}

/* Compact but airy spacing */
.formatted-result p {
  margin: 0 0 10px;
}
.formatted-result p:last-child {
  margin-bottom: 0;
}
.formatted-result ul,
.formatted-result ol {
  margin: 8px 0 10px 20px;
  padding: 0;
}
.formatted-result li {
  margin: 4px 0;
}
.formatted-result h1,
.formatted-result h2,
.formatted-result h3 {
  margin: 8px 0 6px;
  line-height: 1.25;
}

/* Improved empty state */
.empty-preview {
  text-align: center;
  padding: clamp(18px, 2.2vw, 24px);
  border: 1px dashed color-mix(in srgb, var(--text-color) 20%, transparent);
  border-radius: 16px;
  background: color-mix(in srgb, var(--section-background) 92%, transparent);
}
.empty-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}
.empty-sub {
  color: var(--muted-color, #8b8f98);
  margin: 4px auto 10px;
  max-width: 60ch;
}
.empty-list {
  text-align: left;
  display: grid;
  gap: 6px;
  grid-template-columns: 1fr;
  max-width: 520px;
  margin: 0 auto 10px;
  padding-left: 0;
  list-style: none;
}
.empty-list li {
  padding-left: 0;
}
.tips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin: 10px 0 6px;
}
.chip {
  border: 1px solid color-mix(in srgb, var(--text-color) 18%, transparent);
  border-radius: 999px;
  padding: 6px 10px;
  font-size: 0.9rem;
  background: var(--section-background);
}
.empty-cta {
  margin-top: 8px;
}

/* Footer hint */
.shortcut-hint {
  margin: 10px 4px 0;
  color: var(--muted-color, #8b8f98);
  font-size: 0.9rem;
}
kbd {
  background: color-mix(in srgb, var(--text-color) 8%, transparent);
  border: 1px solid color-mix(in srgb, var(--text-color) 18%, transparent);
  border-radius: 6px;
  padding: 2px 6px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", monospace;
}

/* Spinner */
.spinner {
  border: 3px solid rgba(0, 0, 0, 0.08);
  border-left: 3px solid #ffffff;
  border-radius: 50%;
  width: 22px;
  height: 22px;
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

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
  }
}
</style>
