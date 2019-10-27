//@ts-ignore
import DecodeMessage from "../../../utils/data/decodeMessage";


import Flag from './flag';

export const currentDecode = (sub: string): DecodedCurrencyLiveData => {
    let decodedSub = DecodeMessage.CURRENT.unpack(sub);
    return {
        ...decodedSub,
        FLAG: Number(decodedSub.FLAGS)
    }
};
interface DecodedCurrencyLiveData {
    FLAG: Flag
    FROMSYMBOL:string
    LASTTRADEID: number
    LASTUPDATE: number
    LASTVOLUMETO: number
    MARKET: string
    TOSYMBOL: string
    TYPE: string
    VOLUME24HOUR: number
    VOLUME24HOURTO: number
    VOLUMEHOUR: number
    VOLUMEHOURTO: number
    PRICE?: number
}

class CurrencyLiveData {
    private data: DecodedCurrencyLiveData;
    constructor(rawString: string) {
        this.data = currentDecode(rawString);
    }
    get flag() {
        return this.data.FLAG;
    }
    get fromSymbol() {
        return this.data.FROMSYMBOL;
    }
    get price() {
        return this.data.PRICE;
    }
}

export default CurrencyLiveData;
