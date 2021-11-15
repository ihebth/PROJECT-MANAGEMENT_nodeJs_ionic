import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  private registerForm:FormGroup;

  constructor(private authService:AuthService,private fb:FormBuilder,private loadingCtrl:LoadingController,
    private toastCtrl:ToastController, private router:Router) { }

  ngOnInit() {
    this.registerForm=this.fb.group({
      first_name:['',Validators.required],
      last_name:['',Validators.required],
      email:['',[Validators.required,Validators.email]],
      password:['',[Validators.required,Validators.minLength(6)]],
      disclaimer:[false,Validators.requiredTrue],
    })
  }
  register() {
    console.log('Register:',this.registerForm.getRawValue());
    this.loadingCtrl.create({
      message:'Loading ...'

    }).then(loading=>{
      loading.present();
    this.authService.register(this.registerForm.getRawValue()).subscribe(res=>{
      this.loadingCtrl.dismiss();
      this.toastCtrl.create({
        message:'you are now signed up',
       // showCloseButton : true ,
       // closeButtonText:'OK',
        
      }).then(toast =>{
        toast.present();
        this.router.navigateByUrl('/login');
      })

    },err=>{  
      this.loadingCtrl.dismiss();
    
    });
    });
  }
}
