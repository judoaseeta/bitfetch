interface RawCryptoArticle {
    id:  string;
    guid:  string;
    published_on: number;
    imageurl:  string;
    title:  string;
    url:  string;
    source:  string;
    body: string;
    categories: string;
    upvotes:  string;
    downvotes:  string;
    lang: string;
    source_info: {
        name: string;
        lang: string;
        img:  string;
    }
}
export interface RawCryptoArticleResp {
    Type:  number;
    Message:  string;
    Promoted: any[];
    Data: RawCryptoArticle[]
    RateLimit: {};
    HasWarning: boolean;
}

class CryptoArticle {
    private _id: string;
    private _guid: string;
    private _published_on: Date;
    private _imageUrl: string;
    private _title: string;
    private _url: string;
    private _source: string;
    private _body: string;
    private _categories: string[];
    private _source_info: {
        name: string;
        lang: string;
        img: string;
    }
    private _timestamp: number;
    constructor(rawData: RawCryptoArticle) {
        this._id = rawData.id;
        this._guid = rawData.guid;
        this._timestamp = rawData.published_on;
        this._published_on = new Date(rawData.published_on * 1000);
        this._url = rawData.url;
        this._imageUrl = rawData.imageurl;
        this._title = rawData.title;
        this._source = rawData.source;
        this._body = rawData.body;
        this._categories = rawData.categories.split('|');
        this._source_info = rawData.source_info;
    }
    get id() {
        return this._id;
    }
    get guid() {
        return this._guid;
    }
    get publishedOn() {
        return this._published_on;
    }
    get imageUrl() {
        return this._imageUrl;
    }
    get title() {
        return this._title;
    }
    get url() {
        return this._url;
    }
    get source() {
        return this._source;
    }
    get body() {
        return this._body;
    }
    get categories() {
        return this._categories;
    }
    get sourceInfo() {
        return this._source_info;
    }
    get timeStamp() {
        return this._timestamp;
    }
}

export default CryptoArticle;

