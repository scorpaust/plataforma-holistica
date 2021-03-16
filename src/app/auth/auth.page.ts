import { Component, OnInit } from '@angular/core';

import { AuthService } from './auth.service';
import { LoadingController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {

  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private loadingCtrl: LoadingController) { }

  ngOnInit() {
  }

  onLogin() {
    this.authService.login();
    this.loadingCtrl.create({
      keyboardClose: true,
      message: 'Carregando...'
    }).then(loadingEl => {
      loadingEl.present();
      this.isLoading = true;
      setTimeout(() => {
        this.router.navigateByUrl('/espacos/tabs/descobrir');
        this.isLoading = false;
        loadingEl.dismiss();
      }, 1500)
    });
  }

}
