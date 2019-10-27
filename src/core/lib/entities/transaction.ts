
export interface RawTransactionData {
    currency: string,
    type: "BUY" | "SELL",
    date: number,
    tradeId: string,
    tradeAmount: number,
    quantities: number,
    price: number,
}
class Transaction {
    private _currency: string;
    private _type: "BUY" | "SELL";
    private _date: Date;
    private _tradeId: string;
    private _tradeAmount: number;
    private _quantity: number;
    private _price: number;
    constructor(data: RawTransactionData) {
        this._currency = data.currency;
        this._type = data.type;
        this._date = new Date(data.date * 1000);
        this._tradeId = data.tradeId;
        this._tradeAmount = data.tradeAmount;
        this._quantity = data.quantities;
        this._price = data.price;
    }
    get price() {
        return this._price;
    }
    get type() {
        return this._type;
    }
    get tradeAmount() {
        return this._tradeAmount;
    }
    get quantity() {
        return this._quantity;
    }
    get currency() {
        return this._currency;
    }
    get tradeId() {
        return this._tradeId;
    }
}

export default Transaction;
