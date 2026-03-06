let hideUsers = [];
let hideMode = "content";
let myMessagesMode = "none";
let backgrounds = []; // stored list of {url, active}

function buildSelector() {
  const base =
    hideMode === "content"
      ? `div[class*="fui-ChatMessage"]:has(img[src*="{{u}}"]) div[data-message-content]`
      : `div[class*="fui-ChatMessage"]:has(img[src*="{{u}}"])`;

  let selectors = hideUsers
    .filter((u) => u.enabled)
    .map((u) => base.replace("{{u}}", u.name));

  if (myMessagesMode === "hide") {
    selectors.push(`div[class*="fui-ChatMyMessage"]`);
  } else if (myMessagesMode === "only") {
    selectors.push(
      `div[class*="fui-ChatMessage"]:not([class*="fui-ChatMyMessage"])`,
    );
  }

  return selectors.join(",\n");
}

function getActiveBgUrl() {
  const active = backgrounds.find((b) => b.active);
  return active ? active.url : "";
}

function applyCSS() {
  let style = document.getElementById("hideUsersStyle");
  if (!style) {
    style = document.createElement("style");
    style.id = "hideUsersStyle";
    document.head.appendChild(style);
  }

  const selector = buildSelector();
  let css = "";
  if (hideMode !== "onlymessage") {
    css = selector
      ? `${selector} { 
        display: none !important; 
      }
    `
      : "";
  } else {
    css = selector
      ? `${selector} { display: inherit !important; } 
      div[class*="fui-ChatMessage"]:has(img) {
        display: none !important;
      }`
      : "";
  }

  const bgUrl = getActiveBgUrl();
  if (bgUrl && bgUrl != "none") {
    css += `
    div#message-pane-layout-a11y {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url('${bgUrl}');
      }
    `;
  }

  if (bgUrl != "none") {
    css += `
    .fui-Divider,
    time,
    [data-tid="message-author-name"] {
        color: white !important;
    }
    `;
    if (document.querySelector("html").className.includes("dark")) {
      css += ` 
      .fui-FluentProviderr0 {
        --messageColor: #000000a1 !important;
        --colorNeutralCardBackground: var(--messageColor);
        --colorNeutralBackground1: var(--messageColor);
      }`;
    }
  }

  style.textContent = css;
}

browser.storage.local
  .get(["hideUsers", "hideMode", "myMessagesMode", "backgrounds"])
  .then((res) => {
    hideUsers = res.hideUsers || [];
    hideMode = res.hideMode || "content";
    myMessagesMode = res.myMessagesMode || "none";
    backgrounds = res.backgrounds || [];
    applyCSS();
  });

browser.storage.onChanged.addListener((changes) => {
  if (changes.hideUsers) hideUsers = changes.hideUsers.newValue;
  if (changes.hideMode) hideMode = changes.hideMode.newValue;
  if (changes.myMessagesMode) myMessagesMode = changes.myMessagesMode.newValue;
  if (changes.backgrounds) backgrounds = changes.backgrounds.newValue;
  applyCSS();
});
