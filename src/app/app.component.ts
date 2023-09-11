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
  userAvatar: string | ArrayBuffer | null = null; // Use a string or ArrayBuffer to store the Data URL
  showErrors: boolean = false; // Add this flag
  avatarError: boolean = false;

  columns: any[] = [
    {
      id: "avatar",
      label: "Avatar",
    },
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
      avatar: [''],
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


  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Convert the selected file to a Data URL
      const reader = new FileReader();
      reader.onload = (e) => {
        this.userAvatar = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    } else {
      this.userAvatar = null; // Reset the avatar if no file is selected
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

  onSubmit(): void {

    this.showErrors = true;
    if (!this.userAvatar) {
      // No avatar uploaded, display an error and prevent form submission
      this.avatarError = true;
    } else {
      this.avatarError = false;
    }

    if (this.userForm.valid) {

      if (!this.userAvatar) {
        return;
      }

      const userFormData = this.userForm.value as User;

      if (this.editingIndex !== null) {
        // Editing an existing user
        userFormData.avatar = this.userAvatar; // Add avatar data
        this.userService.updateUser(userFormData, this.editingIndex);
      } else {
        // Adding a new user
        userFormData.avatar = this.userAvatar; // Add avatar data
        this.userService.addUser(userFormData);
      }

      this.userList = this.userService.getUsers();
      this.editingIndex = null;
      this.userForm.reset();
      this.showErrors = false;
      this.userAvatar = null;
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
    const userData = this.userList[index];

    // Populate the form with the existing user data
    this.userForm.patchValue({
      ...userData
    });

    // Update the userAvatar to display the correct avatar
    this.userAvatar = userData.avatar; // Assuming 'avatar' is the field in your user data for the avatar URL
  }

  cancelEdit(): void {
    this.editingIndex = null;
    this.userForm.reset();
    this.showErrors = false;
    this.userAvatar = null;
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
