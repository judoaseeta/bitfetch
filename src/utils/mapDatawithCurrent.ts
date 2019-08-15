import {MappedHistoDataType} from "./histoDataMapper";

const mapDataWithCurrent = (data: MappedHistoDataType[], price: number) => {
    let { high, close, open, low, ...rest } = data[data.length - 1];
    if(high < price){
        high = price;
    } else if (low > price) {
        low = price;
    }
    close = price;
    return [...data.slice(0, data.length - 1), { high, close, open, low, ...rest}];
};
export default mapDataWithCurrent;