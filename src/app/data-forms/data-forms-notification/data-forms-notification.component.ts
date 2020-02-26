import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AngularFireFunctions} from '@angular/fire/functions';

@Component({
  selector: 'app-data-forms-notification',
  templateUrl: './data-forms-notification.component.html',
  styleUrls: ['./data-forms-notification.component.less']
})
export class DataFormsNotificationComponent implements OnInit {

  public title: string;
  public content: string;
  public password: string;
  public selectedIconPath: string = 'https://www.matas-iaf.com/icons/logo192x192.png';

  public icons: any[] = [
    {
      name: 'logo192x192',
      src: 'https://www.matas-iaf.com/icons/logo192x192.png'
    },
    {
      name: 'aerobatic',
      src: 'https://www.matas-iaf.com/icons/aerobatic.png'
    },
    {
      name: 'genericAircraft',
      src: 'https://www.matas-iaf.com/icons/genericAircraft.svg'
    }
  ]

  constructor(private http: HttpClient, private fns: AngularFireFunctions) { }

  ngOnInit() {
  }

  sendNotification() {
    let callable = this.fns.httpsCallable('sendTopic');
    callable({
      'title': this.title,
      'body': this.content,
      'topic': 'users',
      'icon': this.selectedIconPath,
      'password': this.password
    })
  }
}

