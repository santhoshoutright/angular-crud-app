import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { User } from './interface/user.model';
import { Column } from './interface/column.model';
import { UserService } from './services/users.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular-crud-app';

  userForm: FormGroup;
  userList: any[] = [];
  editingIndex: number | null = null;
  userAvatar: any; // Variable to store the selected avatar
  showErrors: boolean = false; // Add this flag

  columns: any[] = [
    // {
    //   id: "avatar",
    //   label: "Avatar",
    // },
    {
      id: "firstName",
      label: "First Name",
    },
    {
      id: "lastName",
      label: "Last Name",
    },
    {
      id: "username",
      label: "Username",
    },
    {
      id: "email",
      label: "Email",
    },
    {
      id: "mobileNumber",
      label: "Mobile Number",
    },
  ];

  constructor(private fb: FormBuilder, private userService: UserService) {
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


    this.userList = userService.getUsers();
  }

  ngOnInit(): void {
    // You can add any additional initialization logic here
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

  onSubmit(): void {

    this.showErrors = true;
    if (this.userForm.valid) {
      const userFormData = this.userForm.value as User;

      if (this.editingIndex !== null) {
        // Editing an existing user
        this.userService.updateUser(userFormData, this.editingIndex);
      } else {
        // Adding a new user
        this.userService.addUser(userFormData);
      }

      this.userList = this.userService.getUsers();
      this.editingIndex = null;
      this.userForm.reset();
      this.showErrors = false;
    }
  }

  addUser(): void {
    if (this.userForm.valid) {
      const newUser = this.userForm.value as User;
      this.userService.addUser(newUser);
      // this.userList = this.userService.getUsers();
      // this.userForm.reset();
      // this.showErrors = false;
    }
  }

  editUser(index: number): void {
    this.editingIndex = index;
    this.userForm.patchValue(this.userList[index]); // Use patchValue to populate the form
  }

  cancelEdit(): void {
    this.editingIndex = null;
    this.userForm.reset();
  }

  updateUser(): void {
    // this.showErrors = true;
    if (this.userForm.valid && this.editingIndex !== null) {
      const updatedUser = this.userForm.value as User;
      this.userService.updateUser(updatedUser, this.editingIndex); // Update the user using the service
      // this.userList = this.userService.getUsers(); // Refresh the user list
      // this.editingIndex = null;
      // this.userForm.reset();
      // this.showErrors = false;
    }
  }

  deleteUser(index: number): void {
    this.userService.deleteUser(index);
    this.userList = this.userService.getUsers();
    this.showErrors = false;
  }
}
