import { Component, OnDestroy, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent  implements OnInit, OnDestroy, OnChanges{

  @Input() activeClip : IClip | null = null
  @Output() update = new EventEmitter()
  inSubmission = false
  showAlert = false
  alertColor = 'blue'
  alertMsg='Please wait! Updating clip.'


  title =  new FormControl('', {
    validators:[Validators.required,
    Validators.minLength(3)],
    nonNullable:true})

  clipID = new FormControl('', {
    validators:[Validators.required,
      Validators.minLength(3),
      Validators.nullValidator],
    nonNullable:true
  })

  editForm = new FormGroup({
    title: this.title,
    id: this.clipID
  })

  constructor(private modal:ModalService,
    private clipService: ClipService){

  }


  ngOnInit(): void {
    this.modal.register('editClip')
  }


  ngOnDestroy(): void {
     this.modal.unregister('editClip')
  }


  ngOnChanges(){
    if(!this.activeClip){
      return
    }

    this.inSubmission = false;
    this.showAlert = false;

    this.clipID.setValue(this.activeClip.docID as string)
    this.title.setValue(this.activeClip.title)
  }


  async submit(){

    if(!this.activeClip){
      return
    }

    this.inSubmission =true
    this.showAlert = true
    this.alertColor = 'blue'
    this.alertMsg = 'Please wait! Updating clip.'

    try{
      await this.clipService.updateClip(this.clipID.value, this.title.value)
    }catch(error){
      this.inSubmission = false
      this.alertColor = 'red'
      this.alertMsg='Something went wrong. Try again later.'
      return
    }

    this.inSubmission = false
    this.alertColor = 'green'
    this.alertMsg = 'Success!'
    
    this.activeClip.title = this.title.value
    this.update.emit(this.activeClip)


  }

}
