import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationService } from '../services/formation.service';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-formation-en-ligne',
  templateUrl: './formation-en-ligne.component.html',
  styleUrls: ['./formation-en-ligne.component.css']
})
export class FormationEnLigneComponent implements OnInit {
  trainingId!: string;
  detail: any = null;
  trainings: any[] = [];
  firstVideoLoaded = false;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService,
    private videoService: VideoService
  ) {}

  ngOnInit(): void {
    this.trainingId = this.route.snapshot.paramMap.get('id')!;

    // Fetch training detail first
    this.formationService.getTrainingById(this.trainingId).subscribe((res) => {
      this.detail = res;

      // After detail is loaded, fetch videos
      this.videoService.getVideosByTraining(this.trainingId).subscribe((videos) => {
        this.trainings = videos;

        // Set first video only after both are loaded
        if (videos.length > 0 && !this.firstVideoLoaded) {
          this.loadVideo(videos[0]);
          this.firstVideoLoaded = true;
        }
      });
    });
  }

  loadVideo(video: any) {
    if (this.detail) {
      this.detail.video = video.url;
      this.detail.title = video.title;
    }
  }
}
