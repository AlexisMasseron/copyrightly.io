import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';

import { Web3Service } from '../../util/web3.service';

declare let require: any;
const registry_artifacts = require('../../../../build/contracts/Registry.json');

@Component({
  selector: 'app-manifest-single',
  templateUrl: './manifest-single.component.html',
  styleUrls: ['./manifest-single.component.css']
})
export class ManifestSingleComponent implements OnInit {
  Registry: any;
  accounts: string[];
  account: string;
  manifestation = {
    title: '',
    hash: ''
  };

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.Registry = this.web3Service.artifactsToContract(registry_artifacts);
    this.getAccounts();
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 5000});
  }

  getAccounts() {
    this.web3Service.getAccounts().subscribe(
      (accounts: string[]) => {
        this.accounts = accounts;
        this.account = accounts[0];
        },
      error => this.setStatus(<any>error.message));
  }

  async manifest() {
    if (!this.Registry) {
      this.setStatus('Registry is not loaded, unable to send transaction to contract');
      return;
    }
    this.setStatus('Initiating registration... (please wait)');
    try {
      const deployedRegistry = await this.Registry.deployed();
      const transaction = await deployedRegistry.manifestAuthorship.sendTransaction(
        this.manifestation.hash, this.manifestation.title, {from: this.account});

      if (!transaction) {
        this.setStatus('Transaction failed!');
      } else {
        this.setStatus('Transaction submitted!');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error registering creation, see log for details');
    }
  }
}
