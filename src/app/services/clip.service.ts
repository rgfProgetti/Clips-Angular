import { Injectable } from '@angular/core';
import { CollectionReference, collection, Firestore, 
  addDoc, DocumentReference, where, query, getDocs, 
  QuerySnapshot, updateDoc, doc, deleteDoc, orderBy, limit, getDoc, startAfter } from '@angular/fire/firestore';
import { Storage, ref, deleteObject } from '@angular/fire/storage';
import IClip from '../models/clip.model';
import { Auth, user } from '@angular/fire/auth';
import { switchMap, map } from 'rxjs';
import { of, BehaviorSubject, combineLatest } from 'rxjs';
import { ResolveFn } from '@angular/router';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ClipService{

  public clipsCollection: CollectionReference<IClip>
  pageClips: IClip[] = []
  pendingReq = false

  constructor(private db: Firestore, private auth: Auth, 
    private storage: Storage, private router : Router) {
    this.clipsCollection  = collection(this.db,'clips') as CollectionReference<IClip>
   }


   async createClip(data : IClip): Promise<DocumentReference<IClip>>{
    return addDoc(this.clipsCollection,data)
   }

   getUserClips(sort$: BehaviorSubject<string>){

      return combineLatest([user(this.auth), sort$]).pipe(
          switchMap(values => {

            const [user, sort] = values

            if(!user){
              return of([])
            }
            const queryClips = query(this.clipsCollection, 
              where(
              'uid',"==",user.uid), 
              orderBy(
                'timestamp',
                sort === '1' ? 'desc' : 'asc'
              ))
          
            return getDocs(queryClips);

          }),
          map((snapshot) => 
            (snapshot as QuerySnapshot<IClip>).docs
          )
      )
   }


   updateClip(id: string, title: string){
    const docRef = doc(this.db,this.clipsCollection.path,id)
    return updateDoc(docRef,{      
      title
    })
   }

   async deleteClip(clip: IClip){
      const clipRef = ref(this.storage, `clips/${clip.fileName}`)
      const screenshotRef = ref(this.storage, `screenshots/${clip.screenshotFileName}`)
      
      await deleteObject(clipRef)
      await deleteObject(screenshotRef)

      const docRef = doc(this.db,this.clipsCollection.path,clip.docID as string)
      await deleteDoc(docRef)
   }

   async getClips(){

    if(this.pendingReq){
      return
    }

    this.pendingReq = true

      let queryClips = query(this.clipsCollection, 
        orderBy(
          'timestamp',
          'desc'
        ), limit(3))

        const {length} = this.pageClips

        if(length){
          const lastDocId = this.pageClips[length -1].docID

          const docRef = doc(this.db,this.clipsCollection.path,lastDocId as string)
          const lastDoc = await getDoc(docRef) 

          queryClips = query(queryClips, startAfter(lastDoc))
        }

        const snapshot = await getDocs(queryClips)

        snapshot.forEach(doc => {
          this.pageClips.push({
            docID: doc.id,
            ...doc.data()
          })
        })
        this.pendingReq = false
   }


   getClip(id: string){
      const docRef = doc(this.db,this.clipsCollection.path,id as string)
      const docPromise = getDoc(docRef).then((snapshot => {
        const data = snapshot.data()
        if(!data){
          this.router.navigate(['/'])
          return null
        }
        return {
          docID: snapshot.id,
          ...snapshot.data()
        }
      }))
     
      return docPromise as Promise<IClip | null>

   }

}



