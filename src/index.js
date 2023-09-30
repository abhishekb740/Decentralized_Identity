import fs from 'fs';
import elliptic from 'elliptic';
import SecureLS from 'secure-ls';

const secureLS = new SecureLS({ encodingType: 'aes' });
const storagePath = 'secure-storage.json';

function generateEccKeyPair() {
    const ec = new elliptic.ec('secp256k1');
    const keyPair = ec.genKeyPair();

    return {
        privateKey: keyPair.getPrivate('hex'),
        publicKey: keyPair.getPublic('hex')
    };
}

function saveEccKeyPairToFile(keyPair) {
    try {
        fs.writeFileSync(storagePath, JSON.stringify(keyPair));
        console.log('ECC key pair saved securely to file.');
    } catch (error) {
        console.error('Error saving ECC key pair to file:', error.message);
    }
}

function getEccKeyPairFromFile() {
    try {
        const serializedKeyPair = fs.readFileSync(storagePath, 'utf8');
        return JSON.parse(serializedKeyPair);
    } catch (error) {
        console.error('Error retrieving ECC key pair from file:', error.message);
    }
}

// Generate, save, retrieve, and use ECC key pair
const newEccKeyPair = generateEccKeyPair();
saveEccKeyPairToFile(newEccKeyPair);

const retrievedEccKeyPair = getEccKeyPairFromFile();
console.log('Retrieved ECC key pair from file:', retrievedEccKeyPair);
