
export interface UserInfo {
    name: string;
    email: string;
}

class User {
    private user: UserInfo;
    constructor(newUser: UserInfo) {
        this.user = newUser;
    }
    get name() {
        return this.user.name;
    }
    get email() {
        return this.user.email;
    }
};

export default User;
