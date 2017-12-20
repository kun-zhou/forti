# Forti, a modern password manager made open source

<p align="center">
  <a href="https://youtu.be/UAtPC051eoo"><img src="http://misc.kunzhou.me/lockit.png" style="width: 62%"/></a>
</p>

*Click the image for a video demo!*

## What is it

It is a piece of software that securely stores your key-value pairs like website login information, credit cards,software licences, and much more. Forti provides an easy interface to log them and insists that you always give your secret a title, and your value a key, so you never have to wonder what that piece of password is for. The idea is to save you the trouble of scrolling up a thousand photos just to find the one for that AMEX card so you can order that pizza over the phone. Forti is also able to handle hundreds of thousands of secrets at ease.

Understanding many of these information can be highly sensitive, Forti uses industry standard cryptography suite to protect your data, so no one can peak into your secrets without your password. And unlike popular alternatives like 1Password, Dashlane, etc, Forti is completely open source, so anyone can check its source code and make sure Forti lives up to its promise.

## Getting Started

### Users

The pre-realease of Forti is already available,  simply head over to <a href="https://github.com/kun-zhou/lockit/releases"/>releases</a> to download and get started with the latest releases. Just know that some functionalities are still lacking (like deleteing a vault), but will be coming very soon. When the first public release comes out, existing secrets will still be intact, so there is nothing to worry about in this regard.

Do note that this is a pre-release version, so be cautious when storing important information without a backup. But the encryption should completely work, so no need to worry about data breach.

Cheers and enjoy 🍻🍻

### Developers

Forti is an open source secrets manager built with *Electron*, *React*, *Redux*, and *ImmutableJS* .

To build and run, run

```shell
yarn start
```

To build macOS distributable, run

```shell
yarn dist
```

## Status

Forti is still in the pre-prelease stage, so be cautious when using for production. New features are being actively implemented at the moment. The following features are currently being worked on:

* Ability to export the database in both encrypted and plain formats
* Ability to export individual secret
* Ability to create custom category
* Ability to use custom color scheme
* Ability to revert back each entry to history (snapshots)
* An info panel which display the entry's various statistics( date created, date last updated, etc)
* A settings panel
* Implement reordering for sections, fields, and navigation pane
* More hotkeys

THe following implemenntation details are being worked on:

* Refactor CSS and configAPI

### Security

Each vault is encrypted with AES-GCM-256 with a PBKDF2-guarded master password, including the cache, and are only decrypted in memory.

## Contributing

### Application Icon

Forti still needs a lovely icon. If you have anything to offer, let me know!

### Others

Any other suggestions are welcome. Just file an `Issue`.