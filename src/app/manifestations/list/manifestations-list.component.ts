import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { filter, flatMap, takeUntil } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { RegistryContractService } from '../registry-contract.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { ManifestEvent } from '../manifest-event';

@Component({
  selector: 'app-manifestations-list',
  templateUrl: './manifestations-list.component.html',
  styleUrls: ['./manifestations-list.component.css']
})
export class ManifestationsListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public manifestationEvents: ManifestEvent[] = [];

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(filter(account => account !== ''))
      .pipe(flatMap((account: string) =>
        this.registryContractService.listManifestEvents(account)))
      .subscribe(events => {
            this.manifestationEvents = events;
          }, error => this.alertsService.error(error));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
