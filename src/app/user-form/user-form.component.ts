import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { UsersService } from './../services/users.service';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.css']
})
export class UserFormComponent implements OnInit {
  userForm: FormGroup;
  userAvatar: any; // Variable to store the selected avatar
  showErrors: boolean = false; // Add this flag

  constructor(private fb: FormBuilder,private service: UsersService) {
    // console.log("Firestore : ", this.firestore);
    this.userForm = this.fb.group({
      // avatar: [''],
      firstName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      lastName: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      username: ['', [Validators.required, Validators.pattern('^[a-zA-Z ]+$')]],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      password: ['', Validators.required],
      confirmPassword: ['', [Validators.required, this.passwordMatchValidator]]
    });
  }

  ngOnInit(): void {
    // You can add any additional initialization logic here
  }

  // You can add form submission and validation logic here

  // Handle avatar change event
  onAvatarChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.userForm.patchValue({ avatar: file.name });
      this.userForm.get('avatar')?.updateValueAndValidity();

      // Read and display the selected image
      const reader = new FileReader();
      reader.onload = () => {
        this.userAvatar = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Custom password match validator
  passwordMatchValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.parent?.get('password');
    const confirmPassword = control.parent?.get('confirmPassword');

    console.log("Password: ", password?.value);

    if (password?.value !== confirmPassword?.value) {
      return { 'passwordMismatch': true };
    }

    return null;
  }

  async onSubmit() {
    // Set the flag to true to display errors on form submission
    this.showErrors = true;

    if (this.userForm.valid) {
      // Form is valid, proceed with submission
      const formData = this.userForm.value;

      // Create a Firestore collection reference
      // const collectionRef = collection(this.firestore, 'users');

      try {
        // Add the form data to Firestore
        // let response = this.service.addUser(formData);
        // console.log("Document response: ", response);

        // Reset the form and hide validation errors
        this.userForm.reset();
        this.showErrors = false;
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    } else {
      // Form is invalid, show validation errors
    }
  }

}
