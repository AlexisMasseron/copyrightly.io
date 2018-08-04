import { Component, OnDestroy, OnInit } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { AlertsService } from '../alerts/alerts.service';
import { AuthenticationService } from './authentication.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public isCollapsed: boolean;
  public account: string;
  public accounts: string[];

  constructor(private web3Service: Web3Service,
              private authenticationService: AuthenticationService,
              private errorMessageService: AlertsService) {}

  ngOnInit() {
    this.isCollapsed = true;
    this.authenticationService.getAccounts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(accounts =>  this.accounts = accounts );
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(account =>  this.account = account );
  }

  refreshAccounts() {
    this.authenticationService.refreshAccounts();
  }

  onChange(selectedAccount: string) {
    this.authenticationService.setSelectedAccount(selectedAccount);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
