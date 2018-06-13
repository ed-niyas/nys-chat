import { Component, Inject, EventEmitter } from '@angular/core'
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
    selector: 'device-popup',
    templateUrl: 'device.popup.html'
})


export class DevicePopup {

    constructor(
        public dialogRef: MatDialogRef<DevicePopup>,
        @Inject(MAT_DIALOG_DATA) public data: any) {
            this.dialogRef.disableClose= true
    }

    onSave = new EventEmitter();

    onNoClick(): void {
        this.onSave.emit(null);
        this.dialogRef.close();
    }

    Remove(){
        let new_ipset = [];
        let device_ips = this.data.device_ips;
        this.data.remove_ips.forEach( function (element, index ) {
            if(!element){
                new_ipset.push(device_ips[index]);
            }
        });
        this.onSave.emit(new_ipset);
        this.dialogRef.close();
    }
}
