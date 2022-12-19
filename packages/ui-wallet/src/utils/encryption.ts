import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';


export const encryptString = (value: string, password: string) => {
    var encrypted = AES.encrypt(value, password);
    encrypted.iv
    return encrypted.ciphertext.toString()
}

export const decryptString = (value: string, password: string) => {
    var encrypted = AES.decrypt(value, password);
    return encrypted.toString(CryptoJS.enc.Utf8);
}
