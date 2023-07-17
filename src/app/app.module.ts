import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './components/main/main.component';
import { PlayersListComponent } from './components/players-list/players-list.component';
import { RaidVisualisationComponent } from './components/raid-visualisation/raid-visualisation.component';
import { PlayerRecordComponent } from './components/players-list/player-record/player-record.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { CharacterSpotComponent } from './components/raid-visualisation/character-spot/character-spot.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    PlayersListComponent,
    RaidVisualisationComponent,
    PlayerRecordComponent,
    CharacterSpotComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatCheckboxModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
