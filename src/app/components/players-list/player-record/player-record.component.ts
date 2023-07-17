import { Component, Input } from '@angular/core';
import { ListRecord } from '../interfaces/list-record';
import { ClassName } from '../../../enums/class-name';
import { Classes } from '../../../constants/classes';

@Component({
  selector: 'app-player-record',
  templateUrl: './player-record.component.html',
  styleUrls: ['./player-record.component.scss']
})
export class PlayerRecordComponent {
  @Input() record!: ListRecord;
  public classOptions: any[] = [];
  public mainClassColor: string = '';
  public altClassColor: string = '';
  public mainSpecOptions: any[] = [];
  public altSpecOptions: any[] = [];

  ngOnInit() {
    this.classOptions = Object.keys(ClassName).map(cName => {
      const cl = Classes[cName];
      return {
        label: cName,
        value: cName,
        color: cl.color,
      }
    });
    this.classOptions.unshift({ label: '', value: null });

    if (this.record.mainClass) {
      this.mainSpecOptions = this.generateSpecOptions(this.record.mainClass);
      this.mainClassColor = Classes[this.record.mainClass].color;
    }

    if (this.record.altClass) {
      this.altSpecOptions = this.generateSpecOptions(this.record.altClass);
      this.altClassColor = Classes[this.record.altClass].color;
    }
  }

  private generateSpecOptions(className: string): any[] {
    const options = Classes[className].specs.map(spec => {
      return {
        label: spec.displayName,
        value: spec.name,
      }
    });

    options.unshift({ label: '', value: null });
    return options;
  }

  public get mainClass(): string {
    return this.record?.mainClass || '';
  }

  public set mainClass(value: string) {
    this.record.mainClass = value;
    this.record.mainSpec = undefined;
    this.record.offSpec = undefined;
    this.mainClassColor = Classes[value]?.color;

    if (value) {
      this.mainSpecOptions = this.generateSpecOptions(value);
    }
  }

  public get altClass(): string {
    return this.record?.altClass || '';
  }

  public set altClass(value: string) {
    this.record.altClass = value;
    this.record.altMainSpec = undefined;
    this.record.altOffSpec = undefined;
    this.altClassColor = Classes[value]?.color;

    if (value) {
      this.altSpecOptions = this.generateSpecOptions(value);
    }
  }

}
