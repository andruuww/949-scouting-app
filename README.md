# 949's Scouting App

This app was developed to facilitate the process of scouting at FRC competitions with no wifi, instead relying on QR Codes for communication.

It is built on Next.js 14, uses a service worker and PWA for offline use, Protobuf and fflate for data serialization and compression, and bwip-js and html5-qrcode for qrcode generation and scanning.

## App Link

Note: The app hosted on vercel's hosting platform - BSD Wifi (as well as most school wifis) blocks this domain.

![Scouting App Link](scout-app-link.png)

https://949-scouting-app-pink.vercel.app

## Installation

### Android

-   Open the website.
-   Click the three dots in the top right corner.
-   Click `Install App` or Add to `Home Screen`.
-   Click Add.

### IOS

-   Open the website.
-   Click the share icon at the bottom.
-   Scroll down and click `Add to Home Screen`.
-   Click Add.

### Offline

To make sure that the app is ready for offline use

-   Open the app on the homescreen and wait up to a minute for the notification: `Precache Complete`.
-   If this message does not show up, click the settings icon, under Service Worker, click `Unregister`.
-   Close and reopen the app.

### Updates

To update the app:

-   Open the app to the homepage.
-   Click the settings icon.
-   Under the Delete All Data option, click `Clear`.
-   Under Service Worker, click `Unregister`.
-   Wait for the notification: `Precache Complete`.
-   Close and reopen the app.

## Usage

The login page requires the scouter to submit their name, in order to know who to blame when the data claims 949 lost.

### Settings

-   To update theme select the desired theme (`dark` or `light`) then click `Update Theme`.
-   Reloading Service Worker (`Unregister`) will fix most errors and should change the app to the newest version.
-   `Reload Cache` deletes and reloads the cache.
-   `Clear` will delete all data. _Do Not_ select if scouting data is not scanned onto another device.

### Data Collection

-   Click `Pit Scout` or `Match Scout`.
-   Fill the form.
-   Once you're done filling out form, click `Submit`.
-   To edit a submitted entry, click the desired entry at the top of the page.

### Export to QRCode

-   Once data has been collected, click `Export` at the bottom of the page.
-   On the export page, there is an option to switch between exporting Pit and Match data.
-   Once scanned in by a main device, click the entries at the top in order to remove them from the rendering, or you could simply click `Mark All Done`.
-   Entries rendered will appear in the opposite color as the theme.

### Data Aggregation

-   On a main device, on the homescreen, hit `Aggregate Data`
-   Click `Start Camera`.
-   Scan all QR codes of one device in order, and once all parts have been scanned the data should be automatically bundled. If there is a mistake, click `Cancel Parts`.
-   Once all devices are scanned, click the appropriate export button.

### Miscellaneous

-   Toast Notifications can be expanded by clicking on the notifications cascaded behind the most recent.

## Development

The code is very spaghetti and there's limited comments and documentation, so if you need help please reach out to Andrew, who is responsible for the mess.

The code itself is very abstracted, the only thing that needs to be changed from season to season are the JSONs that are integrated throughout the app. They can be found under `src/jsons`. Throughout the app, they are parsed in order to render the forms and generate validation and Protobuf schemas.
