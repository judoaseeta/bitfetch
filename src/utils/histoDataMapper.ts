const mappingDate = (arr: CoinHistoData[]) => arr.map(dat =>({ ...dat, time: new Date(dat.time * 1000)}));
export interface MappedHistoDataType extends Omit<CoinHistoData, 'time'> {
    time: Date;
}
export interface MappedHistoData extends Omit<CoinHistoDataResp, 'Data'> {
    Data: MappedHistoDataType[];
}
export const mappingResponse = (resp: CoinHistoDataResp): MappedHistoData => ({
    ...resp,
    Data: mappingDate(resp.Data),
});