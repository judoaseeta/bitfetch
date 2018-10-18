const mapper = (data: CoinListResp) => {
    if (data.Response === 'Fail') {
        throw new Error(data.Message);
    }
        return data.Data;
};
export default mapper;