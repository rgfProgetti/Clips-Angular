import { FieldValue } from "@angular/fire/firestore";

export default interface IClip{
    docID?: string;
    uid: string;
    displayName: string;
    title: string;
    fileName: string;
    url: string;
    screenshotURL: string;
    timestamp: FieldValue;
    screenshotFileName: string;
}