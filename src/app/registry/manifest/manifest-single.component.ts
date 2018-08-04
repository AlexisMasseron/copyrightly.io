import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs/internal/Subject';
import { takeUntil } from 'rxjs/operators';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { RegistryContractService } from '../registry-contract.service';
import { Manifestation } from '../manifestation';
import { AuthenticationService } from '../../navbar/authentication.service';

@Component({
  selector: 'app-manifest-single',
  templateUrl: './manifest-single.component.html',
  styleUrls: ['./manifest-single.component.css']
})
export class ManifestSingleComponent implements OnInit, OnDestroy {
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  account: string;
  manifestation = new Manifestation();

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.authenticationService.getSelectedAccount()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(account => this.account = account );
  }

  manifest() {
    this.registryContractService.manifest(this.manifestation, this.account)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((receipt) => {
        console.log('Transaction receipt: ' + receipt);
        this.alertsService.info('Registration submitted, waiting for confirmation...<br>' +
          'Receipt: <a href="' + receipt + '">' + receipt + '</a>');
      }, error => {
        this.alertsService.error(error);
      });
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }
}
