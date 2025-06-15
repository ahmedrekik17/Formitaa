import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-gestionvideo',
  templateUrl: './gestionvideo.component.html',
  styleUrls: ['./gestionvideo.component.css']
})
export class GestionvideoComponent implements OnInit {
  trainingId!: string;

  constructor(private route: ActivatedRoute,
    private videoService : VideoService
    ) {}

  ngOnInit(): void {
    this.trainingId = this.route.snapshot.paramMap.get('id')!;
    this.videoService.getVideosByTraining(this.trainingId).subscribe((videos) => {
      this.videos = videos;
    });
  }
  selectedFile: File | null = null;
videos: any[] = [];

onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.selectedFile = input.files[0];
  }
}

videoTitle: string = '';

uploadVideo() {
  if (!this.selectedFile || !this.trainingId) return;

  const title = this.videoTitle.trim() || this.selectedFile.name;


  this.videoService
    .uploadVideo(this.trainingId, this.selectedFile, title)
    .subscribe(() => {
      this.loadVideos();
      this.selectedFile = null;
      this.videoTitle = '';
    });
}

loadVideos() {
  this.videoService.getVideosByTraining(this.trainingId).subscribe(videos => {
    this.videos = videos;
  });
}

deleteVideo(videoId: string) {
  console.log(videoId);
  
  this.videoService.deleteVideo(videoId).subscribe(() => {
    this.loadVideos();
  });
}
playPreview(event: MouseEvent) {
  const video = event.target as HTMLVideoElement;
  video.muted = true; // Explicitly ensure it's muted
  video.play();
}

pausePreview(event: MouseEvent) {
  const video = event.target as HTMLVideoElement;
  video.pause();
  video.currentTime = 0;
}
showUpload = false;

cancelUpload() {
  this.showUpload = false;
  this.videoTitle = '';
  this.selectedFile = null;
}
isSidebarOpen: boolean = false; // Add this line to your component
toggleSidebar() {
  this.isSidebarOpen = !this.isSidebarOpen;
}
closeSideBar(): void{
  this.isSidebarOpen = false;
}


}
  