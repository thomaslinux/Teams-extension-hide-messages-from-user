function buildSelector(userList, hideEntireMessage) {
  return userList
    .filter((u) => u.enabled)
    .map((u) => {
      const selector = hideEntireMessage
        ? `div[class*="fui-ChatMessage"]:has(img[src*="${u.name}"])`
        : `div[class*="fui-ChatMessage"]:has(img[src*="${u.name}"]) div[data-message-content]`;
      return selector;
    })
    .join(",\\n");
}

function applyHideCSS(userList, hideEntireMessage) {
  let styleTag = document.getElementById("hideUsers");
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = "hideUsers";
    document.head.appendChild(styleTag);
  }
  const selector = buildSelector(userList, hideEntireMessage);
  styleTag.textContent = selector
    ? `${selector} { display: none !important; }`
    : "";
}

function loadStateAndApply() {
  browser.storage.local.get(["hideUsersList", "hideEntireMessage"], (res) => {
    const users = res.hideUsersList || [];
    const hideEntire = res.hideEntireMessage || false;
    applyHideCSS(users, hideEntire);
  });
}

window.addEventListener("load", loadStateAndApply);
browser.storage.onChanged.addListener(loadStateAndApply);
