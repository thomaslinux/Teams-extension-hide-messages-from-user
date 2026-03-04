# Chrome extension to hide messages from Teams users

A chrome extension to hide messages from Teams users. Download zip and load in chrome developer mode.

# Features

**All**

- add / remove a user to hide
- enable / disable hiding of a user

**Firefox/mv2 only**

- hide / show only my messages
- add / remove a background image

## Installation on Chrome

Clone the repository or [download the zip](https://github.com/thomaslinux/teams-hide-message-from-user-mv3/archive/refs/heads/main.zip).

Go to this adress :

[chrome://extensions](chrome://extensions)

Drag and drop the extracted zip / folder of the extension.

## Testing on Firefox

about:debugging#/runtime/this-firefox

drag and drop the folder

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
