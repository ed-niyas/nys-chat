export class User {
    displayName: string;
    handle: string;
    password: string;

    constructor(displayName, handle, password){
        this.displayName=displayName;
        this.handle=handle;
        this.password=password;        
    }
}
