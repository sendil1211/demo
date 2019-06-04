import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {OrgGeneralSettingComponent} from './org-general-setting.component';
import {NgRedux} from '@angular-redux/store';
import {StartupService} from 'src/app/service/startup.service';
import {ConfigurationService} from 'src/app/service/configuration.service';
import {GeneralsettingService} from 'src/app/service/generalsetting.service';
import {HttpClientModule} from '@angular/common/http';
import {
  RadioModule,
  BreadcrumbModule,
  SelectModule,
  Label,
  CheckboxModule,
  InputModule,
  LoadingModule, DropdownModule
} from 'carbon-components-angular';
import {ReactiveFormsModule, FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';


describe('GeneralSettingsComponent', () => {
  let component: OrgGeneralSettingComponent;
  let fixture: ComponentFixture<OrgGeneralSettingComponent>;
  const notificationFromAddressEmail = 'Formaddress@ibm.com';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrgGeneralSettingComponent],
      imports: [
        RadioModule,
        FormsModule,
        SelectModule,
        CheckboxModule,
        InputModule,
        LoadingModule,
        ReactiveFormsModule,
        BreadcrumbModule,
        HttpClientModule,
        RouterTestingModule,
        DropdownModule
      ],
      providers: [NgRedux, StartupService, ConfigurationService, GeneralsettingService],
    })
      .compileComponents();

    fixture = TestBed.createComponent(OrgGeneralSettingComponent);

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrgGeneralSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it(' should invalidate general setting org  when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it(' should validate system notification email field ', () => {
    let errors = {};
    const notificaitonFromaddressemail = component.form.controls['notificationFromAddress'];
    expect(notificaitonFromaddressemail.valid).toBeFalsy();

    errors = notificaitonFromaddressemail.errors || {};
    expect(errors['required']).toBeTruthy();

    notificaitonFromaddressemail.setValue('notificaitonfromAddressEmail');
    errors = notificaitonFromaddressemail.errors || {};
    expect(errors['required']).toBeFalsy();

    notificaitonFromaddressemail.setValue(notificaitonFromaddressemail);
    errors = notificaitonFromaddressemail.errors || {};
    expect(errors['required']).toBeFalsy();

  });


  it('submitting a general setting org calls for generasettingservices ', () => {
    expect(component.form.valid).toBeFalsy();
    component.form.controls['notificationFromAddress'].setValue(notificationFromAddressEmail);

  });

  it('should change value of showCustomPane to true if variable value is Custom', () => {

    component.onChangeNotificationReplies({value: 'Custom'});
    expect(component.showCustomPane).toBeTruthy();

  });

  it('should change value of showCustomPane to false if variable value is not Custom', () => {

    component.onChangeNotificationReplies({value: 'Silverpop'});
    expect(component.showCustomPane).toBeFalsy();

  });

});
