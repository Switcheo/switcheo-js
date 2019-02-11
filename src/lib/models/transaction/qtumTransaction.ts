export interface QtumTransaction  {
  /**
   * Address of the receiver in hexadecimal
   */
  to: string
  /**
   * The ABI encoded method call, and parameter values.
   */
  encodedData?: string
  /**
   * unit: satoshi
   */
  amount: number
  /**
   * unit: satoshi
   */
  gasLimit?: number
  /**
   * unit: satoshi / gas
   */
  gasPrice?: number
  /**
   * unit: satoshi / kilobyte
   */
  feeRate: number
}
