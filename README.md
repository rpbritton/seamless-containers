# Seamless Containers
* Open new tabs and windows in the most-recently-used cookie container.
* Reopen tabs with a hotkey (by default `Ctrl+Alt+[0-9]`).
* Open a new tab in a specific container (`Ctrl+Shift+[0-9]`).
* Meant to work seamlessly with the [Firefox Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/) addon.

## Good to knows
* The basis of this extension is the [Firefox Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/) addon.
* While several other addons can be combined to create an overall similar behavior, such as [Conex](https://addons.mozilla.org/en-US/firefox/addon/conex/) for new tabs and [Container Hotkeys](https://addons.mozilla.org/en-US/firefox/addon/container-hotkeys/) for container hotkeys, they don't create this exact behavior (new windows open in the same container and reopen in a container works on a new tab page, respectively).
* This extension works under the assumption every tab should be in a container of sorts. New tabs will be forced into a container.
* The default new tab shortcuts conflict with those of the [Firefox Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/) extension, which this extension is designed to work with. It is recommended to remove the shortcuts of the [Firefox Multi-Account Containers](https://addons.mozilla.org/en-US/firefox/addon/multi-account-containers/) addon by navigating to `about:addons`, clicking the gear next to manage your extensions, and under `Manage Extension Shortcuts`.