const NUMBER_OF_KEYBOARD_SHORTCUTS = 10;

async function setupOptions() {
    setupContainerShortcutSelects();
}

async function setupContainerShortcutSelects() {
    const keyboardShortcut = await browser.runtime.sendMessage({ method: "getShortcuts" });
    const identities = await browser.contextualIdentities.query({});
    const fragment = document.createDocumentFragment();
    const noneOption = document.createElement("option");
    noneOption.value = "none";
    noneOption.id = "none";
    noneOption.textContent = "None";
    fragment.append(noneOption);

    for (const identity of identities) {
        const option = document.createElement("option");
        option.value = identity.cookieStoreId;
        option.id = identity.cookieStoreId;
        option.textContent = identity.name;
        fragment.append(option);
    }

    for (let i = 0; i < NUMBER_OF_KEYBOARD_SHORTCUTS; i++) {
        const shortcutKey = "open_container_" + i;
        const shortcutSelect = document.getElementById(shortcutKey);
        shortcutSelect.appendChild(fragment.cloneNode(true));
        if (keyboardShortcut && keyboardShortcut[shortcutKey]) {
            const cookieStoreId = keyboardShortcut[shortcutKey];
            shortcutSelect.querySelector("#" + cookieStoreId).selected = true;
        }
    }
}

function storeShortcutChoice(event) {
    browser.runtime.sendMessage({
        method: "setShortcut",
        shortcut: event.target.id,
        cookieStoreId: event.target.value
    });
}

document.addEventListener("DOMContentLoaded", setupOptions);

for (let i = 0; i < NUMBER_OF_KEYBOARD_SHORTCUTS; i++) {
    document.querySelector("#open_container_" + i)
        .addEventListener("change", storeShortcutChoice);
}