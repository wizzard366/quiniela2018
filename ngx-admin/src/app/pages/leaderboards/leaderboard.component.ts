import { Component } from '@angular/core';
import {UsersService} from '../services/users-api/users.service'
import { AuthenticationService } from '../services/auth/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'ngx-leaderboard',
  styleUrls: [],
  templateUrl: './leaderboard.component.html',
  providers: [UsersService]
})
export class LeaderboardComponent  {

  private userId:any;
  public rows:any;
  public userData:any;

  constructor(
    private usersService:UsersService,
    private authenticationService:AuthenticationService,
    private modalService: NgbModal){
    this.userId = this.authenticationService.userId;

  }

  getLeaderboard(){

    this.usersService.getLeaderboard().subscribe(data=>{
      let previousPoints=-1;
      let currentPosition=0;
      let counter=1;
      data.results.forEach(element => {
        if (element.totalpoints<previousPoints||previousPoints==-1){
          currentPosition=counter;
          previousPoints = element.totalpoints;
        }
        element.position = currentPosition;
        counter++;
      });
      this.userData=data.results;
    })
  }



  ngAfterViewInit(){
    this.getLeaderboard();
  }
}
