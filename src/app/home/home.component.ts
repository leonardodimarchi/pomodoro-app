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
   * Diz se a página de boas vindas será mostrada
   */
  public greetingsPage: boolean = true;

  /**
   * Diz se a página de boas vidas está sendo apagada
   */
  public isTurningOffGreetings: boolean = false;

  //#endregion

  //#region Public Methods

  public turnOffGreetings(): void {
    this.isTurningOffGreetings = true;

    setTimeout(()=> {
      this.greetingsPage = false;
    },1500);
  }
  //#endregion

}
