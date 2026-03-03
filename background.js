chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ hideUsers: [], enabled: true });
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getHideUsers") {
    chrome.storage.sync.get(["hideUsers", "enabled"], sendResponse);
    return true;
  }
  if (msg.type === "setHideUsers") {
    chrome.storage.sync.set({ hideUsers: msg.hideUsers });
  }
  if (msg.type === "setEnabled") {
    chrome.storage.sync.set({ enabled: msg.enabled });
  }
});
