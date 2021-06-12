import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {

  constructor() { }

  //#region Lifecycle Events

  public ngOnInit(): void {

  }

  //#endregion

  //#region Public Properties

  /**
   * Diz se a página de boas vindas será mostrada
   */
  public greetingsPage: boolean = true;

  /**
   * Diz se a página de boas vidas está sendo apagada
   */
  public isTurningOffGreetings: boolean = false;

  /**
   * Contagem de minutos
   */
  public minutes: number = 25;

  /**
   * Contagem de segundos
   */
  public seconds: number = 0;

  /**
   * Diz se o tempo para o pomodoro esta rodando
   */
  public pomodoroIsRunning: boolean = false;

  /**
   * Diz se o tempo de descanso esta rodando
   */
  public breakTimeIsRunning: boolean = false;

  //#endregion

  //#region Public Methods

  public startStopPomodoro(): void {
    if (this.pomodoroIsRunning) {
      this.pomodoroIsRunning = false;

      this.minutes = 25;
      this.seconds = 0;
      return;
    }

    this.pomodoroIsRunning = true;

    this.startCounting(25, 0);
  }

  /**
   * Desativa a tela de boas vindas
   */
  public turnOffGreetings(): void {
    this.isTurningOffGreetings = true;

    setTimeout(() => {
      this.greetingsPage = false;
    }, 1500);
  }

  /**
   * Contagem de segundos
   */
  public startCounting(minutes: number, seconds: number): void {
    this.seconds = seconds;
    this.minutes = minutes;

    const counter = setInterval(() => {
      if (!this.pomodoroIsRunning && !this.breakTimeIsRunning) {
        clearInterval(counter);
        return;
      }

      if (this.seconds === 0) {

        if (this.minutes === 0)
          return;

        this.seconds = 60;
        this.minutes--;
      }

      this.seconds--;
    }, 1000);
  }

  //#endregion

}
