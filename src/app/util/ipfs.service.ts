import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import IPFS_API from 'ipfs-api';

declare const Buffer;

@Injectable()
export class IpfsService {
  private ipfsApi: any;

  constructor() {
    this.ipfsApi = IPFS_API('ipfs.infura.io', '5001', {protocol: 'https'});
  }

  public uploadFile (file): Observable<string> {
    return new Observable((observer) => {
      const reader = new FileReader();
      reader.onprogress = (progress) => console.log(`Loaded: ${progress}`);
      reader.onloadend = () => {
        this.saveToIpfs(reader).subscribe((hash: string) => {
          observer.next(hash);
          observer.complete();
        }, error => observer.error(error));
      };
      reader.readAsArrayBuffer(file);
      return { unsubscribe() {} };
    });
  }

  private saveToIpfs(reader): Observable<string> {
    return new Observable((observer) => {
      const buffer = Buffer.from(reader.result);
      this.ipfsApi.add(buffer, { progress: (progress) => console.log(`Saved: ${progress}`) })
      .then((response) => {
        console.log(response);
        console.log(`IPFS_ID: ${response[0].hash}`);
        observer.next(response[0].hash);
        observer.complete();
      })
      .catch((err) => {
        console.error(err);
        observer.error(new Error('Error uploading file, see logs for details'));
      });
      return { unsubscribe() {} };
    });
  }
}
