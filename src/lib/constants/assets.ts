interface AssetPrecision {
  [key: string]: number
}
// tslint:disable:object-literal-sort-keys
export const ASSET_PRECISION: AssetPrecision = {
  // NEO
  NEO: 8,
  GAS: 8,
  SWTH: 8,
  ACAT: 8,
  APH: 8,
  AVA: 8,
  COUP: 8,
  CPX: 8,
  DBC: 8,
  EFX: 8,
  LRN: 8,
  MCT: 8,
  NKN: 8,
  NRVE: 8,
  OBT: 8,
  ONT: 8,
  PKC: 8,
  QLC: 8,
  RHT: 0,
  RPX: 8,
  SDT: 8,
  SDS: 8,
  SOUL: 8,
  TKY: 8,
  TNC: 8,
  TOLL: 8,
  ZPT: 8,
  SWH: 8,
  MCTP: 8,
  NRVEP: 8,
  RHTC: 0,
  // ETH
  ETH: 18,
  ONC: 18,
}

export type AssetSymbol = 'NEO' | 'GAS' | 'SWTH' | 'ACAT' | 'APH' | 'AVA' | 'COUP' |
  'CPX' | 'DBC' | 'EFX' | 'LRN' | 'MCT' | 'NKN' | 'NRVE' | 'OBT' | 'ONT' |
  'PKC' | 'QLC' | 'RHT' | 'RPX' | 'SDT' | 'SDS' | 'SOUL' | 'TKY' | 'TNC' |
  'TOLL' | 'ZPT' | 'SWH' | 'MCTP' | 'NRVEP' | 'RHTC' | 'ETH' | 'ONC'
