import { Pipe, PipeTransform } from '@angular/core';
import { FieldValue, Timestamp } from '@angular/fire/firestore';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'fpTimestamp'
})
export class FpTimestampPipe implements PipeTransform {

  constructor(private datePipe: DatePipe){

  }

  transform(value: FieldValue | undefined): unknown {

    if(!value){
      return ''
    }
    
    const date = (value as Timestamp).toDate()
    return this.datePipe.transform(date, 'mediumDate');
  }

}
