import { inject } from '@angular/core';
import {
  Router, ResolveFn,
  RouterStateSnapshot,
  ActivatedRouteSnapshot
} from '@angular/router';
import IClip from '../models/clip.model';
import { ClipService } from '../services/clip.service';


export const ClipResolver: ResolveFn<IClip | null>=
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(ClipService).getClip(route.paramMap.get('id')!);
    };


