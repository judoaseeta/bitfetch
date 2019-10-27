import signedAPI from "./signedApi";

type Account = {
    userId: string;
    amount: number;
}
const initAccount = async() => {
    try {
        let item: Account;
        const result = await signedAPI({
            method: 'get',
            endpointName: 'account',
            path: '/load',
        });
        if(result.status === false && result.message === 'Item not found') {
            item = await signedAPI({
                method: 'post',
                endpointName: 'account',
                path: '/create',
                body: {},
            });
        } else {
            item = result;
        }
        return item;
    } catch(e) {
        throw new Error(e.message);
    }
};

export default initAccount;


