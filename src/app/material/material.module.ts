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
    MatFormFieldModule
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
    ],
 
    providers: [
    ]
})

export class MaterialModule { }
