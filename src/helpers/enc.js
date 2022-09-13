const crypto = require('crypto');

function cyberSourceEncrypt(cardNumber, publicKey) {
    let formatPublicKey;
    const dataBuffer = Buffer.from(cardNumber);
    if (!publicKey.includes('-BEGIN PUBLIC KEY-')) {
        formatPublicKey = `-----BEGIN PUBLIC KEY-----
        ${publicKey}
-----END PUBLIC KEY-----`;
    } else { formatPublicKey = publicKey };
    const encryptedCardBuffer = crypto.publicEncrypt(
        {
            key: formatPublicKey,
            oaepHash: 'sha256',
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
        }, buffer = dataBuffer);
    return encryptedCardBuffer.toString('base64');
}
module.exports = cyberSourceEncrypt;