window.identityState = {
  keyboardShortcut: {},
  storageArea: {
    area: browser.storage.local,

    async setKeyboardShortcut(shortcutId, cookieStoreId) {
      identityState.keyboardShortcut[shortcutId] = cookieStoreId;
      return this.area.set({ [shortcutId]: cookieStoreId });
    },

    async loadKeyboardShortcuts() {
      const identities = await browser.contextualIdentities.query({});
      for (let i = 0; i < backgroundLogic.NUMBER_OF_KEYBOARD_SHORTCUTS; i++) {
        const key = "open_container_" + i;
        const storageObject = await this.area.get(key);
        if (storageObject[key]) {
          identityState.keyboardShortcut[key] = storageObject[key];
          continue;
        }
        if (identities[i]) {
          identityState.keyboardShortcut[key] = identities[i].cookieStoreId;
          continue;
        }
        identityState.keyboardShortcut[key] = "none";
      }
      return identityState.keyboardShortcut;
    },
  },

  init() {
    this.storageArea.loadKeyboardShortcuts();
  }
};

identityState.init();
