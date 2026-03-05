// Content script: applies styles based on settings in chrome.storage

const STYLE_USERS_ID = "tl9hideUsers";
const STYLE_BG_ID = "tl9bgUrl";

function ensureStyleElement(id) {
  let style = document.getElementById(id);
  if (!style) {
    style = document.createElement("style");
    style.id = id;
    document.head.appendChild(style);
  }
  return style;
}

function buildUserCss(users, userMode) {
  // users: [{name, enabled}]
  // userMode: "hideContent" | "hideMessage" | "showOnly"
  const activeUsers = users.filter((u) => u.enabled && u.name.trim() !== "");
  if (activeUsers.length === 0) {
    if (userMode === "showOnly") {
      // No active user for showOnly => show all
      return `
        div[class*="fui-ChatMessage"]:has(img) div[data-message-content] {
          display: inherit;
        }
      `;
    }
    return "";
  }

  if (userMode === "hideContent") {
    // Hide only message content for enabled users
    const selectors = activeUsers
      .map(
        (u) =>
          `div[class*="fui-ChatMessage"]:has(img[src*="${CSS.escape(
            u.name,
          )}"]) div[data-message-content]`,
      )
      .join(",\n");
    return selectors ? `${selectors} { display: none; }` : "";
  }

  if (userMode === "hideMessage") {
    // Hide entire message for enabled users
    const selectors = activeUsers
      .map(
        (u) =>
          `div[class*="fui-ChatMessage"]:has(img[src*="${CSS.escape(
            u.name,
          )}"])`,
      )
      .join(",\n");
    return selectors ? `${selectors} { display: none; }` : "";
  }

  if (userMode === "showOnly") {
    // Hide all message contents, then show only those matching enabled users
    const base =
      `div[class*="fui-ChatMessage"]:has(img) {` + `  display: none;` + `}\n`;
    const selectors = activeUsers
      .map(
        (u) =>
          `div[class*="fui-ChatMessage"]:has(img[src*="${CSS.escape(
            u.name,
          )}"])`,
      )
      .join(",\n");
    const show = selectors ? `${selectors} { display: inherit; }` : "";
    return base + show;
  }

  return "";
}

function buildMyMessagesCss(myMode) {
  if (myMode === "hideAll") {
    return `
      div[class*="fui-ChatMyMessage"] {
        display: none;
      }
    `;
  }
  if (myMode === "showOnly") {
    // Show only my messages: hide others' messages
    return `
      div[class*="fui-ChatMessage"]:not(.fui-ChatMyMessage) {
        display: none;
      }
    `;
  }
  // "normal"
  return "";
}

function buildBackgroundCss(currentBgUrl) {
  if (!currentBgUrl || currentBgUrl == "none") return "";
  const url = currentBgUrl.replace(/"/g, '\\"');
  let result = "";
  if (document.querySelector("html").className.includes("dark")) {
    result += `.fui-FluentProviderr0 {
--messageColor: #000000a1 !important;
--colorNeutralCardBackground: #000000a1 !important;
--colorNeutralBackground1: #000000a1 !important;
}
`;
  }
  result += `
    .fui-Divider,
    time,
    [data-tid="message-author-name"] {
        color: white !important;
    }
    `;

  result += `.ui-flex.a.b.c.d.i.j.k.l.m.n {
background-image: url("${url}");
background-size: cover;
background-repeat: no-repeat;
background-position: center;
}`;
  return result;
}

function applyStyles(settings) {
  const {
    users = [],
    userMode = "hideContent",
    myMessagesMode = "normal",
    backgroundUrls = [],
    activeBackgroundUrl = "",
  } = settings || {};

  const styleUsers = ensureStyleElement(STYLE_USERS_ID);
  const styleBg = ensureStyleElement(STYLE_BG_ID);

  const userCss = buildUserCss(users, userMode);
  const myCss = buildMyMessagesCss(myMessagesMode);
  styleUsers.textContent = `${userCss}\n${myCss}`;

  const bgCss = buildBackgroundCss(activeBackgroundUrl);
  styleBg.textContent = bgCss;
}

function init() {
  chrome.storage.sync.get(
    {
      users: [],
      userMode: "hideContent",
      myMessagesMode: "normal",
      backgroundUrls: [],
      activeBackgroundUrl: "",
    },
    applyStyles,
  );

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "sync") return;
    const updated = {};
    for (const [key, { newValue }] of Object.entries(changes)) {
      updated[key] = newValue;
    }
    chrome.storage.sync.get(
      {
        users: [],
        userMode: "hideContent",
        myMessagesMode: "normal",
        backgroundUrls: [],
        activeBackgroundUrl: "",
      },
      (base) => applyStyles({ ...base, ...updated }),
    );
  });
}

window.addEventListener("load", init);
