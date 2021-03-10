const backgroundLogic = {
    NUMBER_OF_KEYBOARD_SHORTCUTS: 10,
    DEFAULT_COOKIE_STORE_ID: "firefox-default",
    NEW_TAB_PAGES: new Set([
        "about:startpage",
        "about:newtab",
        "about:home"
    ]),
    init() {
        browser.commands.onCommand.addListener(backgroundLogic.processHotkey);
        backgroundLogic.watchTabs();
    },
    async replaceTab(tab, cookieStoreId) {
        if (tab.cookieStoreId === cookieStoreId) {
            return
        }

        if (backgroundLogic.NEW_TAB_PAGES.has(tab.url)) {
            tab.url = null
        } else if (!tab.url.startsWith("http")) {
            return;
        }

        let replacementTab = {
            active: tab.active,
            cookieStoreId: cookieStoreId,
            discarded: tab.discarded,
            index: tab.index,
            openerTabId: tab.openerTabId,
            openInReaderMode: tab.isInReaderMode,
            pinned: tab.pinned,
            url: tab.url,
            windowId: tab.windowId
        };

        return Promise.all([
            browser.tabs.create(replacementTab).then(newTab => {
                return browser.tabs.update(newTab.id, {
                    active: tab.active,
                    highlighted: tab.highlighted,
                    muted: tab.muted
                })
            }),
            browser.tabs.remove(tab.id)
        ])
    },
    processHotkey(command) {
        for (let i = 0; i < backgroundLogic.NUMBER_OF_KEYBOARD_SHORTCUTS; i++) {
            const key = "open_container_" + i;
            const cookieStoreId = identityState.keyboardShortcut[key];
            if (cookieStoreId === "none") continue;
            if (command === key) {
                browser.tabs.create({ cookieStoreId });
            } else if (command === "re" + key) {
                browser.tabs.query({ highlighted: true, windowId: browser.windows.WINDOW_ID_CURRENT })
                    .then(tabs => {
                        backgroundLogic.lastCookieStoreId = cookieStoreId;
                        for (tab of tabs) {
                            backgroundLogic.replaceTab(tab, cookieStoreId);
                        }
                    });
            }
        }
    },
    lastCookieStoreId: "",
    setActiveCookieStore() {
        browser.tabs.query({ active: true, windowId: browser.windows.WINDOW_ID_CURRENT })
            .then(tabs => {
                if (tabs[0].cookieStoreId !== backgroundLogic.DEFAULT_COOKIE_STORE_ID) {
                    backgroundLogic.lastCookieStoreId = tabs[0].cookieStoreId;
                }
            });
    },
    watchTabs() {
        backgroundLogic.lastCookieStoreId = backgroundLogic.DEFAULT_COOKIE_STORE_ID;
        backgroundLogic.setActiveCookieStore();

        browser.tabs.onCreated.addListener(tab => {
            if (tab.cookieStoreId === backgroundLogic.DEFAULT_COOKIE_STORE_ID) {
                if (backgroundLogic.NEW_TAB_PAGES.has(tab.url)) {
                    backgroundLogic.replaceTab(tab, backgroundLogic.lastCookieStoreId);
                }
            }
        });
        browser.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
            if (tab.cookieStoreId === backgroundLogic.DEFAULT_COOKIE_STORE_ID) {
                if ("status" in changeInfo && changeInfo.status == "loading" && "url" in changeInfo) {
                    backgroundLogic.replaceTab(tab, backgroundLogic.lastCookieStoreId);
                }
            }
        });

        browser.tabs.onActivated.addListener(backgroundLogic.setActiveCookieStore);
        browser.windows.onFocusChanged.addListener(backgroundLogic.setActiveCookieStore);
    }
};

backgroundLogic.init();