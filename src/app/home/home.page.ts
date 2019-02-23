import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase'
import { AlertController, ToastController } from '@ionic/angular';
import { Firebase } from '@ionic-native/firebase/ngx';
import { HttpClient, HttpHeaders } from '@angular/common/http'


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  idmac:any

  ref=firebase.database().ref();
  pokemos:any=[]
  constructor(
    private alercotroller:AlertController,
    private notifiacion:Firebase,
    private httt:HttpClient,
    private toasl: ToastController
  ){
    //listar datos de la base
    this.ref.on('value',response=>{
      let datos=snapshotToArray(response)
        console.log("colll ",datos);
      this.pokemos=datos
    });

    
    
    //crear datos de la base
    // let insertar =this.ref.push();
    // insertar.set({name: 'Pichu'});

    //optener dato con key
    firebase.database().ref('-LYbU11j5J1NDm14xB42').on('value',response=>{
      let datos=snapshotToObject(response);
      console.log(datos);
    });

    let data={
      name:'combosquet'

    };
    //firebase.database().ref('-LYbU11j5J1NDm14xB42').update(data);
  }

  ngOnInit(){
    
    this.notifiacion.getToken().then(token=>{
    this.notifiacion.subscribe("topico")
     
    }).catch(error =>{
      console.log(error)
    })

    this.notifiacion.onNotificationOpen().subscribe(response=>{
      console.log(response)
      if(response.id!=this.idmac)
        this.presentToast(response)

    })
  }

  delete(pokemon:any){
    console.log(pokemon);
    firebase.database().ref(pokemon.key).remove();
  }

  async eli(pokemon){
    console.log("entra a eli")
    const alert= await this.alercotroller.create({
      header:'Eliminar pokemon',
    
      buttons:[{
        text:'cancelar',
        role:'cancel',
        cssClass:'secondary',
        handler:()=>{
          console.log('comfirm Cancel');
        }
      },{
        text:'Eliminar',
        role:'delete',
        handler:()=>{
          this.delete(pokemon);

          let body: any ={
            data: {
              title: "Se elimino un pokemon",
              body: "Adiós pokemon",
              //id: this.id
            },
            to: "/topics/topico"
          }

          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization:'key=AAAAcXckp8M:APA91bHigcV0FGDUHBE_AODhp7NhltLq-sv_gpeDGzbQNdJQEmZjGRR4ryCbeZriS0f7_nYSfwwF5t64H90p_WuupOYkFKuWCosEAc6ifrVMxWb5MDWauzDgT3QkKj3BWIcGrM1yJAl2'
            })
          }

          this.httt.post("https://fcm.googleapis.com/fcm/send",body,httpOptions).subscribe(data =>{
                    console.log("entro eliminar")
           })
        }
        
      }
    
    ]
     
    })
    alert.present();
  }


  async edit(pokemon){
    const alert=await this.alercotroller.create({
      header:'pokemon',
      inputs:[{
        name:'name',
        type:'text',
        placeholder:'Nombre',
        value:pokemon.name
      }],
      buttons:[{
        text:'cancelar',
        role:'cancel',
        cssClass:'secondary',
        handler:()=>{
          console.log('comfirm Cancel');
        }
      },{
        text:'OK',
        role:'update',
        handler:(data)=>{
          console.log('comfirm',data)
          firebase.database().ref(pokemon.key).update(data);


          let body: any ={
            data: {
              title: "Se edito un pokemon",
              body: "pokrmon: "+data.name,
              //id: this.id
            },
            to: "/topics/topico"
          }

          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization:'key=AAAAcXckp8M:APA91bHigcV0FGDUHBE_AODhp7NhltLq-sv_gpeDGzbQNdJQEmZjGRR4ryCbeZriS0f7_nYSfwwF5t64H90p_WuupOYkFKuWCosEAc6ifrVMxWb5MDWauzDgT3QkKj3BWIcGrM1yJAl2'
            })
          }

          this.httt.post("https://fcm.googleapis.com/fcm/send",body,httpOptions).subscribe(data =>{
                    console.log("entro editar")
           })

        }



        
      }
    
    ]
     
    })
    alert.present();
  }

  async presentToast(data) {
    let toast = await this.toasl.create({
      message: data.title,
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }

  async add(){
    const alert=await this.alercotroller.create({
      header:'pokemon',
      inputs:[{
        name:'name',
        type:'text',
        placeholder:'Nombre',
        
      }],
      buttons:[{
        text:'cancelar',
        role:'cancel',
        cssClass:'secondary',
        handler:()=>{
          console.log('comfirm Cancel');
        }
      },{
        text:'OK',
        role:'create',
        handler:(data)=>{
          console.log('comfirm',data)


          

          let insertar =this.ref.push();

          insertar.set({name: data.name});

          let body: any ={
            data: {
              title: "Pokemon creado",
              body: "Pokemon creado",
              //id: this.id
            },
            to: "/topics/topico"
          }

          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization:'key=AAAAcXckp8M:APA91bHigcV0FGDUHBE_AODhp7NhltLq-sv_gpeDGzbQNdJQEmZjGRR4ryCbeZriS0f7_nYSfwwF5t64H90p_WuupOYkFKuWCosEAc6ifrVMxWb5MDWauzDgT3QkKj3BWIcGrM1yJAl2'
            })
          }

          this.httt.post("https://fcm.googleapis.com/fcm/send",body,httpOptions).subscribe(data =>{
                    console.log("todo bien")
           })
          
        }
        
      }
    
    ]
     
    })
    alert.present();
  }
}

export const snapshotToArray=snapshot=>{
  console.log("pppppp: ",snapshot);
  let returnArr =[]
  snapshot.forEach(childSnapshot => {
    let item=childSnapshot.val();
    item.key=childSnapshot.key;
    returnArr.push(item);
  });
  return returnArr;

}

export const snapshotToObject= snapshot=>{
  let item=snapshot.val();
  item.key=snapshot.key;

  return item;
}