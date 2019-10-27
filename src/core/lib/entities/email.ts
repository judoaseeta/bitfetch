class Email {
    address: string;
    constructor(address: string) {
        if(!emailRegex(address)) {
            throw new Error('Invalid Email Address')
        } else {
            this.address =  address.toLowerCase();
        }
    }
}
export function emailRegex (value: string) {
    return value.match(/[\w.]+@[\w.]+\.\w+/);
}

export default Email;
