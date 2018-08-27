import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, ParamMap, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { Web3Service } from '../../util/web3.service';
import { ManifestationsContractService } from '../manifestations-contract.service';
import { AlertsService } from '../../alerts/alerts.service';
import { Manifestation } from '../manifestation';
import { UploadEvidenceEvent } from '../../evidences/upload-evidence-event';
import { UploadEvidencesContractService } from '../../evidences/upload-evidences-contract.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manifestation-details',
  templateUrl: './manifestation-details.component.html',
  styleUrls: ['./manifestation-details.component.css']
})
export class ManifestationDetailsComponent implements OnInit, OnDestroy {

  manifestation: Manifestation;
  evidences: UploadEvidenceEvent[];
  addingEvidence = false;
  navigationSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private location: Location,
              private web3Service: Web3Service,
              private manifestationsContractService: ManifestationsContractService,
              private uploadEvidencesContractService: UploadEvidencesContractService,
              private alertsService: AlertsService) {}

  ngOnInit(): void {
    this.route.paramMap
    .pipe(switchMap((params: ParamMap) =>
      this.manifestationsContractService.getManifestation(params.get('id'))))
    .subscribe((manifestation: Manifestation) => {
      this.manifestation = manifestation;
      this.loadEvidences();
    });
  }

  loadEvidences(): void {
    this.uploadEvidencesContractService.listManifestationEvidences(this.manifestation.hash)
    .subscribe((evidences: UploadEvidenceEvent[]) => {
      this.evidences = evidences;
    }, error => this.alertsService.error(error));

    // Reload evidences if page reloaded
    this.navigationSubscription = this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.navigationSubscription.unsubscribe();
        this.loadEvidences();
      }
    });
  }

  back() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }
}
