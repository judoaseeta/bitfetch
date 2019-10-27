import { SHA256, HmacSHA256, enc, LibWordArray ,WordArray } from 'crypto-js';
// some helper types
type FirstArgument<T> = T extends (arg1: infer U, arg2:any,  ...args: any[]) => any ? U : any;
type SecondArgument<T> = T extends (arg1: any, arg2: infer U, ...args: any[]) => any ? U : any;
export type CommonObject = {[key: string] : any};

// some constants for sig.
const AWS_SHA_256 = "AWS4-HMAC-SHA256";
const AWS4_REQUEST = "aws4_request";
const AWS4 = "AWS4";
const X_AMZ_DATE = "x-amz-date";
const X_AMZ_SECURITY_TOKEN = "x-amz-security-token";
const HOST = "host";
const AUTHORIZATION = "Authorization";


function hash(value: FirstArgument<typeof SHA256>) {
    return SHA256(value);
}
function hexEncode(value: WordArray) {
    return value.toString(enc.Hex);
}
function hmac(secret: SecondArgument<typeof HmacSHA256>, value: FirstArgument<typeof HmacSHA256>) {
    return HmacSHA256(value, secret, { asBytes: true }); // eslint-disable-line
}
function buildCanonicalUri(uri: string) {
    return encodeURI(uri);
}
function hashCanonicalRequest(request: FirstArgument<typeof hash>) {
    return hexEncode(hash(request));
}

function buildCanonicalQueryString(queryParams: CommonObject) {
    if (Object.keys(queryParams).length < 1) {
        return "";
    }

    let sortedQueryParams = [];
    for (let property in queryParams) {
        if (queryParams.hasOwnProperty(property)) {
            sortedQueryParams.push(property);
        }
    }
    sortedQueryParams.sort();

    let canonicalQueryString = "";
    for (let i = 0; i < sortedQueryParams.length; i++) {
        canonicalQueryString +=
            sortedQueryParams[i] +
            "=" +
            encodeURIComponent(queryParams[sortedQueryParams[i]]) +
            "&";
    }
    return canonicalQueryString.substr(0, canonicalQueryString.length - 1);
}
function buildCanonicalHeaders(headers: CommonObject) {
    let canonicalHeaders = "";
    let sortedKeys = [];
    for (let property in headers) {
        if (headers.hasOwnProperty(property)) {
            sortedKeys.push(property);
        }
    }
    sortedKeys.sort();

    for (let i = 0; i < sortedKeys.length; i++) {
        canonicalHeaders +=
            sortedKeys[i].toLowerCase() + ":" + headers[sortedKeys[i]] + "\n";
    }
    return canonicalHeaders;
}
function buildCanonicalSignedHeaders(headers: CommonObject) {
    let sortedKeys = [];
    for (let property in headers) {
        if (headers.hasOwnProperty(property)) {
            sortedKeys.push(property.toLowerCase());
        }
    }
    sortedKeys.sort();

    return sortedKeys.join(";");
}
function buildCanonicalRequest(method: string, path: string, queryParams: CommonObject, headers: CommonObject, payload: FirstArgument<typeof SHA256>) {
    return (
        method +
        "\n" +
        buildCanonicalUri(path) +
        "\n" +
        buildCanonicalQueryString(queryParams) +
        "\n" +
        buildCanonicalHeaders(headers) +
        "\n" +
        buildCanonicalSignedHeaders(headers) +
        "\n" +
        hexEncode(hash(payload))
    );
}

function buildCredentialScope(datetime:string, region: string, service: string) {
    return (
        datetime.substr(0, 8) + "/" + region + "/" + service + "/" + AWS4_REQUEST
    );
}
function calculateSigningKey(secretKey: string, datetime: string, region: string, service: string) {
    return hmac(
        hmac(
            hmac(hmac(AWS4 + secretKey, datetime.substr(0, 8)), region),
            service
        ),
        AWS4_REQUEST
    );
}

function calculateSignature(key: SecondArgument<typeof HmacSHA256>, stringToSign: FirstArgument<typeof HmacSHA256>) {
    return hexEncode(hmac(key, stringToSign));
}

function extractHostname(url: string) {
    var hostname;

    if (url.indexOf("://") > -1) {
        hostname = url.split('/')[2];
    }
    else {
        hostname = url.split('/')[0];
    }

    hostname = hostname.split(':')[0];
    hostname = hostname.split('?')[0];

    return hostname;
}

function buildStringToSign(
    datetime: string,
    credentialScope: string,
    hashedCanonicalRequest: string
) {
    return (
        AWS_SHA_256 +
        "\n" +
        datetime +
        "\n" +
        credentialScope +
        "\n" +
        hashedCanonicalRequest
    );
}


function buildAuthorizationHeader(
    accessKey: string,
    credentialScope: string,
    headers: CommonObject,
    signature: string
) {
    return (
        AWS_SHA_256 +
        " Credential=" +
        accessKey +
        "/" +
        credentialScope +
        ", SignedHeaders=" +
        buildCanonicalSignedHeaders(headers) +
        ", Signature=" +
        signature
    );
}

type SigV4ClientConfig = {
    accessKey: string;
    secretKey: string;
    sessionToken: string;
    region: string;
    endpoint: string;
    serviceName?: string;
    defaultAcceptType?: string;
    defaultContentType?: string;
}
type SignedRequest = {
    method: string;
    path: string;
    header?: CommonObject;
    queryParams?: CommonObject;
    body?: any;
}
function makeSigV4Client(
    {
        accessKey,
        secretKey,
        sessionToken,
        endpoint,
        region,
        serviceName = "execute-api",
        defaultAcceptType = "application/json",
        defaultContentType = "application/json"
    }: SigV4ClientConfig) {
    const invokeUrl = endpoint;
    const Endpoint = /(^https?:\/\/[^/]+)/g.exec(endpoint)![1];
    const pathComponent = invokeUrl.substring(Endpoint.length);

    return function({ method, path, header = {}, queryParams = {}, body = {}}: SignedRequest) {
        const Verb = method.toUpperCase();
        const newPath = pathComponent + path;
        const QueryParams = queryParams;
        const Header = header;

        let Body = body;

        if (Header["Content-Type"] === undefined) {
            Header["Content-Type"] = defaultContentType;
        }
        if (Header["Accept"] === undefined) {
            Header["Accept"] = defaultAcceptType;
        }
        if (Body === undefined || Verb === "GET") {
            Body = "";
        } else {
            Body = JSON.stringify(body);
        }
        if (Body === "" || Body === undefined || Body === null) {
            delete Header["Content-Type"];
        }
        const datetime = new Date()
            .toISOString()
            .replace(/\.\d{3}Z$/, "Z")
            .replace(/[:-]|\.\d{3}/g, "");
        Header[X_AMZ_DATE] = datetime;
        Header[HOST] = extractHostname(Endpoint);
        let canonicalRequest = buildCanonicalRequest(
            Verb,
            newPath,
            QueryParams,
            Header,
            Body
        );
        let hashedCanonicalRequest = hashCanonicalRequest(canonicalRequest);
        let credentialScope = buildCredentialScope(
            datetime,
            region,
            serviceName
        );
        let stringToSign = buildStringToSign(
            datetime,
            credentialScope,
            hashedCanonicalRequest
        );
        let signingKey = calculateSigningKey(
            secretKey,
            datetime,
            region,
            serviceName
        );

        let signature = calculateSignature(signingKey, stringToSign);
        Header[AUTHORIZATION] = buildAuthorizationHeader(
            accessKey,
            credentialScope,
            Header,
            signature
        );
        if (
            sessionToken !== undefined &&
            sessionToken !== ""
        ) {
            Header[X_AMZ_SECURITY_TOKEN] = sessionToken;
        }
        delete Header[HOST];

        let url = Endpoint + newPath;
        let queryString = buildCanonicalQueryString(QueryParams);
        if (queryString !== "") {
            url += "?" + queryString;
        }
        if (Header["Content-Type"] === undefined) {
            Header["Content-Type"] = defaultContentType;
        }
        return {
            headers: Header,
            url: url
        };
    }
}

export default makeSigV4Client;
