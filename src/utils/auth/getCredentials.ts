import * as AWS from 'aws-sdk'

function getAwsCredentials(userToken: string) {
    const authenticator = "cognito-idp.us-east-2.amazonaws.com/us-east-2_hGzrqTqHD";

    AWS.config.update({ region: "us-east-2" });

    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
        IdentityPoolId: 'us-east-2:a8a39f92-68c5-42f8-9891-40a5d7a38581',
        Logins: {
            [authenticator]: userToken
        }
    });
    return (AWS.config.credentials as AWS.Credentials).getPromise();
}

export default getAwsCredentials;
