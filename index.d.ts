import { HCESession, HCESessionEventListenerCancel } from 'react-native-hce';
import { NdefTagInfo } from './src/types/NdefTypes';
import { HceOptions, HceReadHandler } from './src/types/HceTypes';

declare module 'react-native-nfc-sdk' {
  /**
   * Class which provides methods for reading and writing ndef tags
   */
  class NdefTools {
    /**
      * Method for cancelling the current listener
    */
    cancelRequest: () => void;

    /**
     * Function which listens until a Ndef tag is detected in the device's NFC reader. Then returns the id of the
     * Ndef tag and its decoded payload (as "content")
     * 
     * @return {Promise<NdefTagInfo | undefined>} An object containing the id and the decoded payload of the NFC tag or undefined in case there was an error reading the tag (The error will be thrown).
     */
    readTag (): Promise<NdefTagInfo | undefined>;

    /**
     * Function that writes a value as the payload of a Ndef tag and returns a boolean wether the card was written
     * successfully, errors may be thrown
     * 
     * @param value The value that will be written to the Ndef card
     * 
     * @returns A boolean wether the card was written successfully or not
    */
    writeTag (value: string): Promise<boolean>;
  }

  /**
  * Class which provides methods for emulating a Ndef card with your phone
  */
  class HceTools {
    /**
     * Method to remove the current read listener
     */
    removeListener?: HCESessionEventListenerCancel;
    /**
     * Method to stop the current card emulator (triggers removeListener)
     */
    stopEmulation: () => Promise<void>;
    /**
     * The singleton hce session provided by react-native-hce
     */
    hceSession?: HCESession;

    /**
     * Method to start a hce emulation and execute a callback once it's read
     * 
     * @param options object which receives a content and a writable boolean to determine what's going to be the
        payload of the emulated card when read and wether it's writable by other phones or not
     * @param onRead callback which will be executed once the emulated card is read (triggers stopEmulation)
     */
    startEmulation (options: HceOptions, onRead: HceReadHandler): Promise<void>;
  }
}