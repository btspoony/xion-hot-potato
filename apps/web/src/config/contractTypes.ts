export enum CONTRACT_TYPES {
  CW721 = "cw721",
}

export type ContractType = (typeof CONTRACT_TYPES)[keyof typeof CONTRACT_TYPES];

export const DEFAULT_CONTRACT_TYPE: ContractType = CONTRACT_TYPES.CW721;