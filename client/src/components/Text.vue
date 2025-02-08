<template>
  <span
    :class="[computedClass, { 'text-disabled': disabled }]"
    :aria-disabled="disabled"
  >
    <slot></slot>
  </span>
</template>

<script>
export default {
  props: {
    variant: {
      type: String,
      default: "default",
      validator: (value) =>
        ["default", "primary", "secondary", "danger"].includes(value),
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    variant(newVal, oldVal) {
      console.log(`🔄 Variant changed: ${oldVal} → ${newVal}`);
    },
    disabled(newVal, oldVal) {
      console.log(`🔄 Disabled changed: ${oldVal} → ${newVal}`);
    },
  },
  computed: {
    computedClass() {
      return `text-${this.variant}`;
    },
  },
};
</script>

<style scoped>
.text-default {
  font-size: 16px;
  color: #333;
}

.text-primary {
  font-size: 18px;
  font-weight: bold;
  color: blue;
}

.text-secondary {
  font-size: 16px;
  color: gray;
}

.text-danger {
  font-size: 16px;
  color: red;
}

.text-disabled {
  opacity: 0.6;
  pointer-events: none;
}
</style>
