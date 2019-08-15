//@ts-ignore
import DecodeMessage from "./decodeMessage";

const mappingCurrent = (sub: string): DecodedCurrencyLiveData => {
    let messageType = sub.substring(0, sub.indexOf("~"));
    let decodedSub = DecodeMessage.CURRENT.unpack(sub);
    return {
        ...decodedSub,
        FLAGS: Number(decodedSub.FLAGS)
    }
};
export default mappingCurrent;