/*!
* O3 DApp JavaScript SDK
* Version: 0.0.1
* Created: Friday June 29 2018.
* https://o3.network
*
* Edit: Added typings and convert from js to ts
* Edit Date: 19/10/2018
*
* Copyright 2018 O3 Labs, Inc.
* The O3 DApp JavaScript SDK is freely distributable under the MIT license.
*
*/

type O3Callback = (response: any) => void

export interface O3 {
  VERSION: string
  _callbackHandler: object | null | O3Callback,
  init: (callback: O3Callback) => void,
  callback: O3Callback,
  _sendMessage: (command: string, params?: any) => void,
  getDeviceInfo: (response: string) => void,
  requestToConnect: () => void,
  getPlatform: () => void,
  getAccounts: () => void,
  isAppAvailable: () => void,
  getBalances: () => void,
  verifySession: (sessionID: string) => void,
  requestToSignRawTransaction: (unsignedRawTransaction: any) => void,
}

// @ts-ignore
export const o3: O3 = {
  VERSION: '0.0.1',
  _callbackHandler: null,
}

o3.init = (callback: O3Callback): void => {
  // @ts-ignore
  window.o3 = window.o3 || o3
  o3._callbackHandler = callback
  o3._sendMessage('init')
}

// This is the method that both iOS and Android will call after the operation finished.
o3.callback = (response: any): void => {
  // @ts-ignore
  o3._callbackHandler(response)
}

o3._sendMessage = (command: string, data: any): void => {
  const message: { command: string, data: any } = {
    command,
    data,
  }
  // @ts-ignore
  if (typeof O3AndroidInterface !== 'undefined') {
    // @ts-ignore
    O3AndroidInterface.messageHandler(JSON.stringify(message))
  } else {
    try {
      // @ts-ignore
      webkit.messageHandlers.sendMessageHandler.postMessage(message)
    } catch (err) {
      o3.callback(null)
    }
  }
}

o3.getDeviceInfo = (): void => {
  o3._sendMessage('getDeviceInfo')
}

o3.requestToConnect = (): void => {
  o3._sendMessage('requestToConnect', window.location.href)
}

o3.getPlatform = (): void => {
  o3._sendMessage('getPlatform')
}

o3.getAccounts = (): void => {
  o3._sendMessage('getAccounts')
}

o3.isAppAvailable = (): void => {
  o3._sendMessage('isAppAvailable')
}

o3.getBalances = (): void => {
  o3._sendMessage('getBalances')
}

o3.verifySession = (sessionID: string): void => {
  o3._sendMessage('verifySession', sessionID)
}

o3.requestToSignRawTransaction = (unsignedRawTransaction: any): void => {
  o3._sendMessage('requestToSign', unsignedRawTransaction)
}
