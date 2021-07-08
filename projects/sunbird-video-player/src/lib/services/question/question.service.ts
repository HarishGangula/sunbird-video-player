import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from '../data/data.service';
import { PublicDataService } from '../../services/public-data/public-data.service';
import { ServerResponse } from '../../interfaces/serverResponse';
import * as _ from 'lodash-es';
import { UUID } from 'angular2-uuid';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public http: HttpClient;
  constructor(public dataService: DataService, http: HttpClient,
              private publicDataService: PublicDataService) {
    this.http = http;
  }

  readQuestion(questionId) {
    // tslint:disable-next-line:max-line-length
    const field = 'body,primaryCategory,mimeType,qType,answer,templateId,responseDeclaration,interactionTypes,interactions,name,solutions,editorState,media';
    const option = {
      url: `${'question/v1/read/'}${questionId}`,
      param: {
        fields: field
      }
    };
    return this.publicDataService.get(option);
  }

}
