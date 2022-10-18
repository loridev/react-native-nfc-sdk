declare module 'react-native-nfc-sdk' {
  type HceOptions = {
    content: string,
    writable: boolean
  };
  
  type HceReadHandler = () => void;

  type NdefTagInfo = {
    id: string,
    content: string,
  }

  class NdefTools {
    cancelRequest: () => void;

    async readTag (): Promise<NdefTagInfo | undefined>;
    async writeTag (value: string): Promise<boolean>;
  }

  class HceTools {
    removeListener?: HCESessionEventListenerCancel;
    stopEmulation: () => Promise<void>;
    hceSession?: HCESession;

    startEmulation (options: HceOptions, onRead: HceReadHandler): Promise<void>;
  }




}