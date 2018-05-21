export class User {
    displayName: string;/**display name for user */
    handle: string;/**unique identifier for user */
    password: string;/**password for user */

    constructor(displayName, handle, password){
        this.displayName=displayName;
        this.handle=handle;
        this.password=password;        
    }
}
