// ==UserScript==
// @name        Hide Users Messages cloud.microsoft
// @namespace   Violentmonkey Scripts
// @match       https://teams.cloud.microsoft/*
// @grant       none
// @version     2026.03.10.14.05
// @author      thomaslinux9 && perplexity.ai
// @description Hide Users Messages cloud.microsoft
// @run-at       document-end
// ==/UserScript==

(function () {
  "use strict";

  window.addEventListener("load", () => {
    // Array of usernames to hide. You can modify by using usersToHide.push("Name") in the console.
    window.usersToHide = [];

    const target = document.querySelector(
      'div[data-tid="message-pane-list-runway"]',
    );

    if (target) {
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          document
            .querySelectorAll("span[data-tid*=message-author-name]")
            .forEach((span) => {
              window.usersToHide.forEach((userToHide) => {
                if (span.innerText === userToHide) {
                  if (!span.classList.contains("userToHide")) {
                    span.classList.add("userToHide");
                  }
                }
              });
            });
        }
      });

      observer.observe(target, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    console.log("✅ User Hider Script Loaded");
    console.log('To hide a user, type: usersToHide.push("John DOE")');
    console.log("To show all users again, type: usersToHide = []");

    const style = document.createElement("style");
    style.id = "hideThoseUsers";
    style.textContent = `div[class*="fui-ChatMessage"]:has(span.userToHide),
      empty {
        display: none !important;
      }
    `;
    document.head.appendChild(style);
  });
})();
