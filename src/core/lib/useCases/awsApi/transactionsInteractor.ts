import AwsApi from '../../services/awsApi';
import { SignedApiInput } from '../../../../utils/apiUtils/signedApi';
// entity
import { RawTransactionData} from '../../entities/transaction';
interface RawTransactionResp {
    Items:RawTransactionData[]
}
class TransactionsInteractor{
    private api: AwsApi<RawTransactionResp>;
    constructor(api: AwsApi<RawTransactionResp>) {
        this.api = api;
        this.request = this.request.bind(this);
    }
    async request(arg: SignedApiInput) {
        return this.api.request(arg);
    }
}

export default TransactionsInteractor;
