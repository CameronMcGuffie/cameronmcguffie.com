import { Component, EventEmitter, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http'

@Component({
    selector: 'contact-form',
    templateUrl: './contact-form.component.html',
    styleUrls: ['./contact-form.component.scss']
})

export class ContactFormComponent {
    constructor(private http: HttpClient) { }

    public yourName;
    public yourEmail;
    public yourMessage;

    @Output()
    hideContactPopup: EventEmitter<boolean> = new EventEmitter<boolean>();

    public hideContact() {
        this.hideContactPopup.emit(false);
        console.log('Show contact');
    }

    public sentOK() {
        this.hideContact();
        
        alert('Message Sent! thanks for contacting me :)');
    }

    public sendemail() {
        if(!this.yourEmail) {
            alert('Error: You must supply your e-mail address.');
        } else if(!this.yourName) {
            alert('Error: You must supply your name.');
        } else if(!this.yourMessage) {
            alert('Error: You must supply a message.');
        } else {
            this.http.post('scripts/send_email.php', { from: this.yourEmail, subject: this.yourName, body: this.yourMessage }).subscribe({
                next: data => this.sentOK(),
                error: error => alert('Error: Please try again.')
            });
        }
    }
}