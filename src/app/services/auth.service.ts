import { Injectable } from '@angular/core';
import {Auth, createUserWithEmailAndPassword, updateProfile, user, signOut} from '@angular/fire/auth'
import {Firestore, collection, doc, setDoc, addDoc, CollectionReference} from '@angular/fire/firestore'
import IUser from '../models/user.model';
import { Observable, of } from 'rxjs';
import {delay, map, filter, switchMap} from 'rxjs/operators';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavigationEnd } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userCollection : CollectionReference<IUser>
  public isAuthenticated$ : Observable<boolean>
  public isAuthenticatedWithDelay$ : Observable<boolean>
  public redirect = false


  constructor(private auth:Auth, private db:Firestore,
    private router : Router, private actRouter : ActivatedRoute) { 
    this.userCollection = collection(this.db,'users')  as CollectionReference<IUser>

    let user$ = user(auth)  
    this.isAuthenticated$ = user$.pipe(
      map(userFound => !!userFound)
    )
    this.isAuthenticatedWithDelay$ = this.isAuthenticated$.pipe(
      delay(1000)
    )

    this.router.events.pipe(
      filter(ev =>ev instanceof NavigationEnd),
      map(e => this.actRouter.firstChild),
      switchMap(route => route?.data ?? of({authOnly : false}))
    ).subscribe((data)=>{this.redirect = data['authOnly'] ?? false})

    
  }

  public async createUser(userData : IUser){

    if(!userData.password){
      throw new Error("Password not provided")
    }

    const userCred = await createUserWithEmailAndPassword(this.auth, userData.email,
      userData.password)

      if(!userCred.user){
        throw new Error("User can't be found")
      }
            
      const docRef = doc(this.userCollection, userCred.user.uid)
       await setDoc<IUser>(docRef, {
         name: userData.name,
         email: userData.email,
         age: userData.age,
         phoneNumber: userData.phoneNumber });


         await updateProfile(userCred.user,{
            displayName : userData.name
         })

  }

  async logout($event? : Event){
    if($event){
      $event.preventDefault()
    }

    await signOut(this.auth)

    if(this.redirect){
      await this.router.navigateByUrl('/')
    }
  }
}
