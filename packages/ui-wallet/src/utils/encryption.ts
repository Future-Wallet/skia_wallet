import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import { Err, Ok, Result } from 'ts-results';


export const encryptString = (value: string, password: string) => {
    const encrypted = AES.encrypt(value, password);
    return encrypted.toString()
}

export const decryptString = (value: string, password: string): Result<string, null> => {
    try {
        const encrypted = AES.decrypt(
            value.toString(), password);
        return Ok(encrypted.toString(CryptoJS.enc.Utf8))
    } catch (e) {
        return Err(null)
    }

}
