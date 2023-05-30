import { Component } from '@angular/core';
import { FormGroup, FormControl, Validator, Validators } from '@angular/forms'
import {Auth, createUserWithEmailAndPassword} from '@angular/fire/auth'
import {Firestore, collection, doc, setDoc, addDoc} from '@angular/fire/firestore'
import { AuthService } from 'src/app/services/auth.service';
import IUser from 'src/app/models/user.model';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  
    name =  new FormControl('', [
      Validators.required,
      Validators.minLength(3)])
    email =  new FormControl('',
    [
      Validators.required,
      Validators.email
    ],[this.emailTaken.validate])
    age =  new FormControl<number | null>(null,
    [
      Validators.required,
      Validators.min(18),
      Validators.max(120)
    ])
    password =  new FormControl('',
    [
      Validators.required,
      Validators.pattern("^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$")
    ]
    )
    confirm_password =  new FormControl('',
    [
      Validators.required
    ])
    phoneNumber =  new FormControl('',
    [
      Validators.required,
      Validators.minLength(16),
      Validators.maxLength(16)
    ]
    )

  showAlert = false
  alertMsg = 'Please wait! Your account has been created'
  alertColor ='blue'

  inSubmission = false

  registerForm = new FormGroup({
    name: this.name,
    email: this.email,
    age:this.age,
    password: this.password,
    confirm_password: this.confirm_password,
    phoneNumber: this.phoneNumber
  }, [RegisterValidators.match('password','confirm_password')])
  


  constructor(private auth: AuthService, private emailTaken : EmailTaken){   
  }

  async register(){
    this.showAlert = true
    this.alertMsg = 'Please wait! Your account has been created'
    this.alertColor ='blue'
    this.inSubmission = true

    //const {email, password, age, phoneNumber, name} = this.registerForm.value

    try{
     await this.auth.createUser(this.registerForm.value as IUser)
    }catch(e){
      console.error(e)

      this.alertMsg = 'An unexpected error occured, please try later'
      this.alertColor ='red'
      this.inSubmission = false
      return
    }

    this.alertMsg = 'Success! Your account has been created!'
    this.alertColor ='green'
  }
}
