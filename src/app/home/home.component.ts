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

  /**
   * Começa ou reseta o tempo de pomodoro
   */
  public startStopPomodoro(): void {
    this.setPomodoroTime();

    if (this.pomodoroIsRunning) {
      this.pomodoroIsRunning = false;
      return;
    }

    this.pomodoroIsRunning = true;

    this.startCounting();
  }

  /**
   * Começa ou reseta o tempo de descanso
   */
  public startStopBreakTime(): void {
    this.setBreakTime();

    if (this.breakTimeIsRunning) {
      this.breakTimeIsRunning = false;
      return;
    }

    this.breakTimeIsRunning = true;

    this.startCounting();
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
   * Realiza a contagem
   */
  public startCounting(): void {
    const counter = setInterval(() => {
      if (!this.pomodoroIsRunning && !this.breakTimeIsRunning) {
        clearInterval(counter);
        return;
      }

      if (this.seconds === 0) {

        if (this.minutes === 0) {

          if (this.pomodoroIsRunning)
            this.setBreakTime();

          if (this.breakTimeIsRunning)
            this.setPomodoroTime();

          this.pomodoroIsRunning = false;
          this.breakTimeIsRunning = false;

          return;
        }

        this.seconds = 60;
        this.minutes--;
      }

      this.seconds--;
    }, 1000);
  }

  /**
   * Reseta o tempo para o tempo de descanso
   */
  public setBreakTime(): void {
    this.minutes = 5;
    this.seconds = 0;
  }

  /**
   * Reseta o tempo para o tempo de pomodoro
   */
  public setPomodoroTime(): void {
    this.minutes = 25;
    this.seconds = 0;
  }

  //#endregion

}
