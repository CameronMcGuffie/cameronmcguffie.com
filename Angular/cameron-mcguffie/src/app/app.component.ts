import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'cameron-mcguffie';

  public contact_show;

  hideContactPopup: boolean = false;

  public ngOnInit() {
    this.contact_show = false;
  }

  public showContact() {
    this.contact_show = true;
    console.log('Show contact');
  }

  eventEmitHandler(value) {
    this.contact_show = value;
    console.log('Contact: ' + value);
  }
}
