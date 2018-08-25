import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientComponent } from './client/client.component';
import { ValuesPipe } from './values.pipe';
import { ShowHideComponent } from './core/show-hide/show-hide.component';
import { NetworkComponent } from './client/components/network/network.component';
import { CpuComponent } from './client/components/cpu/cpu.component';
import { MemoryComponent } from './client/components/memory/memory.component';
import { DiskComponent } from './client/components/disk/disk.component';

@NgModule({
  declarations: [
    AppComponent,
    ClientsComponent,
    ClientComponent,
    ValuesPipe,
    ShowHideComponent,
    NetworkComponent,
    CpuComponent,
    MemoryComponent,
    DiskComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
