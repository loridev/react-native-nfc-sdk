# react-native-nfc-sdk

[![NPM Version](https://badgen.net/badge/npm/v0.2.3-beta/yellow)](https://www.npmjs.com/package/react-native-nfc-sdk)
[![Dev supported?](https://badgen.net/badge/dev_support/yes/green)](https://github.com/loridev/react-native-nfc-sdk/graphs/commit-activity)
[![License](https://badgen.net/badge/licence/GPL-3.0/orange)](https://github.com/loridev/react-native-nfc-sdk/blob/main/LICENSE)

**react-native-nfc sdk** is a package that aims to simplify the way NFC apps are coded in React Native in order to make it easier for developers to implement their solutions and  develop their ideas using the NFC technology.

## Behind the scenes

This package simplifies operations in the packages [react-nfc-manager](https://github.com/revtel/react-native-nfc-manager) and [react-native-hce](https://github.com/appidea/react-native-hce). If it does not cover your specific case, create an [issue](https://github.com/loridev/react-native-nfc-sdk/issues) or head to the respective package depending on what technology you're trying to use.

## Good to know

- Only tested in Android, so it may give you problems on other platforms

- It should cover the vast majority of cases where NFC technology is used

- Has utilities for both NFC and HCE technologies

- Uses NDEF (NFC Data Exchange Format) for compatibility purposes

- This package **WON'T WORK** in a Expo React Native app

## What can I do with this package?

- Read NFC tags' IDs and decoded payload

- Write a custom payload to a NFC tag

- Use the HCE technology to use your phone as a NFC tag
  
  


## Getting Started

Note: Every time a relative route is shown in this documentation, corresponds to the route from **your react native project root**.

### Installing

```shell
npm i react-native-nfc-sdk
```

### Permission settings

Since this was only tested on Android, there will only be documentation on how to do the permissions configuration on Android. You'll need to enable different permissions depending on if you're using the NFC or HCE technologies.

#### NFC

Go to the file `android/app/src/main/AndroidManifest.xml` and add this line before the `application` tag:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.your-app-name"> <!-- DON'T MODIFY THE MANIFEST TAG -->
  <!-- ADD THIS BELOW LINE IF NOT PRESENT -->
  <uses-permission android:name="android.permission.INTERNET" />
  <!-- ENABLE PERMISSION TO NFC HARDWARE -->
  <uses-permission android:name="android.permission.NFC" />
  <!-- [...] -->
</manifest>
```

#### HCE

Create a new file `android/app/src/main/res/xml/aid_list.xml` (you have to create the `aid_list.xml` file) and put the following content in the file:

```xml
<host-apdu-service xmlns:android="http://schemas.android.com/apk/res/android"
                   android:description="@string/app_name"
                   android:requireDeviceUnlock="false">
  <aid-group android:category="other"
             android:description="@string/app_name">
    <aid-filter android:name="D2760000850101" />
  </aid-group>
</host-apdu-service>
```

Go to the file `android/app/src/main/AndroidManifest.xml` and add this line before the `application` tag:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.your-app-name"> <!-- DON'T MODIFY THE MANIFEST TAG -->
  <!-- ADD THIS BELOW LINE IF NOT PRESENT -->
  <uses-permission android:name="android.permission.INTERNET" />
  <!-- ENABLE PERMISSION TO NFC HARDWARE -->
  <uses-permission android:name="android.permission.NFC" />
  <!-- ENABLE ACCESS TO THE HCE FEATURE -->
  <uses-feature android:name="android.hardware.nfc.hce" android:required="true" />
  <!-- [...] -->
</manifest>
```

In the same `AndroidManifest.xml` file, add the following lines in the `application` block so the app can communicate with the HCE service:

```xml
<application
      android:name=".MainApplication"
      android:label="@string/app_name"
      android:icon="@mipmap/ic_launcher"
      android:roundIcon="@mipmap/ic_launcher_round"
      android:allowBackup="false"
      android:theme="@style/AppTheme">

    <!-- ... -->

    <!-- Add the following block: -->
    <service
        android:name="com.reactnativehce.services.CardService"
        android:exported="true"
        android:enabled="false"
        android:permission="android.permission.BIND_NFC_SERVICE" >
        <intent-filter>
          <action android:name="android.nfc.cardemulation.action.HOST_APDU_SERVICE" />
          <category android:name="android.intent.category.DEFAULT"/>
        </intent-filter>

        <meta-data
          android:name="android.nfc.cardemulation.host_apdu_service"
          android:resource="@xml/aid_list" />
    </service>
    <!-- ... -->
</application>
```

### Usage

#### NFC

```javascript
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { NdefTools } from 'react-native-nfc-sdk';

export default function App () {
    const ndef = new NdefTools();
    const [tagContent, setTagContent] = React.useState('');
    const [writeStatus, setWriteStatus] = React.useState('');

    const readTag = async () => {
        // The read tag function sets an event handler for when a tag
        // is read and returns a js object of
        // {id: 'nfc-id', content: 'decoded-payload'}
        try {
          const tag = await ndef.readTag();
          if (tag) setTagContent(tag.content);   
        } catch (err) {
          console.err(err);
        } 
    }

    const writeTag = async () => {
        // The write tag function sets an event handler for when a tag
        // is passed and tries to write the content passed by parameter
        // as the payload. It returns a boolean wether the write action
        // was successful or not.
        try {
          if (await ndef.writeTag('NFC Hello World')) {
              setWriteStatus('Tag written successfully!');
          } else {
              setWriteStatus('There was an error writing the tag :(');
          }
        } catch (err) {
          console.err(err);
        }
    }

    return (
        <View>
            <Button onPress={readTag} title="READ NFC TAG" />
            <Text>TAG CONTENT: {tagContent}</Text>
            <Button onPress={writeTag} title="WRITE NFC TAG" />
            <Text>WRITE STATUS: {writeStatus}</Text>
        </View>
    );
}
```

#### HCE

```javascript
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { HceTools } from 'react-native-nfc-sdk';


export default function App () {
    const hce = new HceTools();
    const [isTagRead, setIsTagRead] = React.useState('No');

    const emulate = () => {
        // The start emulation function receives a content, which
        // corresponds to a NFC tag payload, and a writable boolean,
        // which will define if the NFC card you emulate can be written
        // The second parameter is a callback which will be called once
        // your emulated tag is read
        hce.startEmulation(
          {content: 'Hello World!', writable: false},
          () => {
            setTagIsRead('Yes!');
            setTimeout(() => setIsTagRead('No'), 5000);
          }
        )
    }

    return (
        <View>
            <Button onPress={emulate} title="EMULATE NFC TAG" />
            <Text>Was the tag read? {isTagRead}</Text>
        </View>
    );
}
```

## API Reference
The API reference is available [here](https://github.com/loridev/react-native-nfc-sdk/wiki)

## Changelog

- `0.2.3`: Reduced by half the package size by removing useless comments/text

- `0.2.2`: Changed the hello world snippets in the documentation to match the 0.2.x releases

- `0.2.1`: API reference is now available + typos in module declaration

- `0.2.0`: Improved error handling on both NDEF and HCE tools + end of the alpha status + first beta release

- `0.1.7`: Changed the headlines structure in order to offer a clearer documentation + typos correction

- `0.1.6`: Corrected a step missing in the "Getting Started" of the HCE technology docs + typos correction

- `0.1.5`: Added the Changelog to the docs

- `0.1.4`: General typo correction on docs

- `0.1.2`: Docs pre-release, enough to build an app using the library

- `0.1.1`: TypeScript module types declaration

- `0.1.0`: First functional release (alpha)

- `0.0.6`: Fixed bug with the error handling on the HCE read event where it wouldn't stop listening for the event

- `0.0.5`: Added HCETools class, which provides methods for using the HCE technology

- `0.0.4`: Added writeTag method on the NdefTools

- `0.0.3`: Fixed a bug where the payload wasn't being decoded correctly in the readTag function of the NdefTools

- `0.0.2`: Npm package publish, testing purposes
