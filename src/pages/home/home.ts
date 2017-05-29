import { Component, NgZone } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import {IBeacon} from '@ionic-native/ibeacon'
import { BLE } from '@ionic-native/ble';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  beacons = {}
  text = 'No beacons found. Move closer to the beacon'

  constructor(public navCtrl: NavController, private ibeacon: IBeacon, platform: Platform, private ble:BLE, private zone: NgZone ) {

    platform.ready().then(() => {
      if (platform.is('cordova')) {
        console.log('Searching for beacons')
        this.searchBeacons()
      }
    })

    
}

searchBeacons() {
  this.ibeacon.requestAlwaysAuthorization();
    let delegate = this.ibeacon.Delegate();
    
    delegate.didRangeBeaconsInRegion()
  .subscribe(
    data => {
      console.log('didRangeBeaconsInRegion: ', data)
    },
    error => console.error()
  );

  delegate.didStartMonitoringForRegion()
  .subscribe(
    data => console.log('didStartMonitoringForRegion: ', data),
    error => console.error()
  );
delegate.didEnterRegion()
  .subscribe(
    data => {
      this.zone.run(() => {
        this.text = "Beacon within range"
      })
      this.beacons[data.region.identifier] = data
      console.log('didEnterRegion: ', data);
      console.log(this.beacons)
    }
  );

delegate.didExitRegion().subscribe(data => {
  console.log('Exited region')
  this.zone.run(() => {
    this.text = "Beacon out of range";
  })
  
  delete this.beacons[data.region.identifier]
})

  let beaconRegion = this.ibeacon.BeaconRegion('curveBeacon','00000000-0000-0000-0000-000000000000'); // Change this UUID
  this.ibeacon.startMonitoringForRegion(beaconRegion)
} 

keys() {
  return Object.keys(this.beacons)
}

}
