import { Component } from '@angular/core';
import { faFacebookF, faGoogle, faInstagram,faTwitter } from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
})
export class FooterComponent {
  faFacebookF = faFacebookF;
  faGoogle = faGoogle;
  faInstagram = faInstagram;
  faTwitter = faTwitter;
  getyear: number = new Date().getFullYear();
  goToLink(url: string) {
    window.open(url, '_blank');;
  }
}