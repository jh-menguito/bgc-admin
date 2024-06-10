import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Driver } from '../models/driver.model';
import { DriverService } from '../services/driver.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent implements OnInit {
  personalForm!: any;
  personalData!: any[];
  actionBtn: string = 'Save';
  editedIndex: any;
  dataSource: any;
  maxDate?: string;

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public editData: any,
    private dialogRef: MatDialogRef<DialogComponent>,
    private driverService: DriverService
  ) {
    const today = new Date();
    this.maxDate = today.toISOString().split('T')[0]; //future dates cannot be selected
  }

  driver: Driver = {
    driver_name: '',
    plate_number: '',
    bus_route: '',
    email: '',
    password: '',
  };
  submitted = false;


  ngOnInit(): void {
    this.personalForm = this.formBuilder.group({
      driver_name: ['', Validators.required],
      plate_number: ['', Validators.required],
      bus_route: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/
          ),
        ],
      ], //domainValidator()
      password: ['', [Validators.required]],
    });

    const savedData = localStorage.getItem('personalInfo');
    if (savedData) {
      this.personalData = JSON.parse(savedData);
    } else {
      this.personalData = []; //creates an empty array to store future data
    }

    if (this.editData) {
      this.actionBtn = 'Update';
      this.personalForm.controls['driver_name'].setValue(
        this.editData.driver_name
      );
      this.personalForm.controls['plate_number'].setValue(
        this.editData.plate_number
      );
      this.personalForm.controls['bus_route'].setValue(this.editData.bus_route);
      this.personalForm.controls['email'].setValue(this.editData.email);
      this.personalForm.controls['password'].setValue(this.editData.password);
    }
  }

  getAllDrivers(): void {
    this.driverService.getAll().subscribe({
      next: (data) => {
        console.log(data);
        this.dataSource = new MatTableDataSource(data);
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
      },
      error: (e) => console.error(e),
    });
  }

  addInfo() {
    if (!this.personalForm.valid) {
      alert('please fill out all the required fields');
      return;
    }

  

    if (this.editData) {
      const updatedData = this.personalForm.value;
      const index = this.personalData.findIndex(
        (item: any) => item.driver_name === this.editData.driver_name
      );

      if (index !== -1) {
        this.personalData[index] = updatedData;
      } else {
        //item is nowhere to be found
        alert('no data to be updated');
        return;
      }
    } else {
      this.personalData.push(this.personalForm.value);
    }
    localStorage.setItem('personalInfo', JSON.stringify(this.personalData));
    // Store updated personal data in local storage
    this.personalForm.reset();
    this.dialogRef.close('saved');
    // this.cdr.detectChanges();
    setTimeout(() => {
      window.location.reload();
    }, 100); //automatically reloads the page if save or update button is clicked
  }

  saveInfo() {
    console.log(this.personalForm);

    const data = {
      driver_name: this.personalForm.driver_name,
      plate_number: this.driver.plate_number,
      bus_route: this.driver.bus_route,
      email: this.driver.email,
      password: this.driver.password,
    };
    console.log('Save: ' + data);
    this.driverService.create(data).subscribe({
      next: (res) => {
        console.log(res);
        this.submitted = true;
        this.getAllDrivers();
      },
      error: (e) => console.error(e),
    });
  }

}
