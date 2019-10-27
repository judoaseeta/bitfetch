export interface RawCoinListData {
    Id: string;
    Url: string;
    ImageUrl: string;
    Name: string;
    Symbol: string;
    CoinName: string;
    FullName: string;
    Algorithm: string;
    ProofType: string;
    FullyPremined: string;
    TotalCoinSupply: string;
    BuiltOn: string;
    SmartContractAddress: string;
    PreMinedValue: string;
    TotalCoinsFreeFloat: string;
    SortOrder: string;
    Sponsored: boolean;
    IsTrading: boolean;
}

class CoinListData {
    private data: RawCoinListData;
    constructor(data:RawCoinListData) {
        this.data = data;
    }
    get imageUrl() {
        return this.data.ImageUrl;
    }
    get name() {
        return this.data.Name;
    }
    get fullName() {
        return this.data.FullName;
    }
    get coinName() {
        return this.data.CoinName;
    }
    get id() {
        return this.data.Id;
    }
    get symbol() {
        return this.data.Symbol;
    }
    get totalCoinSupply() {
        return this.data.TotalCoinSupply;
    }
    get algorithm() {
        return this.data.Algorithm;
    }
}

export default CoinListData;
