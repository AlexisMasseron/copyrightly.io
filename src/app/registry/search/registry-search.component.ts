import { Component, OnInit } from '@angular/core';
import { AlertsService } from '../../alerts/alerts.service';
import { Web3Service } from '../../util/web3.service';
import { RegistryContractService } from '../registry-contract.service';
import { Manifestation } from '../manifestation';

@Component({
  selector: 'app-registry-search',
  templateUrl: './registry-search.component.html',
  styleUrls: ['./registry-search.component.css']
})
export class RegistrySearchComponent implements OnInit {
  manifestation = new Manifestation();

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService) {}

  ngOnInit(): void { }

  getManifestation(hash: string) {
    this.registryContractService.getManifestation(hash)
      .subscribe((manifestation: Manifestation) => {
        this.manifestation = manifestation;
        if (!this.manifestation.title) {
          this.alertsService.info('Content hash not found, unregistered');
        }
      }, error => {
        this.alertsService.error(error);
      });
  }
}
