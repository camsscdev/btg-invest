export interface Transaction {
  id?: string;
  userId: number | string;
  operationType: 'subscription' | 'cancellation';
  fundId: number | string;
  amount: number;
  date: string;
  status: string;
}
