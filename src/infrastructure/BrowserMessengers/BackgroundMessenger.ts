import { IBrowser } from "../index";

export enum BackgroundMessageType {
  getRate,
  getSymbols,
}

export type BackgroundMessage = {
  type: BackgroundMessageType.getSymbols
} | {
  type: BackgroundMessageType.getRate, from: string, to: string
}

export interface IBackgroundMessenger {
  getRate(from: string, to: string): Promise<RateResponse | null>;

  getSymbols(): Promise<{ [key: string]: string }>;
}

export type RatePath = {
  from: string
  to: string
  source: string
  rate: number
  timestamp: number
}[]

export type RateResponse = {
  from: string
  to: string
  rate: number
  timestamp: number
  path: RatePath
}

export class BackgroundMessenger implements IBackgroundMessenger {
  private browser: IBrowser;

  constructor(browser: IBrowser) {
    this.browser = browser;
  }

  getRate(from: string, to: string) {
    return this.sendMessage<RateResponse>({ type: BackgroundMessageType.getRate, to: to, from: from });
  }

  getSymbols(): Promise<Record<string, string>> {
    return this.sendMessage<Record<string, string>>({ type: BackgroundMessageType.getSymbols });
  }

  private sendMessage<Response>(data: BackgroundMessage): Promise<Response> {
    return new Promise((resolve, reject) => {
      try {
        this.browser.runtime.sendMessage(data, function(resp: { success: boolean, data: Response }) {
          if (!resp) return reject("No response");
          return resp.success ? resolve(resp.data) : reject(resp.data);
        });
      } catch (e) {
        reject(e);
      }
    });
  }
}