## Introduction

This is an app made to facilitate the process of scouting at FRC competitions.

There

## App Link

Note: This is hosted on vercel's platform. BSD Wifi blocks this, make sure to load the app on a different network. This QRCode is a link to the app.

If you are developing this app, use Chrome, it has much better developer tools.

![Scouting App Link](scout-app-link.png)

https://949-scouting-app-i4kp.vercel.app/

## Installation and Updates

### Android

-   Open the website
-   Click the three dots in the top right corner
-   Click Install App or Add to Home Screen
-   Click Add

### IOS

-   Open the website
-   Click the share icon at the bottom
-   Scroll down and click "Add to Home Screen"
-   Click Add

### Offline

To make sure that the app is ready for offline use

-   Open the app on the homescreen and wait for the notification: `Cache status: SUCCESS`
-   If this message does not show up, click the settings icon, under Service Worker, click `Unregister`
-   Close and reopen the app.

### Updates

If there are any updates to the app released by the app's software team

-   Open the app
-   Click the settings icon
-   Under Service Worker, click `Unregister`
-   Wait for the notification: `Cache status: SUCCESS`

## Usage

The login page requires the scouter to submit their name, in order to know who to blame when the data claims 949 won.

### Data Collection

-   Once you're done filling out form, click `Finalize team`
-   Once all teams have been scouted, click `Export`

### Data Aggregation

-   On the homescreen hit `Aggregate Data`
-   Allow all permissions, and select the correct camera
-   Scan all QR codes of one device in order, and hit `Finish Scout`
-   Once all devices are scanned, hit `export`
