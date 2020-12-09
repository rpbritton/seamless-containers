const messageHandler = {
  init() {
    // Handles messages from webextension code
    browser.runtime.onMessage.addListener(async (m) => {
      let response;
      switch (m.method) {
        case "getShortcuts":
          response = identityState.storageArea.loadKeyboardShortcuts();
          break;
        case "setShortcut":
          identityState.storageArea.setKeyboardShortcut(m.shortcut, m.cookieStoreId);
          break;
      }
      return response;
    });
  }
};

// Lets do this last as theme manager did a check before connecting before
messageHandler.init();
