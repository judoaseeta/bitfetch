
export interface RawFeed {
    key:  string;
    name:  string;
    lang:  string;
    img:  string;
}

class CryptoArticleFeed {
    private _key: string;
    private _name: string;
    private _lang: string;
    private _image: string;
    constructor(rawData: RawFeed) {
        this._key =  rawData.key;
        this._name = rawData.name;
        this._lang =  rawData.lang;
        this._image = rawData.img;
    }
    get key() {
        return this._key;
    }
    get name() {
        return this._name;
    }
    get lang() {
        return this._lang;
    }
    get image(){
        return this._image;
    }
}

export default CryptoArticleFeed;
