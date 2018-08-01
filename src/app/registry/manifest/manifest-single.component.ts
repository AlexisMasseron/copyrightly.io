import { Component, OnInit } from '@angular/core';
import { ErrorMessageService } from '../../error-handler/error-message.service';
import { Web3Service } from '../../util/web3.service';
import { RegistryContractService } from '../registry-contract.service';
import { Manifestation } from '../manifestation';

@Component({
  selector: 'app-manifest-single',
  templateUrl: './manifest-single.component.html',
  styleUrls: ['./manifest-single.component.css']
})
export class ManifestSingleComponent implements OnInit {
  accounts: string[];
  account: string;
  manifestation = new Manifestation();

  constructor(private web3Service: Web3Service,
              private registryContractService: RegistryContractService,
              private errorMessageService: ErrorMessageService) {}

  ngOnInit(): void {
    this.getAccounts();
    this.watchManifestEvents();
  }

  setStatus(status) {
    this.errorMessageService.showErrorMessage(status);
  }

  getAccounts() {
    this.web3Service.getAccounts().subscribe(
      (accounts: string[]) => {
        this.accounts = accounts;
        this.account = accounts[0];
        },
      error => this.setStatus(error));
  }

  manifest() {
    this.setStatus('Initiating registration... (please wait)');
    this.registryContractService.manifest(this.manifestation, this.account)
      .subscribe((receipt) => {
        console.log('Transaction receipt: ' + receipt);
        this.setStatus('Registration submitted!');
      }, error => {
        this.setStatus(error);
      });
  }
}
