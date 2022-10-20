# react-native-nfc-sdk

[![NPM Version](https://badgen.net/badge/npm/v.0.1.2-alpha/yellow)](https://www.npmjs.com/package/react-native-nfc-sdk)
[![Dev supported?](https://badgen.net/badge/dev_support/yes/green)](https://github.com/loridev/react-native-nfc-sdk/graphs/commit-activity)
[![License](https://badgen.net/badge/licence/GPL-3.0/orange)](https://github.com/loridev/react-native-nfc-sdk/blob/main/LICENSE)

**react-native-nfc sdk** is a package that aims to simplify the way NFC apps are coded in React Native in order to make it easier for developers to implement their solutions and  develop their ideas using the NFC technology.

## Behind the scenes

This package simplifies operations in the packages [react-nfc-manager](https://github.com/revtel/react-native-nfc-manager) and [react-native-hce](https://github.com/appidea/react-native-hce). If does not cover your specific case, type an [issue](https://github.com/loridev/react-native-nfc-sdk/issues) or head to the respective package depending on what technology you're trying to use.

## Good to know

- Only tested in Android, so it may give you problems on other platforms

- It should cover the big majority of cases where NFC technology is used

- Has utilities for both NFC and HCE technologies

- Uses NDEF (NFC Data Exchange Format) for compatibility purposes

- This package **WON'T WORK** in a Expo React Native app

## What can I do with this package?

- Read NFC tags' IDs and decoded payload

- Write a custom payload to a NFC tag

- Use the HCE technology to use your phone as a NFC tag

## Docs

**WARNING: DOCS ARE NOT FINISHED (yet)**

### Getting Started

Note: Every time a relative route is shown in this documentation, corresponds to the route from **your react native project root**.

#### Installing

```shell
npm i react-native-nfc-sdk
```

#### Permission settings

Since this was only tested on Android, the will only be documentation on how to do the permissions configuration on Android. You'll need to enable different permissions depending on if you're using the NFC or HCE technologies.

##### NFC

Go to the file `app/android/src/main/AndroidManifest.xml` and add this line before the `application` tag:

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

##### HCE

Go to the file `app/android/src/main/AndroidManifest.xml` and add this line before the `application` tag:

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
  package="com.your-app-name"> <!-- DON'T MODIFY THE MANIFEST TAG -->
  <!-- ADD THIS BELOW LINE IF NOT PRESENT -->
  <uses-permission android:name="android.permission.INTERNET" />
  <!-- ENABLE ACCESS TO THE HCE FEATURE -->
  <uses-feature android:name="android.hardware.nfc.hce" android:required="true" />
  <!-- [...] -->
</manifest>
```

#### Usage

##### NFC

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
        const tag = await ndef.readTag();
        if (tag) setTagContent(tag.content);    
    }

    const writeTag = async () => {
        // The write tag function sets an event handler for when a tag
        // is passed and tries to write the content passed by parameter
        // as the payload. It returns a boolean wether the write action
        // was successful or not.
        if (await ndef.WriteTag('NFC Hello World')) {
            setWriteStatus('Tag written successfully!');
        } else {
            setWriteStatus('There was an error writing the tag :(');
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

##### HCE

```javascript
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { HceTools } from 'react-native-nfc-sdk';


export default function App () {
    const hce = new HceTools();
    const [isTagRead, setIsTagRead] = React.useState('No');
    
    const emulate = () => {
        // The start emulation function receives a content, which
        // corresponds to a NFC tag payload, and a writable
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
