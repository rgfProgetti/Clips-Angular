export default interface IUser{
    email: string,
    password?: string,
    age: number,
    name: string,
    phoneNumber: string

}

//method to create same type using a class instead of typescript
// export default class IUser{
//     email?: string
//     password?: string
//     age?: number
//     name?: string
//     phoneNumber?: string
// }