export class Vector3 {
    constructor (r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }

    toHexString () {
        let hexString = 
            '#'+
            Number(this.r).toString(16).padStart(2, '0') + 
            Number(this.g).toString(16).padStart(2, '0') + 
            Number(this.b).toString(16).padStart(2, '0'); 

        return hexString;
    }
}