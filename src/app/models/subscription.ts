export interface Subscription {
  id?: string;
  userId: number;
  fundId: string;
  amount: number;
  date: string;
  notification?: string;
}
