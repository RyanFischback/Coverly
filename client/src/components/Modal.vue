<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="modal">
      <header class="modal-header">
        <h2>{{ title }}</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </header>

      <section class="modal-body">
        <slot />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
const { visible, title } = defineProps<{ visible: boolean; title: string }>();

const emit = defineEmits<{
  (e: "close"): void;
}>();
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal {
  background: white;
  padding: 24px;
  border-radius: 12px;
  min-width: 320px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
}
</style>
