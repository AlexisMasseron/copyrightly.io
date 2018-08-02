import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { AlertsService } from '../alerts/alerts.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isCollapsed: boolean;
  public account: string;

  constructor(private web3Service: Web3Service,
              private errorMessageService: AlertsService) {}


ngOnInit() {
    this.isCollapsed = true;
    this.web3Service.getAccounts().subscribe(
      (accounts: string[]) => {
        this.account = accounts[0];
      },
      error => this.errorMessageService.error(error));
  }
}
