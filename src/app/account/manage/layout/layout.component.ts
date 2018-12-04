import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { AuthenticationScheme } from '../models/authentication-scheme';

@Component({
  selector: 'app-account-manage-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  authenticationSchemes: Array<AuthenticationScheme>;

  constructor(
    private readonly titleService: Title,
    private readonly route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.titleService.setTitle('Clarity: Account');
    this.authenticationSchemes = this.route.snapshot.data['authenticationSchemes'] as Array<AuthenticationScheme>;
  }
}
