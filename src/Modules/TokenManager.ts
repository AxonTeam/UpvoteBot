class TokenManagerClass {
    activeTokens: Map<String, String>

    constructor() {
        this.activeTokens = new Map()
    }

    public add(userID: String, bearer: String, expires: number): void {
        this.activeTokens.set(userID, bearer);

        setTimeout((userID: String) => {
            this.activeTokens.delete(userID);
        }, expires)
    }
    
    public get(userID: String) {
        const got = this.activeTokens.get(userID);

        if (got) {
            return got;
        } else {
            return null;
        }
    }
    
}

export const TokenManager = new TokenManagerClass();