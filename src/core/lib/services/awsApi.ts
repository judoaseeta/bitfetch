import signedApi, { SignedApiInput } from '../../../utils/apiUtils/signedApi';

class AwsApi<Data> {
    api: typeof signedApi;
    constructor() {
        this.api = signedApi;
        this.request = this.request.bind(this);
    }
    async request(arg: SignedApiInput) {
        return this.api(arg) as Promise<Data>;
    }
}

export default AwsApi;
