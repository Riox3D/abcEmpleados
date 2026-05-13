// src/stores/uiStore.js

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // 🟢 State: A reactive variable to control dialog visibility
  const isPlanningDialogVisible = ref(false);

  // 🟢 Action: A function to change the state
  function hidePlanningDialog() {
    isPlanningDialogVisible.value = false;
  }

  // 🟢 Return the state and action to be used by components
  return { isPlanningDialogVisible, hidePlanningDialog };
});