import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { GalleryService } from '../gallery.service';
import { Gallery } from '../gallery';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { User } from '../user';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  title: string = '';
  url: string = '';
  gallery: Gallery[] = [];
  
  constructor(public auth: AuthService, private router: Router, public service: GalleryService, public db: AngularFireDatabase) {
    if (auth.getCurrentUser() == null) {
      router.navigate(['login']);
    }
  }

  logout() {
    this.auth.logout().then(t => {
      this.router.navigate(['login']);
    });
  
  }

  send() {
    let image = new Gallery();
    image.title = this.title;
    image.url = this.url;
    image.voters.push(this.auth.getCurrentUser() as User); 
    this.service.vote(image);
    this.title = '';
    this.url = '';
    
  }

   hasVoted(g: Gallery): boolean {
    const currentUser = this.auth.getCurrentUser() as User;
    return g.voters.some(voter => voter.email === currentUser?.email);
  }
  
  getVoteCount(image: any): number {
    return image.voters.length;
  }
}