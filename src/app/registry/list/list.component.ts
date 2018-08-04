import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { flatMap, map, takeUntil } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { RegistryContractService } from '../registry-contract.service';
import { ManifestationEvent } from '../manifestation-event';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  public manifestationEvents: ManifestationEvent[] = [];

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService,
              private ref: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.web3Service.getAccounts()
      .pipe(takeUntil(this.ngUnsubscribe))
      .pipe(flatMap((accounts: string[]) =>
        this.registryContractService.listManifestEvents(accounts[0])))
          .subscribe(events => {
              this.manifestationEvents.push(events);
              this.ref.detectChanges();
            },error => this.alertsService.error(error));
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
