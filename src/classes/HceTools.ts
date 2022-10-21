import { HCESessionEventListenerCancel, HCESession, NFCTagType4, NFCTagType4NDEFContentType } from "react-native-hce";
import { HceOptions, HceReadHandler } from "../types/HceTypes";

/**
 * Class which provides methods for emulating a Ndef card with your phone
 */
export default class HceTools {
  removeListener?: HCESessionEventListenerCancel;
  stopEmulation: () => Promise<void>;
  hceSession?: HCESession;

  constructor () {
    HCESession.getInstance()
      .then(instance => this.hceSession = instance)
    this.stopEmulation = async () => {
      await this.hceSession?.setEnabled(false);
      this.removeListener && this.removeListener();
    }
  }

  async startEmulation (options: HceOptions, onRead: HceReadHandler) {
    const tag = new NFCTagType4({
      type: NFCTagType4NDEFContentType.Text,
      content: options.content,
      writable: options.writable
    });

    try {
      this.hceSession = await HCESession.getInstance();
      this.hceSession.setApplication(tag);
      await this.hceSession.setEnabled(true);
      this.removeListener = this.hceSession.on(HCESession.Events.HCE_STATE_READ, () => {
        onRead();
        this.stopEmulation();
      });
    } catch (err) {
      throw err;
    }
  }
}