export type FundType = 'FPV' | 'FIC';

export interface Funds {
  id: string;
  minimumAmount: number;
  description: string;
  amount: number;
  name: string;
  returnRate: number;
  type: FundType;
}
