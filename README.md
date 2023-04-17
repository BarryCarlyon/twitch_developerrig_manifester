<img src="https://user-images.githubusercontent.com/20999/211199868-8236f9d1-bddd-4fca-9157-6fa7886949fc.png" width="100" align="right" />

[![CodeQL](https://github.com/BarryCarlyon/twitch_developerrig_manifester/actions/workflows/codeql-analysis.yml/badge.svg)](https://github.com/BarryCarlyon/twitch_developerrig_manifester/actions/workflows/codeql-analysis.yml)

# What is this

This Program lets you add a Project to the Deprecated [Twitch Developer Rig](https://dev.twitch.tv/docs/extensions/rig).

It comes with no warranties so if you break something it's your fault *If you do so it's at your own risk*!

# Functions

- Import a Project - Create a Project Manifest file from a Developer Console Extension and add that project to Rig for use
- Refresh Manifest - Update a Project Manifest file from a Developer Console Extension
- Reopen Project - Open a Project Manifest file and (re)add that project to the Rig for use

# Quick Start Usage Instructions

Read the [Blog Post](https://barrycarlyon.co.uk/wordpress/2023/04/04/the-twitch-extensions-developer-rig-is-dead/) or this quick start:

## New Users

1. Install The Rig
2. Install this program
3. Open the Rig
4. Login to Twitch in the Rig
5. Close The Rig
6. Open this program
7. Fill in the fields inder "Import a Project"
8. Click "Attempt Create"
9. Open the Rig

You should now have your project in the rig ready to work with.

## Existing Users

1. Close the Rig
2. Open this program
3. Run the required function you need populating fields if needed
4. ReOpen the Rig

### Common Issues

- `Database not open` - you left the Twitch Developer Rig open, and the Manifester is locked out. Close the Twitch Developer Rig, optionally restart the manifester.

## Installation and Updates

This is an Electron App, so it maybe installed from the GitHub [releases tab](https://github.com/BarryCarlyon/twitch_developerrig_manifester/releases).

The Windows Build is Code Signed with the Publisher `Barry Carlyon`
The Mac Builds are Code Signed with Apple Cerficates that identify `Barry Carlyon`

You can download the latest version, for Windows from here on GitHub under [releases](https://github.com/BarryCarlyon/twitch_developerrig_manifester/releases). These builds will self update

## Uninstallation

You can use Windows "Add and Remove Programs" to uninstall the program.

## Data/Config Storage

This app doesn't store/save any of your data but it may leave a folder behind

Windows:

```
%appdata%/BarryCarlyonDeveloperRigManifester/
```

Mac DMG/Manual install:

```
~/Library/Application Support/BarryCarlyonDeveloperRigManifester/
```

## Notes

- Uses Electron to provide as a Desktop App
- Uses Bootstrap for primary layout
- Uses GitHub for update delivery and code management
- JWT tokens are generated _inside_ the App via [auth0/node-jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), as apposed to "ClientSide" like [this example](https://barrycarlyon.github.io/twitch_misc/examples/extension_config/)
- A number of [sindresorhus](https://github.com/sindresorhus/) Electron Modules.
- Uses [ClassicLevel](https://github.com/Level/classic-level) to interact with the Developer Rig database/LocalStorage.

For a project to exist in the rig, two components need to exist.

- The manifest/project file which is a local copy of your selected Extension Settings/integration slots/testing baseURI/etc
- An entry in the Extension Developer Rig database/LocalStorage, which holds your extension secret (which the rig doesn't need any more anyway really), and a file/location reference to the project file so it can add it to the Developer Rig UI

Defined Extension views that you define are stored in the manifest/project file.

## Warranty

If you break your Developer Rig from using this tool it's your own fault and the author(s) accept no responsbility for problems caused to your extension from using this tool.

## License

This project is Licensed under [Do What The F*ck You Want To Public License](https://github.com/BarryCarlyon/twitch_extension_tools/blob/main/LICENSE), so Just Do What the F*ck you want to!

## Development Notes

This is an [Electron Project](https://www.electronjs.org/)

To run locally, after cloning, just

```
$ npm install
$ npn run start
```

## Further Help with Twitch API

- [TwitchDev Documentation](http://dev.twitch.tv/docs)
- [TwitchDev Support Forums](https://discuss.dev.twitch.tv/)
- [TwitchDev Discord](https://link.twitch.tv/devchat)
- [TwitchDev Other Help](https://dev.twitch.tv/support)

[![TwitchDev Discord](https://discordapp.com/api/guilds/504015559252377601/embed.png?style=banner2)](https://link.twitch.tv/devchat)

## OMGLIEKWUT OHMYGOODNESS U SO MUCH HELP

Thank you for the help I want to give you beer/coffee money -> Check the Funding/Sponsor details
