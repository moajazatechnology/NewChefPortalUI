import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/_services/dataservice';
declare var $ : any;

@Component({
  selector: 'app-edit-profile-chef',
  templateUrl: './edit-profile-chef.component.html',
  styleUrls: ['./edit-profile-chef.component.scss']
})
export class EditProfileChefComponent implements OnInit {
id:any;
userData:any={_chef_profile:{ _chef_profile_image:{ media_url:{}, },_chef_banner_image:{media_url:{}, }, } ,
              _chef_store:{_chef_store_address:{}, }, };
userData1:any;
chefProfileid : any;
profileimagename:any;
profileImageIncoded:any;
profileBanerName:any;
profileBanerIncoded:any;
  // cuisineNamesList: Response;
  constructor(  private _dataService :DataService,private activateroute:ActivatedRoute
    ) { }

  ngOnInit(): void {
    
    this.id = this.activateroute.snapshot.params.id;
   
    this.getCurrentChefInfo();
  
  } 

getCurrentChefInfo() {
  this._dataService.getChefInfo({url:'chef?chef_id=' + this.id, isLoader:false})
  .subscribe(response => {
    this.userData = response;
    console.log("Cgef Reponce ====>",this.userData);
    this.chefProfileid = this.userData.chef_profile_id;
    console.log("chefProfileid ====>",this.chefProfileid);
  });
}

public getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

convertimage(event){
  let file = event.target.files[0];
  this.getBase64(file).then(
    (res:any)=>{
      this.profileimagename = file.name;
      this.profileImageIncoded = res;
      console.log("profileImageIncoded===>",this.profileImageIncoded);
      
    }
  )
}
convertbaner(event){
  let file = event.target.files[0];
  this.getBase64(file).then(
    (res:any)=>{
      this.profileBanerName = file.name;
      this.profileBanerIncoded = res;
      console.log("profileBanerIncoded===>",this.profileBanerIncoded);
      
    }
  )
}



updateProfile(){
  console.log("update method=>",this.userData)
  // email
  let em={
    chef_id :this.id,
    email:this.userData.email,
  }
  this._dataService.post({url:'chef/details/email',data:em, isLoader:false}).subscribe((res:any)=>{
    console.log("email=>",res)
  });
  // phone
  let em1={
    chef_id :this.id,
    phone_number:this.userData.phone_number,
  }
  this._dataService.post({url:'chef/details/phone_number',data:em1, isLoader:false}).subscribe((res:any)=>{
      console.log("phone_number=>",res)
    });
    // biography
    let em2={
      chef_id :this.id,
      chef_profile_id : this.chefProfileid,
      biography : this.userData._chef_profile.biography
    }
    this._dataService.post({url:'chef/chef_profile/bio',data:em2, isLoader:false}).subscribe((res:any)=>{
      console.log("biography   =>",res)
    });

    // address
  let em3 = {
    "chef_id": this.id,
    "address_1": this.userData._chef_store._chef_store_address.address_1,
    "address_2": this.userData._chef_store._chef_store_address.address_2,
    "address_3": this.userData._chef_store._chef_store_address.address_3,
    "city": this.userData._chef_store._chef_store_address.city,
    "county": this.userData._chef_store._chef_store_address.country,
    "postcode": this.userData._chef_store._chef_store_address.postcode,
  }
  this._dataService.post({url:'chef/chef_store/address',data:em3, isLoader:false}).subscribe((res:any)=>{
    console.log("address   =>",res)
  });

  // Radius
  let em4 ={
      "chef_id": this.id,
      "radius": this.userData._chef_store.accepted_radius
      }
      this._dataService.post({url:'chef/chef_store/accepted_radius',data:em4, isLoader:false}).subscribe((res:any)=>{
        console.log("accepted_radius   =>",res)
      }); 

    // ProfilePicture
    if(this.profileImageIncoded){
      let em5={
        "chef_id": this.id,
        "chef_profile_id":  this.chefProfileid,
        "profile_picture" : this.profileImageIncoded
      }
      this._dataService.post({url:'chef/chef_profile/profile_picture',data:em5, isLoader:false}).subscribe((res:any)=>{
        console.log("profile_pictures   =>",res)
      });
    }
     

    // baner Picture
    if(this.profileBanerIncoded){
      let em6={
        "chef_id": this.id,
        "chef_profile_id": this.chefProfileid,
        "banner_picture": this.profileBanerIncoded
    }
    this._dataService.post({url:'chef/chef_profile/banner_picture',data:em6, isLoader:false}).subscribe((res:any)=>{
      console.log("banner_picture   =>",res)
    });
    }
    
  }
  
}


