# LOCK.IT, an open-source sensitive content manager with an elegant UI and effortless workflow

**Lockit is an open source formatted content manager built with [Electron](https://github.com/atom/electron), [React](https://facebook.github.io/react/), and [Redux](https://github.com/reactjs/redux)**

<p align="center">
  <a href="https://youtu.be/UAtPC051eoo"><img src="http://misc.kunzhou.me/lockit.png" style="width: 62%"/></a>
</p>

*Click the image for a video demo!*

## What is it

LOCK.IT is a piece of software that securely stores your key-value pairs like website login information, credit cards, ID cards, or even software license (serial number). And it lets you browser them in an easy fashion. Understanding many of these key-value pairs can be very sensitive, LOCK.IT uses industrial standard cryptography to protect your data.

It provides an easy interface to input your key-value pairs and enforces the necessary format so you always remember to give an entry a title, and give your password a website associated.

### Security

Each vault is encrypted with AES-GCM-256, including cache, and only decrypted in memory.

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

## STATUS

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

* Improve the way it handles unlocking and selecting vaults
* Use `react-virtualized` to render the middle panel, i.e., list of entries.
* Refactor CSS and configAPI

## Contributing

### Application Icon

This application still lack ab icon. If you have anything to offer, great!

### Others

Any other suggestions are welcome. Just file an `Issue`