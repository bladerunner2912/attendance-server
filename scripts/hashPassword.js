import { hash as _hash } from 'bcrypt';
import config from '../config/config.js';

const password = process.argv[2];

if (!password) {
    console.log('Usage: node scripts/hashPassword.js <plain_password>');
    process.exit(1);
}

const valueToHash = `${password}:${config.SECRET_KEY}`;

_hash(valueToHash, config.BCRYPT_ROUNDS)
    .then((hash) => {
        console.log(hash);
    })
    .catch((err) => {
        console.error('Error generating hash:', err.message);
        process.exit(1);
    });
