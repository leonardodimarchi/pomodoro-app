import { Component } from '@angular/core';
import { ElectronService } from '../core/services';
import { TimeUpdateInterface } from '../shared/interfaces/time-update.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {

  constructor(
    private readonly electronService: ElectronService,
  ) { }

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
   * Contagem
   */
  public counter: TimeUpdateInterface = {
    minutes: 25,
    seconds: 0,
  };

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

      this.emitTimeToTray();

      if (!this.pomodoroIsRunning && !this.breakTimeIsRunning) {
        clearInterval(counter);
        return;
      }

      if (this.counter.seconds === 0) {

        if (this.counter.minutes === 0) {

          if (this.pomodoroIsRunning) {
            this.electronService.ipcRenderer.send('TIME_DONE', 'Pomodoro is over');
            this.playSound('../../assets/sounds/beep_1.mp3');
            this.pomodoroIsRunning = false;

            this.setBreakTime();
            setTimeout(() => this.startStopBreakTime(),1500);
          }

          if (this.breakTimeIsRunning) {
            this.electronService.ipcRenderer.send('TIME_DONE', 'Break is over');
            this.playSound('../../assets/sounds/beep_2.mp3');
            this.breakTimeIsRunning = false;

            this.setPomodoroTime();
            setTimeout(() => this.startStopPomodoro(),1500);
          }

          this.pomodoroIsRunning = false;
          this.breakTimeIsRunning = false;

          return;
        }

        this.counter.seconds = 60;
        this.counter.minutes--;
      }

      this.counter.seconds--;
    }, 1000);
  }

  /**
   * Reseta o tempo para o tempo de descanso
   */
  public setBreakTime(): void {
    this.counter.minutes = 5;
    this.counter.seconds = 0;
  }

  /**
   * Reseta o tempo para o tempo de pomodoro
   */
  public setPomodoroTime(): void {
    this.counter.minutes = 25;
    this.counter.seconds = 0;
  }

  /**
   * Método que emite o contador para a barra de tarefas
   */
  public emitTimeToTray(): void {
    this.electronService.ipcRenderer.send('TIME_UPDATE', this.counter);
  }

  /**
   * Toca um audio
   */
  public playSound(audioSrc: string): void {
    const audio = new Audio(audioSrc);

    audio.load();
    audio.play();
  }

  //#endregion

}
