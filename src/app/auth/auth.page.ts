import { AlertController, LoadingController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  isLoading = false;

  isLogin = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {}

  authenticate(email: string, password: string) {
    this.loadingCtrl
      .create({
        keyboardClose: true,
        message: 'Carregando...',
      })
      .then((loadingEl) => {
        loadingEl.present();
        let authObsv: Observable<AuthResponseData>;
        if (this.isLogin) {
          authObsv = this.authService.login(email, password);
        } else {
          authObsv = this.authService.signup(email, password);
        }
        this.isLoading = true;
        authObsv.subscribe(
          (resData) => {
            console.log(resData);
            this.isLoading = false;
            loadingEl.dismiss();
            this.router.navigateByUrl('/espacos/tabs/descobrir');
          },
          (errRes) => {
            console.log(errRes);
            loadingEl.dismiss();
            const code = errRes.error.error.message;
            let message =
              'Não foi possível efetuar o registo. Por favor, tente mais tarde.';
            if (code == 'EMAIL_EXISTS') {
              message = 'E-mail já registado em sistema.';
            } else if (code == 'EMAIL_NOT_FOUND') {
              message = 'E-mail não registado em sistema.';
            } else if (code == 'INVALID_PASSWORD') {
              message = 'Senha incorreta.';
            }
            this.showAlert(message);
          }
        );
      });
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    const email = form.value.email;
    const password = form.value.password;
    console.log(email, password);

    this.authenticate(email, password);
    form.reset();
  }

  private showAlert(message: string) {
    this.alertCtrl
      .create({
        header: 'Falha na Autenticação',
        message: message,
        buttons: ['OK'],
      })
      .then((alertEl) => {
        alertEl.present();
      });
  }

  onSwitchAuthMode() {
    this.isLogin = !this.isLogin;
  }
}
