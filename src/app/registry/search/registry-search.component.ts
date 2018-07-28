import { Component, OnInit } from '@angular/core';
import { Web3Service } from '../../util/web3.service';
import { MatSnackBar } from '@angular/material';

declare let require: any;
const registry_artifacts = require('../../../../build/contracts/Registry.json');

@Component({
  selector: 'app-registry-search',
  templateUrl: './registry-search.component.html',
  styleUrls: ['./registry-search.component.css']
})
export class RegistrySearchComponent implements OnInit {
  Registry: any;
  retrieved = {
    title: '',
    authors: [],
    hash: '',
  };

  constructor(private web3Service: Web3Service, private matSnackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.Registry = this.web3Service.artifactsToContract(registry_artifacts);
  }

  setStatus(status) {
    this.matSnackBar.open(status, null, {duration: 5000});
  }

  async getManifestation(hash: string) {
    try {
      const deployedRegistry = await this.Registry.deployed();
      const result = await deployedRegistry.getManifestation(hash);
      this.retrieved.title = result[0];
      this.retrieved.hash = hash;
      this.retrieved.authors = result[1];
      if (!this.retrieved.title) {
        this.setStatus('Work not found, unregistered');
      }
    } catch (e) {
      console.log(e);
      this.setStatus('Error getting manifestation for hash, see log for details');
    }
  }
}
