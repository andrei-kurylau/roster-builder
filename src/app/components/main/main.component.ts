import { Component, ViewChild } from '@angular/core';
import { PlayersListComponent } from '../players-list/players-list.component';
import { DataService } from '../../services/data-service.service';
import { Raid } from '../../interfaces/raid';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent {
  @ViewChild('playersList') playersList: PlayersListComponent;

  public raids: Raid[] = [];
  public didTryGenerate: boolean = false;

  constructor(
    private dataService: DataService
  ) {}

  public saveData(): void {
    this.playersList.saveData();
  }

  public generateRosters(): void {
    this.didTryGenerate = true;
    this.raids = this.dataService.generateRosters(this.playersList.records);
  }

  public importData(): void {
    const importString = prompt('Enter import string');
    try {
      const records = JSON.parse(importString);
      this.playersList.records = records;
    } catch (error) {
      console.log('Failed import: invalid string');
    }
  }

  public exportData(): void {
    const str = JSON.stringify(this.playersList.records);
    navigator.clipboard.writeText(str);
    alert("Export string copied to clipboard");
  }
}
