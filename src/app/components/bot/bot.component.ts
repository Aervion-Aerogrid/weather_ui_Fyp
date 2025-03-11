import { Component, ViewChild } from '@angular/core';
import { BotApiService } from '../../services/bot/bot-api.service';
import { DrawerpageComponent } from '../drawerpage/drawerpage.component';

@Component({
  selector: 'app-bot',
  templateUrl: './bot.component.html',
  styleUrls: ['./bot.component.css']
})
export class BotComponent {
  userPrompt: string = '';
  aiResponse: string = '';
  isGenerating: boolean = false;

  constructor(private botApiService: BotApiService) {}  // ✅ Corrected service instance name

  askAI() {
    if (this.userPrompt.trim()) {
      this.isGenerating = true;
      this.aiResponse = ''; // Clear previous response

      this.botApiService.askQuestion(this.userPrompt).subscribe(
        (response: any) => {
          if (response && response.response) {
            this.aiResponse = response.response; // Extract AI response from JSON
          } else {
            this.aiResponse = 'Unexpected response from server.';
          }
          this.isGenerating = false;
        },
        error => {
          console.error('API Error:', error);
          this.aiResponse = 'Error fetching response. Please try again.';
          this.isGenerating = false;
        }
      );
    }
  }

  @ViewChild(DrawerpageComponent) drawerPageComponent!: DrawerpageComponent;
  ngAfterViewInit() {
    if (!this.drawerPageComponent) {
      console.error('DrawerPageComponent not found!');
    }
  }

  toggleDrawer() {
    if (this.drawerPageComponent) {
      this.drawerPageComponent.toggleDrawer(); // Toggle drawer open/close
    } else {
      console.error('DrawerPageComponent not found!');
    }
  }
}

