import { Injectable } from '@angular/core';

interface IModal{
  visible : boolean,
  id : string
}


@Injectable({
  providedIn: 'root'
})
export class ModalService {

  private modals : IModal[] = []
  private visible = false;

  constructor() { }

  isModalVisible(id: string) : boolean{
    return !!this.modals.find(mod => mod.id === id)?.visible
    
  }

  toggleModal(id: string){
    const modal = this.modals.find(mod => mod.id === id)
    if(modal){
      modal.visible = !modal.visible;
    }
   
  }

  register(id: string){
      this.modals.push({
        id,
        visible : false
      })
  }


  unregister(id: string){
    this.modals = this.modals.filter(element => element.id !== id)
  }


}
