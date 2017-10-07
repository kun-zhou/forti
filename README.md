# Lockit, an open-source sensitive content manager with an elegant UI and effortless workflow

**Lockit is an open source formatted content manager built with [Electron](https://github.com/atom/electron), [React](https://facebook.github.io/react/), [Redux](https://github.com/reactjs/redux), and [Immutable](https://github.com/facebook/immutable-js/)**

<p align="center">
  <a href="https://youtu.be/TZxJ-n1rRZs"><img src="https://www.kunzhou.me/lockit_shot.png" style="width: 80%"/></a>
</p>

*Click the image for a video demo!*

## Warning

This app is work in progress. Many bugs are known at this point, and will be resolved as the app progress to its first alpha release. Many more features in addition to those shown in the DEMO are being developed as we speak.

## Philosophy

This software is targeted at people who would like to have a place for their key-value pairs with reasonable security and usability. It will be a robust information manager (could be a password manager) that works on Desktop, so all your key-value pairs find a place to go, rather than lying around in your notes app (which you sometimes forget to include what account that password is related to). By building the app with key-value pair concept in mind, the UX provides an easy interface to input these information and enforces the format of the information you are saving.

### What it is

* It will help you memorize formatted data entries in a resonably manner (read, more secure than plain textfiles).
* The process of logging and retrieving information are both inuititve and efficient.
* The software should be customizable.

*In short, I hope the software serves as an inuititve and elegant formatted information manager for the general public with a reasonable level of security and extensibility.*

### What it is not

* Protect you agaist targeted attacks.
* A place to write your diary.
* Save big binary files.
* Auto-input passwords to browsers

*In short, it is not the fanciest, most convenient, and most secure password manager lying around, but it works, and satistifies our needs to store key-value pairs in a database that can be later retrieved easily and reliably.*

## Getting Started

This app is to be bundled with webpack. To build and run, run

```shell
yarn start
```

To build in watch mode with webpack, and start the app, run

```shell
yarn run build; electron .
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

* Add support for multiple sections for content entries for easier organization.
* Implement cross linking of entries.
* Implement Drag and Drop reordering for sections, fields, and navigation pane.
* Inuititve default hotkeys binding with customizability
* Custom color schemes
* Historical snapshots of each entry
* One click export of content entry
* Drag and drop support for adding entry from file
* Application icon
* Manage to get a production build for Linux, macOS, and Windows.

### In the more distant future

* Multiple database support
* Animation

## Threat Analysis (needs more work)

This discussion assumes the following:
1. you have encrypted your hard disk securely,
2. You operate your system as a normal user instead of root
3. Lockit database itself is well encrypted (which is still being worked on, but will be done by the first public release, not too hard).
4. Whether attacker can get root access or not is important


1. Hard disk data exfiltration
    1. If the system is shutdown and the hard disk is encrypted by FileVault, BitLock, LUKs, or other solutions, it is impossible to exfiltrate the database. Resistant to remote and physical attack.
    2. If the system is live, but Lockit has not been fired up since boot, database is encrypted and nothing sensitive can be retrieved by malicious software or people who have physical access to the machine’s console.
    3. If the system is live, and Lockit is fired up or has been fired up since boot, there may be concerns because data in memories could have been paged or swapped to hard disk. But this may not be too much of a concern because only root can read these paged/swapped memories, assuming it is remote attack, and the attacker has not gained root access yet. If the attacker has root access, then I am afraid you will already in bigger trouble.  If attacker has physical access at this time, I am not sure what could happen. But I think since the attacker needs to swap the hard disk out to be read by another machine, he will have to know the master password for the encrypted hard disk since hard disk are decrypted on the fly. (Not too sure about this point, but I believe swap files are only root readable )

2. Memory exfiltration
	
   Assuming the system is up and Lockit is fired up or has been fired up since boot.
   1. If the attacker has remote access to the machine, then there may be concerns that sensitive information in the memory being dumped and sent to the attacker. If the attacker only has remote access without root privileges, (and if users other than root cannot dump memories of process owned by the user, which warrants more investigation), then we should be okay. But if attacker can dump your memory, then you are in trouble.
   2. If the attacker has physical access to the machine at this time, the attacker may be able to perform DMA attack, which will make all the sensitive information in the memories available to him. Probably even your FileVault master password if its stored in memory (this warrants more research).