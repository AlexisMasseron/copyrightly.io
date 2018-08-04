import { Injectable } from '@angular/core';
import { Web3Service } from '../util/web3.service';
import { AlertsService } from '../alerts/alerts.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private accounts = new BehaviorSubject<string[]>([]);
  private selectedAccount = new BehaviorSubject<string>('');

  constructor(private web3Service: Web3Service,
              private alertsService: AlertsService) {
    this.refreshAccounts();
  }

  public refreshAccounts() {
    this.web3Service.getAccounts()
      .subscribe(
      (accounts: string[]) => {
        this.accounts.next(accounts);
        this.selectedAccount.next(accounts[0])
      },
      error => this.alertsService.error(error));
  }

  getSelectedAccount(): Observable<string> {
    return this.selectedAccount.asObservable()
  }

  setSelectedAccount(account: string) {
    this.selectedAccount.next(account);
  }

  getAccounts(): Observable<string[]> {
    return this.accounts.asObservable()
  }
}
