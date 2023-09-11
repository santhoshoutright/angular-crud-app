import { Injectable } from '@angular/core';
import { User } from './../interface/user.model';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly localStorageKey = 'userList';

  constructor() { }

  getUsers(): User[] {
    const userListString = localStorage.getItem(this.localStorageKey);
    return userListString ? JSON.parse(userListString) : [];
  }

  addUser(user: User): void {
    const userList = this.getUsers();
    userList.push(user);
    localStorage.setItem(this.localStorageKey, JSON.stringify(userList));
  }

  updateUser(user: User, index: number): void {
    const userList = this.getUsers();
    userList[index] = user;
    localStorage.setItem(this.localStorageKey, JSON.stringify(userList));
  }

  deleteUser(index: number): void {
    const userList = this.getUsers();
    userList.splice(index, 1);
    localStorage.setItem(this.localStorageKey, JSON.stringify(userList));
  }
}
