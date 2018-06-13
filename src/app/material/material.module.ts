import { NgModule }       from '@angular/core';

// import { MaterialModule } from '@angular/material';
import {
    
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCheckboxModule
  } from '@angular/material';
  
  
@NgModule({
    entryComponents:[],
    declarations:[],
    imports: [
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatDialogModule,
        MatCheckboxModule
    ],
    
    exports: [
        MatFormFieldModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatDialogModule,
        MatCheckboxModule
    ],
 
    providers: [
    ]
})

export class MaterialModule { }
