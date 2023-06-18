import { Injectable } from '@angular/core';
import { Gallery } from './gallery';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from './user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GalleryService {
  title: string = '';
  url: string = '';
  gallery: Array<Gallery> = new Array<Gallery>();
  
  constructor(public db: AngularFireDatabase, private auth: AuthService) { 
    db.list<Gallery>('gallery').valueChanges().subscribe(t => {
      this.gallery = t;
      this.gallery = this.gallery.sort((a : Gallery, b : Gallery) => {
        if(a.voters.length < b.voters.length) {
          return 1;
        }
        else if (a.voters.length > b.voters.length) {
          return -1;
        }
        else{
          return 0;
        }
      });
    });
   }

   vote(g: Gallery) {
    let result = this.gallery.filter(t => t.title == g.title);
    if (result.length == 0) {
      this.db.list<Gallery>('gallery').push(g);
    } else {
      const currentUser = this.auth.getCurrentUser() as User;
      if (this.hasVoted(g)) {
        alert('You have already voted!');
      } else {
        let res2 = result[0].voters.filter(t => t.email == currentUser.email);
        if (res2.length == 0) {
          result[0].voters.push(currentUser);
          this.refresh();
        }
      }
    }
  }
  
  refresh() {
    this.db.list<Gallery>('gallery').remove();
    for (let g of this.gallery) {
      this.db.list<Gallery>('gallery').push(g);
    }
  }
  
  hasVoted(g: Gallery): boolean {
    const currentUser = this.auth.getCurrentUser() as User;
    return g.voters.some(voter => voter.email === currentUser?.email);
  }
}