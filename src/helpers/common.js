var jwt = require('jsonwebtoken');
var CryptoJS = require("crypto-js");

export function copyArrayOfObjects(arr) {
    var copyArr = JSON.parse(JSON.stringify(arr));
    return copyArr;
}


export function objectsEqual(o1, o2) {
    return typeof o1 === 'object' && Object.keys(o1).length > 0
        ? Object.keys(o1).length === Object.keys(o2).length
        && Object.keys(o1).every(p => objectsEqual(o1[p], o2[p]))
        : o1 === o2;
}

export function arrayOfObjectEqual(a1, a2) {
    return a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));
}

function base64url(source) {
    // Encode in classical base64
    var encodedSource = CryptoJS.enc.Base64.stringify(source);

    // Remove padding equal characters
    encodedSource = encodedSource.replace(/=+$/, '');

    // Replace characters according to base64url specifications
    encodedSource = encodedSource.replace(/\+/g, '-');
    encodedSource = encodedSource.replace(/\//g, '_');

    return encodedSource;
}


export function createJWTToken(data) {
    var header = {
        "alg": "HS256",
        "typ": "JWT"
    };
    var stringifiedHeader = CryptoJS.enc.Utf8.parse(JSON.stringify(header));
    var encodedHeader = base64url(stringifiedHeader);

    var stringifiedData = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
    var encodedData = base64url(stringifiedData);

    var token = encodedHeader + "." + encodedData;

    var secret = process.env.VUE_APP_JWT_SECRET;

    var signature = CryptoJS.HmacSHA256(token, secret);
    signature = base64url(signature);

    var signedToken = token + "." + signature;

    return signedToken;
}

export function parseAndVerifyJWTToken(token) {
    var secret = process.env.VUE_APP_JWT_SECRET;
    try {
        var payload = jwt.verify(token, secret);
        return payload;
    } catch (err) {
        return {};
    }

}


export function getTimeDiffInSeconds(t1, t2) {
    var dt = t2.getTime() - t1.getTime();
    return dt / (1000 * 3600 * 24) * 86400;
}