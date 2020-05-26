// 'use strict';

const crypto = require('crypto');


// // const algorithm = 'aes-192-cbc';
// // const password = 'Password used to generate key';
// // // Use the async `crypto.scrypt()` instead.
// // const key = crypto.scryptSync(password, 'salt', 24);
// // // The IV is usually passed along with the ciphertext.
// // const iv = Buffer.alloc(16, 0); // Initialization vector.

// // const decipher = crypto.createDecipheriv(algorithm, key, iv);

// // // Encrypted using same algorithm, key and iv.
// // const encrypted =
// //     'e5f79c5915c02171eec6b212d5520d44480993d7d622a7c4c2da32f6efda0ffa';
// // let decrypted = decipher.update(encrypted, 'hex', 'utf8');
// // decrypted += decipher.final('utf8');
// // console.log(decrypted);
// // // Prints: some clear text data
// // console.log()

// // var generator = require('generate-password');
// // var passwords = generator.generate({
// //     length: 32,
// //     numbers: true,
// //     symbols: true,
// //     lowercase: true,
// //     uppercase: true,
// //     excludeSimilarCharacters: true,
// //     strict: true
// // });

// // console.clear();
// // console.log(passwords);

// // const crypt = require("apache-crypt");

// // // Encrypting password using auto-generated 2 char salt.
// // const encryptedPassword = crypt("baten@CAT2019", 10);

// // console.warn(encryptedPassword);


// // // Should print true.
// // console.log(crypt("mypass", encryptedPassword) == encryptedPassword);
// // // Should print false.
// // console.log(crypt("notmypass", encryptedPassword) == encryptedPassword);

const ENCRYPTION_KEY = '?SP7qVnYQ68E;@HaZFpm23#8"{zj;$6Z',
    IV_LENGTH = 16; // Must be 256 bits (32 characters)

function getHashedKey() {
    return crypto.createHash('sha256')
        .update(ENCRYPTION_KEY)
        .digest();
}

function encryptData(text) {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(text);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString('hex') + ':' + encrypted.toString('hex');
}

function decryptData() {
    // let textParts = text.split(':');
    // let iv = Buffer.from(textParts.shift(), 'hex');
    // let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    // let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
    // let decrypted = decipher.update(encryptedText);

    // decrypted = Buffer.concat([decrypted, decipher.final()]);

    // return decrypted.toString();
}

console.warn(encryptData('baten@CAT2019'));
console.warn(decryptData());
