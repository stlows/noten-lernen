# noten-lernen

Learn to read sheet music.

Fork from Open-source github to add:
- Key signature option
- Every note has the same probability to appear (Previous version had skewed distribution: C,E,F, B = 3/24 and D, G A = 4/24)
- Accidentals is working with signature
  - Sharpen a sharp note = double sharp
  - Flatten a sharp note = natural
  - Sharpen a flat note = natural
  - Flatten a flat note = double flat


## Demo

https://vbeaulieu.com/noten-lernen

## Screenshots

<p float="left">

<img src="https://raw.githubusercontent.com/MelvilQ/noten-lernen/master/screenshots/screenshot1.png" width="200">

<img src="https://raw.githubusercontent.com/MelvilQ/noten-lernen/master/screenshots/screenshot2.png" width="200">

<img src="https://raw.githubusercontent.com/MelvilQ/noten-lernen/master/screenshots/screenshot3.png" width="200">

<img src="https://raw.githubusercontent.com/MelvilQ/noten-lernen/master/screenshots/screenshot4.png" width="200">

</p>

## Technologies

- PWA (it has a manifest.json and a service worker which caches all necessary files for offline use)
- Cordova (to package the app and put it on Google Play)
- Frontend-Framework: [Vue](https://vuejs.org/)
- Rendering music with JavaScript: [abc.js](https://abcjs.net/)
- Statistics line chart: [chartist.js](https://gionkunz.github.io/chartist-js/)
- Multilinguality Plugin: [vue-i18n](https://kazupon.github.io/vue-i18n/)
- WebMIDI, for MIDI keyboard input: [webmidi](https://webmidijs.org/)

## Development Setup

### Web App

1. Install node.js if you don't already have it
2. Clone the repo
3. Run `npm i` in the command line to install the dependencies
4. Start the dev server with the command `npm start`

### Android App
1. To run the app locally on Android, make sure you have Cordova and Android Developer Tools installed
2. `cd cordova` followed by `npm i` to install the Cordova dependencies
3. Connect your Android device and run `npm run mobile`
4. Release build: `npm run build` in the cordova directory (only possible with keystore)



