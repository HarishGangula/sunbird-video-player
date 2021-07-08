import { Component } from '@angular/core';
import { PlayerConfig } from 'projects/sunbird-video-player/src/lib/playerInterfaces';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  playerConfig: PlayerConfig = {
    context: {
      mode: 'play',
      authToken: '',
      sid: '7283cf2e-d215-9944-b0c5-269489c6fa56',
      did: '3c0a3724311fe944dec5df559cc4e006',
      uid: 'anonymous',
      channel: '505c7c48ac6dc1edc9b08f21db5a571d',
      pdata: { id: 'prod.diksha.portal', ver: '3.2.12', pid: 'sunbird-portal.contentplayer' },
      contextRollup: { l1: '505c7c48ac6dc1edc9b08f21db5a571d' },
      tags: [
        ''
      ],
      cdata: [],
      timeDiff: 0,
      objectRollup: {},
      host: '',
      endpoint: '',
      userData: {
        firstName: 'Harish Kumar',
        lastName: 'Gangula'
      }
    },
    config: {
      traceId: 'afhjgh',
      sideMenu: {
        showShare: true,
        showDownload: true,
        showReplay: true,
        showExit: true
      }
    },
    // tslint:disable-next-line:max-line-length
    metadata: {"compatibilityLevel":2,"copyright":"NCERT","subject":["CPD"],"channel":"0125196274181898243","language":["English"],"mimeType":"video/mp4","objectType":"Content","gradeLevel":["Others"],"appIcon":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/do_31309320735055872011111/artifact/nishtha_icon.thumb.jpg","primaryCategory":"Explanation Content","artifactUrl":"https://ntpproductionall.blob.core.windows.net/ntp-content-production/content/assets/do_31309320735055872011111/engagement-with-language-.mp4","contentType":"ExplanationResource","identifier":"do_31309320735055872011111","audience":["Student"],"visibility":"Default","mediaType":"content","osId":"org.ekstep.quiz.app","languageCode":["en"],"license":"CC BY-SA 4.0","name":"Engagement with Language","status":"Live","code":"1c5bd8da-ad50-44ad-8b07-9c18ec06ce29","streamingUrl":"https://ntpprodmedia-inct.streaming.media.azure.net/67a523f9-9590-4b5e-b161-bf6753a5e9d6/engagement-with-language-.ism/manifest(format=m3u8-aapl-v3)","medium":["English"],"createdOn":"2020-08-24T17:58:32.911+0000","copyrightYear":2020,"lastUpdatedOn":"2020-08-25T04:36:47.587+0000","creator":"NCERT COURSE CREATOR 6","pkgVersion":1,"versionKey":"1598330207587","framework":"ncert_k-12","createdBy":"68dc1f8e-922b-4fcd-b663-593573c75f22","resourceType":"Learn","orgDetails":{"email":"director.ncert@nic.in","orgName":"NCERT"},"licenseDetails":{"name":"CC BY-SA 4.0","url":"https://creativecommons.org/licenses/by-sa/4.0/legalcode","description":"For details see below:"}},
    data: {}
  };

  playerEvent(event) {
    // console.log(event);
  }

  telemetryEvent(event) {
    console.log('in app: ', JSON.stringify(event));
  }
}
