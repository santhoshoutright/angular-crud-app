import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Firestore, collection, deleteDoc } from '@angular/fire/firestore';
import { UserService } from './../services/users.service';

@Component({
  selector: 'app-users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css']
})
export class UsersTableComponent implements OnInit {
  users: any[] = [];
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

  constructor(private service: UserService) { }


  getUsers() {
    // this.service.getUsers().subscribe((res) => {
    //   this.users = res;
    // })
  }
  ngOnInit(): void {
    this.getUsers();
  }

}
