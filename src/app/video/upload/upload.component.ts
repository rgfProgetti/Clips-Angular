import { Component, OnDestroy} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Storage,  uploadBytesResumable, ref, getDownloadURL, UploadTask, UploadTaskSnapshot } from '@angular/fire/storage';
import {v4 as uuid} from 'uuid'
import { ChangeDetectorRef } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
import { serverTimestamp } from '@angular/fire/firestore';
import { FfmpegService } from 'src/app/services/ffmpeg.service';
import { NgZone } from '@angular/core';
import { Subject } from 'rxjs';



@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnDestroy {

  isDragover = false
  file : File | null = null
  nextStep = false
  percentage = 0
  showPercentage = false

  showAlert = false
  alertMsg = 'Please wait! Your video is being uploaded'
  alertColor ='blue'
  inSubmission = false

  user : User | null = null
  task?: UploadTask
  taskScreenshot?: UploadTask
  uploadSubject: Subject<UploadTaskSnapshot> = new Subject<UploadTaskSnapshot>()

  screenshots: string[] = []
  selectedScreenshot = ''

  title =  new FormControl('', {nonNullable:true,
  validators: [Validators.required,
    Validators.minLength(3),
    Validators.nullValidator]})

  constructor(private storage : Storage, private changeref : ChangeDetectorRef,
    private auth : Auth, private clipService : ClipService, private router : Router,
    public ffmpegService : FfmpegService, private ngZone : NgZone){


      let user$ = user(auth)  
      user$.subscribe((us) => this.user = us)
      


      this.ffmpegService.init()
  }

  ngOnDestroy(): void {
    this.task?.cancel()    
    this.taskScreenshot?.cancel()  
    this.uploadSubject.unsubscribe()
  }


  thumbnail =  new FormControl('',
  [
    Validators.required])

  video =  new FormControl<File | null>(null,
  [
    Validators.required
  ])

  
  uploadForm = new FormGroup({
    title: this.title
    //video:this.video
  })

  async storeFile($event : Event){

    if(this.ffmpegService.isRunning){
      return
    }
      

    this.isDragover = false
    this.nextStep=false

    this.file = ($event as DragEvent).dataTransfer ?
    ($event as DragEvent).dataTransfer?.files.item(0) ?? null :
    ($event.target as HTMLInputElement).files?.item(0) ?? null

    if(!this.file || this.file.type !== 'video/mp4'){
      return
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file)
    this.selectedScreenshot = this.screenshots[0]

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/,''))
    this.video.setValue(this.file)

    this.nextStep=true
  }



  async uploadFile(){
    this.uploadForm.disable()


    this.showAlert = true
    this.alertMsg = 'Please wait! Your video is being uploaded'
    this.alertColor ='blue'
    this.inSubmission = true
    this.showPercentage = true

    const clipFileName = uuid()
    const clipPath = ref(this.storage,`clips/${clipFileName}.mp4`)

    const screenshotBlob = await this.ffmpegService.blobFromUrl(this.selectedScreenshot)
    const screeshotPath = ref(this.storage,`screenshots/${clipFileName}.png`)

    const arrayByte = await this.file?.arrayBuffer()

    const metadata = {
      contentType: this.file?.type,
    };

    const metadataBlob = {
      contentType: screenshotBlob?.type,
    };
          
    try{
      if(arrayByte){

        var updateUploadProgress = new Map();

        this.uploadSubject.subscribe({
          next: (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            updateUploadProgress.set(snapshot.ref.name,progress)
            let totalProgress = 0
            updateUploadProgress.forEach((value)=>{
              totalProgress += value
            })
            this.percentage = totalProgress /(100 * updateUploadProgress.size)
            this.changeref.detectChanges()
          },
          error: (error) => {
            this.uploadSubject.error('')
            this.uploadForm.enable()     
            this.alertMsg = 'Upload failed! Please try later'
            this.alertColor ='red'
            this.showPercentage = false
            this.inSubmission = false
            console.error(error)
            this.changeref.detectChanges()
          },
          complete: async () =>{
            const screenshotURL = await getDownloadURL(screeshotPath)
            getDownloadURL(clipPath).then(async (clipUrl) => {
              const clip = {
                uid: this.user?.uid as string,
                displayName: this.user?.displayName as string,
                title: this.title.value,
                fileName: `${clipFileName}.mp4`,
                url: clipUrl,
                screenshotURL: screenshotURL,
                timestamp: serverTimestamp(),
                screenshotFileName:  `${clipFileName}.png`
              }
  
              const clipDocumentReference = await this.clipService.createClip(clip)
    
              this.alertMsg = 'Success! Your video has been uploaded'
              this.alertColor ='green'
              this.showPercentage = false
              this.changeref.detectChanges()

              this.uploadSubject.unsubscribe()
  
              setTimeout(() => {
                this.ngZone.run(()=>{
                  this.router.navigate([
                    'clip',clipDocumentReference.id
                  ])
                })
              },1000)
            })
          }
        });
        
        this.task = uploadBytesResumable(clipPath, arrayByte, metadata);

        this.taskScreenshot = uploadBytesResumable(screeshotPath, screenshotBlob, metadataBlob)
        
        this.task.on('state_changed', (snapshot) => {
          this.uploadSubject.next(snapshot)
        },
        (error) => {     
           this.uploadSubject.error(error)
        },
        () => {
          if(this.percentage === 1){
            this.uploadSubject.complete()
          }             
        }
        )
        
        this.taskScreenshot.on('state_changed', (snapshot) => {
          this.uploadSubject.next(snapshot)
        },
        (error) => {     
           this.uploadSubject.error(error)
        },
        () => {
          if(this.percentage === 1){
            this.uploadSubject.complete()
          }             
        }
        )


      }
      
    }catch(error){
      this.uploadForm.enable()
      console.error(error)

      this.alertMsg = 'An unexpected error occured, please try later'
      this.alertColor ='red'
      this.inSubmission = false
      return
    }

  }

}
