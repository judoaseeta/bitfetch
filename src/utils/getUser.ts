import Auth from '@aws-amplify/auth';
async function getUser() {
    try {
        const user = await Auth.currentSession();
        return await user.getIdToken().decodePayload();
    } catch(e) {
        console.log(e);
        return false;
    }
}

export default getUser;