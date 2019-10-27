import Auth from '@aws-amplify/auth';
async function getUserToken() {
    try {
        const user = await Auth.currentSession();
        return await user.getIdToken().getJwtToken();
    } catch(e) {
        console.log(e);
        throw new Error(e);
    }
}

export default getUserToken;