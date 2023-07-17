import { Component } from '@angular/core';
import { ListRecord } from './interfaces/list-record';

const LocalStorageKey = 'SAVED_RECORDS_KEY';

@Component({
  selector: 'app-players-list',
  templateUrl: './players-list.component.html',
  styleUrls: ['./players-list.component.scss']
})
export class PlayersListComponent {
  public records: ListRecord[] = [];

  ngOnInit(): void {
    const storageData = localStorage.getItem(LocalStorageKey) as string;
    if (storageData?.length > 0) {
      this.records = JSON.parse(storageData);
      return;
    }

    // case if no data saved
    for(let i = 0; i < 40; i++) {
      this.records.push(new ListRecord())
    }
  }

  public saveData(): void {
    localStorage.setItem(LocalStorageKey, JSON.stringify(this.records));
  }
}
