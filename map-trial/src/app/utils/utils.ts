import * as SHA256 from 'crypto-js/sha256';

export class Utils{
    Sha256ToHexString(sha256: number[]): string{
        let result: string = "";
        for(let element of sha256){
            let hex = (element >>> 0).toString(16);
            while(hex.length < 8){
                hex = "0" + hex;
            }
            result += hex;
        }

        return result;
    }

    StringToHexSha256(string: string): string{
        let sha256 = SHA256(string);
        return this.Sha256ToHexString(sha256);
    }
}
