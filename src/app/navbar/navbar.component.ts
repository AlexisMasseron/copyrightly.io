import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { ErrorMessageService } from '../error-handler/error-message.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  public isCollapsed: boolean;
  public account: string;

  constructor(private web3Service: Web3Service,
              private errorMessageService: ErrorMessageService) {}


ngOnInit() {
    this.isCollapsed = true;
    this.web3Service.getAccounts().subscribe(
      (accounts: string[]) => {
        this.account = accounts[0];
      },
      error => this.errorMessageService.showErrorMessage(error));
  }
}
