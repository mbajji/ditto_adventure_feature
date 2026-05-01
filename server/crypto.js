const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

// Envelope encryption:
//   1. Generate a fresh AES-256 "data encryption key" (DEK) per record
//   2. Encrypt the actual personality data with AES-256-GCM using the DEK
//   3. Encrypt (wrap) the DEK with an RSA "key encryption key" (KEK)
//   4. Store ciphertext + iv + authTag + wrappedDek
//
// The RSA private key is the only long-lived secret — protect it like a
// vault. Each record uses a one-time AES key, so cracking one record
// doesn't reveal anything about the others.

const KEY_DIR = path.join(__dirname, 'keys');
const PRIV_PATH = path.join(KEY_DIR, 'kek_private.pem');
const PUB_PATH = path.join(KEY_DIR, 'kek_public.pem');

function loadOrCreateKEK() {
    if (fs.existsSync(PRIV_PATH) && fs.existsSync(PUB_PATH)) {
        return {
            privateKey: fs.readFileSync(PRIV_PATH, 'utf8'),
            publicKey: fs.readFileSync(PUB_PATH, 'utf8'),
        };
    }
    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });
    if (!fs.existsSync(KEY_DIR)) fs.mkdirSync(KEY_DIR, { recursive: true });
    fs.writeFileSync(PRIV_PATH, privateKey);
    fs.writeFileSync(PUB_PATH, publicKey);
    console.log('[crypto] generated new RSA-2048 KEK in', KEY_DIR);
    return { privateKey, publicKey };
}

const kek = loadOrCreateKEK();

function encryptEnvelope(plaintextString) {
    const dek = crypto.randomBytes(32);
    const iv = crypto.randomBytes(12);

    const cipher = crypto.createCipheriv('aes-256-gcm', dek, iv);
    const ciphertext = Buffer.concat([
        cipher.update(plaintextString, 'utf8'),
        cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    const wrappedDek = crypto.publicEncrypt(
        {
            key: kek.publicKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        dek
    );

    return {
        algo: 'AES-256-GCM + RSA-OAEP-2048',
        ciphertext: ciphertext.toString('base64'),
        iv: iv.toString('base64'),
        authTag: authTag.toString('base64'),
        wrappedDek: wrappedDek.toString('base64'),
    };
}

function decryptEnvelope(blob) {
    const dek = crypto.privateDecrypt(
        {
            key: kek.privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
            oaepHash: 'sha256',
        },
        Buffer.from(blob.wrappedDek, 'base64')
    );

    const decipher = crypto.createDecipheriv(
        'aes-256-gcm',
        dek,
        Buffer.from(blob.iv, 'base64')
    );
    decipher.setAuthTag(Buffer.from(blob.authTag, 'base64'));

    const plaintext = Buffer.concat([
        decipher.update(Buffer.from(blob.ciphertext, 'base64')),
        decipher.final(),
    ]);
    return plaintext.toString('utf8');
}

module.exports = { encryptEnvelope, decryptEnvelope };
