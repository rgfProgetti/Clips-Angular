import { Component } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private auth: Auth){

  }

  showAlert = false
  alertMsg = 'Please wait! We are logging you in'
  alertColor ='blue'
  inSubmission = false

  credentials = {
    email:'',
    password:''
  }

  async login(){

    this.showAlert = true
    this.alertMsg = 'Please wait! We are logging you in'
    this.alertColor ='blue'
    this.inSubmission = true
    try{
        await signInWithEmailAndPassword(this.auth, 
          this.credentials.email, this.credentials.password)
    }catch(e){
      this.inSubmission = false
      this.alertMsg = 'An unexpected error occured. Please try later'
      this.alertColor ='red'

      console.log(e)

      return
    }

    this.alertMsg = 'Success! You are now logged in!'
    this.alertColor ='green'


  }

}
