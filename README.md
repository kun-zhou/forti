# Lockit - an open-source sensitive content manager with an elegant UI and effortless workflow

**Lockit is an open source formatted content manager built with [Electron](https://github.com/atom/electron), [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), and [Immutable](https://github.com/facebook/immutable-js/)**

<p align="center">
  <img src="https://www.kunzhou.me/lockit_shot.png" style="width: 80%"/>
</p>

### Video Demo
<iframe width="560" height="315" src="https://www.youtube.com/embed/TZxJ-n1rRZs" frameborder="0" allowfullscreen></iframe>

## Warning

This app is work in progress. Many bugs are known at this point, and will be resolved as the app progress to its first alpha release. Many more features in addition to those shown in the DEMO are being developed as we speak.

## Philosophy

I feel it is important to address the things this software hopes to achieve and the things it does not.

### What it is

* It will help you memorize formatted data entries in a secure manner (read, more secure than plain textfiles).
* The process of logging and retrieving information are both inuititve and efficient.
* The software should be customizables. I plan to implement a plugin system so everyone can contribute to the functionalities they like for this software.

*In short, I hope the software serves as an inuititve and elegant formatted data manager for the general public with a reasonable level of security and extensibility.*

### What it is not

* Protect you agaist targeted attacks.
* Save big binary files.

## Getting Started

This app is to be bundled with webpack. To build and run, run

```shell
npm start
```

To build in watch mode with Webpack, run

```shell
npm run build
```

## STATUS

This application is still in its Pre-Alpha stage, so please do not use it for production. New features are being actively implemented at the moment. Please see the last section for features planned. Feature requests are welcome.

## Contributing

### Application Icon

This application still lack a application icon. If you know how to use one of those SVG editor like Adobe Illustrator, Sketch, or Affinity Design, or wants to contribute to the design of the icon, please let me know in the issues tab.

### For Users

I chose to release this software at its infancy mainly to get general recommendations concerning its functionalities, UI, and workflow. Therefore, any valuable suggestions are welcome in the `Issues` tab but I would appreciate it if you can elaborate on the suggestion to include your motivation and its use-cases.

If you know how to design color themes, have any recommendations regarding the layout and information provided by the user interface, feel free to make suggestions.

### For Developers

The structure of this software is described in the STRUCTURE.md file. Please refer to it if you want to understand the workings of my software. I hope this could reduce the barrier of community contribution.

Since I am not a crypto expert by any means, I would very much appreciate any suggestions concerning the crypto of this application.

Pull requests that enhance this application in any way are always welcome.

### Partnership

If you are interested in my project and wish to join me in developing this application, please open an issue or [send me an email](mailto:kunzhou@eml.cc).

## Upcoming Feature List

### First priorities

-Add support for multiple sections for content entries for easier organization.
-Implement cross linking of entries.
-Implement Drag and Drop reordering for sections, fields, and navigation pane.
-Inuititve default hotkeys binding with customizability
-Custom color schemes
-Historical snapshots of each entry
-One click export of content entry
-Drag and drop support for adding entry from file
-Application icon
-Manage to get a production build for Linux, macOS, and Windows.

### In the more distant future

-Multiple database support
-Animation
