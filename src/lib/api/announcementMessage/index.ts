import { Config } from '../../switcheo/config'
import req from '../../req'

export enum MessageType {
  Alert = 'alert',
  Info = 'info',
  Warning = 'warning',
}
export interface AnnoucementMessageGetResponse {
  messages: {
    message: string
    messageType: MessageType
  }
  updatedAt: string
}

export function get(config: Config): Promise<AnnoucementMessageGetResponse> {
  return req.get(config.url + '/exchange/announcement_message')
}
