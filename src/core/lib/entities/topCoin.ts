interface RawTopCoinData {
    Id:  string;
    Name:  string;
    FullName:  string;
    Internal:  string;
    ImageUrl:  string;
    Url:  string;
    Algorithm:  string;
    ProofType:  string;
    NetHashesPerSecond: number;
    BlockNumber: number;
    BlockTime: number;
    BlockReward: number;
    Type: number;
    DocumentType: string;
}
export interface RawTopCoinResp {
    Data: {
        CoinInfo: RawTopCoinData
    }[]
    HasWarning: boolean
    Message: string
    RateLimit: any

    Type: number
}
class TopCoin {
    private data: RawTopCoinData;
    constructor(data: RawTopCoinData) {
        this.data = data;
    }
    get name() {
        return this.data.Name;
    }
}

export default TopCoin;
