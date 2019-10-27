// entity
import Transaction from './transaction';

export type TradeStatusProp = {
    amount: number,
    averagePrice: number,
    quantity: number
}

type TradeStatusObj = {
    [currency: string] : TradeStatusProp;
}
class TradeStatus {
    private obj: TradeStatusObj;
    constructor(data: Transaction[]) {
        this.obj = TradeStatus.calculateTradeStatus(data);
    }
    get(key: string) {
        return this.obj[key];
    }
    private static calculateTradeStatus(transactions: Transaction[]) {
        return transactions.reduce<TradeStatusObj>((acc, curr) => {
            if(curr.type === "BUY") {
                if(acc[curr.currency]){
                    const newQuantities = acc[curr.currency].quantity + curr.quantity;
                    const newAmount = acc[curr.currency].amount + curr.tradeAmount;
                    const newAveragePrice = Number((newAmount / newQuantities).toFixed(2));
                    acc[curr.currency] = {
                        amount: newAmount,
                        quantity: newQuantities,
                        averagePrice: newAveragePrice
                    }
                } else {
                    acc[curr.currency] = {
                        amount: curr.tradeAmount,
                        quantity: curr.quantity,
                        averagePrice: curr.price
                    }
                }
            } else {
                if(acc[curr.currency]) {
                    const newQuantities = acc[curr.currency].quantity - curr.quantity;
                    const newAmount = acc[curr.currency].amount - curr.tradeAmount;
                    const newAveragePrice = Number((newAmount / newQuantities).toFixed(2));
                    acc[curr.currency] = {
                        amount: newAmount,
                        quantity: newQuantities,
                        averagePrice: newAveragePrice
                    }
                } else {
                    acc[curr.currency] = {
                        amount: 0 - curr.tradeAmount,
                        quantity: 0 - curr.quantity,
                        averagePrice: 0 - curr.price
                    }
                }
            }
            return acc;
        }, {});
    }
}
export default TradeStatus;
