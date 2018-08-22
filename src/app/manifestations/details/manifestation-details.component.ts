import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../util/web3.service';
import { RegistryContractService } from '../registry-contract.service';
import { AlertsService } from '../../alerts/alerts.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Manifestation } from '../manifestation';

@Component({
  selector: 'app-manifestation-details',
  templateUrl: './manifestation-details.component.html',
  styleUrls: ['./manifestation-details.component.css']
})
export class ManifestationDetailsComponent implements OnInit {

  manifestation: Manifestation;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.route.paramMap.pipe(switchMap((params: ParamMap) =>
      this.registryContractService.getManifestation(params.get('id'))))
    .subscribe((manifestation: Manifestation) => {
      this.manifestation = manifestation;
    }, error => this.alertsService.error(error));
  }
}
