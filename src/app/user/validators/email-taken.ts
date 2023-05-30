import { Injectable } from "@angular/core";
import { Auth, fetchSignInMethodsForEmail } from "@angular/fire/auth";
import { AbstractControl, AsyncValidator, ValidationErrors } from "@angular/forms";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class EmailTaken implements AsyncValidator {
    constructor(private auth: Auth){

    }
    validate = (control: AbstractControl<any, any>): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
        return fetchSignInMethodsForEmail(this.auth, control.value).then(
            response => response.length ? {emailTaken:true} : null
        )
    }
    // registerOnValidatorChange?(fn: () => void): void {
    //     throw new Error("Method not implemented.");
    // }
}
