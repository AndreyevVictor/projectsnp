import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../shared/services/upload.service';
import { ScoringAlgorithmService } from '../../shared/services/scoring.algorithm.service';

@Component({
  selector: 'app-upload-data',
  templateUrl: './upload.data.component.html',
  styleUrls: ['./upload.data.component.scss']
})
export class UploadDataComponent implements OnInit {
  dataLoaded: boolean = false;

  constructor(private uploadService: UploadService, private scoringAlgorithmService: ScoringAlgorithmService) { }

  ngOnInit() {}

  openFile(event) {
    let input = event.target;
    for (let index:number = 0; index < input.files.length; index++) {
        let reader:FileReader = new FileReader();
        reader.onload = () => {
            let locusData = this.uploadService.parseData(reader.result);
            this.scoringAlgorithmService.processingData(locusData);
            this.dataLoaded = true;
        }
        reader.readAsText(input.files[index]);
    };
  }
}
