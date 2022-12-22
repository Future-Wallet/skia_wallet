export type Transaction = {
    from: string;
    to: string;
    logEvents: any[];
    feesPaid: number;
    amount: number;
    txHash: string;
}