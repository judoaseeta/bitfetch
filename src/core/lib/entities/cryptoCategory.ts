export interface RawCategory {
    categoryName: string;
}

class CryptoCategory {
    private _name: string;
    constructor(rawData: RawCategory) {
        this._name = rawData.categoryName;
    }
    get name() {
        return this._name;
    }
}

export default CryptoCategory;
