import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/_services/dataservice';
import { Chart, registerables } from 'chart.js'
Chart.register(...registerables)

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public profile_data: any = {};
  public showLoader: boolean = true;

  constructor(
    private _dataService : DataService
  ) { }

  ngOnInit(): void {

    this.getProfileCompleteData()
  }

  getProfileCompleteData() {
    this._dataService.getAll({ url: 'chef/account_progress', isLoader: true })
      .subscribe(res => {
        this.profile_data = res;
        this.showLoader = false;
        console.log(JSON.stringify(this.profile_data?.graph_data.series));
        this.data = this.profile_data?.graph_data.series;
        this.salesDataDate = this.profile_data?.graph_data.sales_for;
        this.labels = this.data.map(item => item.name.toString());
        this.salesData = this.data.map(item => item.value);
        this.chart = new Chart('myCanvasId', {
          type: 'line',
          data: {
            labels: this.labels,
            datasets: [
              {
                label: 'Sales (£)',
                data: this.salesData,
                backgroundColor: '#6E41C8',
              }
            ]
          },
          options: {
            scales: {
              yAxes: {
                title: {
                    display: true,
                    text: "Sales (£)",
                    font: {
                        size: 15
                    }
                },
                ticks: {
                    precision: 0
                }
            },
            xAxes: {
                title: {
                    display: true,
                    text: "Hour of day",
                    font: {
                        size: 15
                    }
                }
            }
            }
          }
        });
        this.show_main_content = "visible";
      })
  }

  public show_main_content: string = "hidden";  

  public data: any;
  public chart: Chart;
  public labels: string[];
  public salesData: number[];
  public salesDataDate: any;

}
