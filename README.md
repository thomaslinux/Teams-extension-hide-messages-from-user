# Extension to hide messages from specific Teams users

An extension to hide messages from specific Teams users.
Based on my userstyles :
https://userstyles.world/style/26699/tl9-teams-hide-messages-from-user
https://userstyles.world/style/26886
https://userstyles.world/style/25421/tl9-teams-set-a-background-image-from-url

Made with [help](prompt.txt) from [perplexity.ai](https://perplexity.ai)

# Screenshots V0

| Firefox interface           | Chrome interface           |
| --------------------------- | -------------------------- |
| ![](firefox-screenshot.png) | ![](chrome-screenshot.png) |

## Installation on Chrome

Clone the repository or [download the zip](https://github.com/thomaslinux/teams-hide-message-from-user-mv3/archive/refs/heads/main.zip).

Open this link :

`chrome://extensions`

Drag and drop the extracted zip / folder of the extension.

## Testing on Firefox

Open this link :

`about:debugging#/runtime/this-firefox`

drag and drop the mv2 folder in Firefox

## Installation on Firefox

Go to `about:config` and set `xpinstall.signatures.required` to `false`

zip the content of the mv2 folder, so the structure is

mv2
|-manifest.json
|-options.html
|-...

manifest.json and others are at the root of the archive.

Go to `about:addons`, and drag and drop the mv2.zip

# Alternative

You can install and use the userstyle on Firefox and Chrome :

https://userstyles.world/style/26699/tl9-teams-hide-messages-from-user

# History

## Intro

I wanted to hide users in Teams, so I made a CSS selector to hide them. Style still exists on userstyles.world if you want to use it.

I wanted to make an extension to have an easier way to add and remove user to hide.

## Implementing

Making an extension directly was impossible. ChatGPT was not giving working results and my duck.ai credits ran out that day.

So I tried perplexity. It gave me an extension with a working interface, but the logic wasn't there.

## UserScript

So I started by making a userscript. If the code works in the console, we could then reuse that working code to build the extension.

### Why not inline styling ? But CSS ?

Because we scroll conversations, I would need to run the logic for every scroll. Which is a pain. So I decided to inject the CSS in the HTML, like stylus is doing (style is working).

# Features / TODO / Roadmap

## V0 - Alpha

- [x] add / remove a user to hide
- [-] enable / disable hiding of a user (work only for individual messages)
- [x] hide / show only my messages
- [x] add / remove a background image (better for darkmode)

## V0.5 - Correct selector

- [ ] Message selected with
  - ( ) Author of the message information as an innerText (javascript)
  - ( ) the author id in a span (css)

## V1 - Initial release

- [ ] Same Firefox and Chrome options.html (renaming the options.html values and .js correspondances)
- [ ] alias name for the background URL
- [ ] checkbox, show content on hover
- [ ] background-image: linear-gradient(#00000017,#000000b0), url('https://uns...');

## V2 -

- [ ] Teams like theme (https://microsoft.github.io/app-camp/aad/A03-after-apply-styling/)
- [ ] Right click on image, set as Teams background

## V3 - Stylus alternative?

- [ ] framework for inserting custom css
- [ ] Linkedin block users and background edit port
- [ ] editable css rules to insert
- [ ] json save and interprating of the custom options to insert

# Userscript version

## V0

- [ ] Right click indicates right clicks without breaking normal Teams right click
- [ ] add a button next to the username to block that user

- [ ] Insert buttons in the Teams interfaces on right click to add a user to hide, show currently hidden users
