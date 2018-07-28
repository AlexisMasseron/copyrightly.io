import { Injectable } from '@angular/core';

const IPFS_API = require('ipfs-api');

declare let require: any;
declare const Buffer;

@Injectable()
export class IpfsService {
  private ipfs: any;

  constructor() {
    this.ipfs = IPFS_API('ipfs.infura.io', '5001', {protocol: 'https'});
  }

  public upload(file) {
    const reader = new FileReader();
    reader.addEventListener('load', (event: any) => {
      let content = [];
      content.push({
        path: file.name,
        content: Buffer.from(event.target.result)
      });
      this.ipfs.files.add(content, (err, res) => {
        console.log(err, res)
      });
    });
    reader.readAsArrayBuffer(file);
  }
}
