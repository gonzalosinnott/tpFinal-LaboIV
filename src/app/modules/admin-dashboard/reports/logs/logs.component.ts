import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { SpinnerService } from 'src/app/services/spinner.service';
import * as XLSX from 'xlsx/xlsx.mjs';

@Component({
  selector: 'app-logs',
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.css']
})
export class LogsComponent implements OnInit {

  logs: any;
  constructor(public authService: AuthService,
              private firestoreService: FirestoreService,
              private toastr: ToastrService,
              private spinnerService: SpinnerService,) { }

  ngOnInit(): void {
    this.spinnerService.show();
    this.firestoreService.getLogs()
    .then((logs: any) => {
      this.logs = logs;
      this.spinnerService.hide();
    })
    .catch((error) => {
      this.toastr.error(error.message);
      this.spinnerService.hide();
    })
  }

  downloadData() {
    // Acquire Data (reference to the HTML table)
    var table_elt = document.getElementById("logs-table");

    // Extract Data (create a workbook object from the table)
    var workbook = XLSX.utils.table_to_book(table_elt);

    // Process Data (add a new row)
    var ws = workbook.Sheets["Sheet1"];
    XLSX.utils.sheet_add_aoa(ws, [["Created "+new Date().toISOString()]], {origin:-1});

    // Package and Release Data (`writeFile` tries to write and save an XLSB file)
    XLSX.writeFile(workbook, "logs-usuarios.xlsx");
  }
}
