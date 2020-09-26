// tslint:disable-next-line
export interface I_INSIGHT {
  [key: string]: Record<string, any> | string | number;
}

// tslint:disable-next-line
export interface I_INS_TOTAL {
  total: number;
}

// tslint:disable-next-line
export interface I_INS_CHART extends I_INS_TOTAL {
  categories?: string[];
  response: number[];
}
