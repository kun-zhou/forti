# Forti, a delightful secrets manager for your passwords, credit cards, and more.

**Forti is an open source secrets manager built with [Electron](https://github.com/atom/electron), [React](https://facebook.github.io/react/), and [Redux](https://github.com/reactjs/redux)**

<p align="center">
  <a href="https://youtu.be/UAtPC051eoo"><img src="http://misc.kunzhou.me/lockit.png" style="width: 62%"/></a>
</p>

*Click the image for a video demo!*

## What is it

It a piece of software that securely stores your key-value pairs like website login information, credit cards, driver' license, or even software license (serial number). The idea is to save you from the clutter to find them in your scratchbooks, or trying get hold of your physical credit card just to get the number off of it. Understanding many of these information can be highly sensitive, Forti uses industry standard cryptography to protect your data.

Forti provides an easy interface to log your key-value pairs and insists that you always give your secret a title, and your value a key, so you never have to wonder what that piece of information is for.

## Getting Started

### Users

The pre-realease of Lock.IT is already available. Head over to the <a href="https://github.com/kun-zhou/lockit/releases"/>releases</a> tab to download the latest version. Just know that some functionalities are still lacking (like deleteing the vault), but will be coming very soon. When the first public release comes out, existing secrets will still be intact, so there is nothing to worry about in this regard.

Cheers and enjoy!

### Developers

To build and run, run

```shell
yarn start
```

To build macOS distributables, run

```shell
yarn dist
```

## Status

This application is still in its Pre-prelease stage, so be cautious when you are using it for production. New features are being actively implemented at the moment. The following features are currently being worked on:

* Ability to export the database in both encrypted and plain formats
* Ability to export individual secret
* Ability to create custom category
* Ability to use custom color scheme
* Ability to revert back each entry to history (snapshots)
* An info panel which display the entry's various statistics( date created, date last updated, etc)
* A settings panel
* Implement reordering for sections, fields, and navigation pane
* More hotkeys

THe following implemnentation details are being worked on:

* Use `react-virtualized` to render the middle panel, i.e., list of entries.
* Refactor CSS and configAPI

### Security

Each vault is encrypted with AES-GCM-256, including the cache, and only decrypted in memory.

## Contributing

### Application Icon

This application still lack ab icon. If you have anything to offer, great!

### Others

Any other suggestions are welcome. Just file an `Issue`