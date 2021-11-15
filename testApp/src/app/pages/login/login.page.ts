import { Component, OnInit } from '@angular/core';
import{Router} from '@angular/router'
import { FormBuilder, FormGroup, Validators, EmailValidator } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm:FormGroup;

  constructor(private router:Router,private fb:FormBuilder,private authService:AuthService,
    private loadingCtrl:LoadingController,private alertCtrl:AlertController) { }

   ngOnInit() {
     this.loginForm=this.fb.group(
       {
         email:['', [Validators.email,Validators.required]],
         password:['',[Validators.minLength(6),Validators.required]]
       }
     );
   }
   login (){

    this.loadingCtrl.create({
      message:'Loading ...'

    }).then(loading=>{
        loading.present();
       this.authService.login(this.loginForm.getRawValue()).subscribe(res =>{
       console.log('We are back',res);
       this.loadingCtrl.dismiss();

     },err =>{
      this.loadingCtrl.dismiss();
     })

   });

   }

   forgotPw(){
     this.alertCtrl.create({
       header:'Reset Password',
       message:'Insert you email and we will send you a  new password',
       inputs:[
         {
         name :'email',
         type :'email',
         placeholder:'you@example.com'
         }
       ],
       buttons:[
         {
            text:'Cancel',
            role:'cancel'
         },
         {
           text:'OK',
           handler :(data) =>{
             this.authService.resetPW(data.email).subscribe(res=>{
               this.alertCtrl.create({
              header:'Sucess',
              message:res['msg'],
              buttons:['OK']
               }).then(alert=>alert.present())
             })
           }
         }
       ]
     }).then(alert=>alert.present());

   }
}
