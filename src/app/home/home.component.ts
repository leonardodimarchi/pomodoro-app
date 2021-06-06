import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void { }


  //#region Public Properties

  /**
   * Diz se
   */
  public greetingsPage: boolean = true;

  //#endregion

}
