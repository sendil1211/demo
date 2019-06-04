import { Component, OnInit, Input, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GENERALSETTING_TYPES } from 'src/app/constants/generalsetting-types';
import { GeneralsettingService } from 'src/app/service/generalsetting.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-org-general-setting',
  templateUrl: './org-general-setting.component.html',
  styleUrls: ['./org-general-setting.component.scss']
})

@Injectable()
export class OrgGeneralSettingComponent implements OnInit {

  showCustomPane;
  submitted = false;
  orgId2;
  defaultOrgLanguage = 'English (United States)';
  sharedFolderVisibility;
  privateFolderVisibility;
  wcaNotificationReplies;
  customNotificationReplies;
  orgGeneralSettingPageLoad;
  loadingTitle = 'Loading Data...';
  @Input() form: FormGroup;
  orgLanguageList = [];
  vmtaList = [];
  errors: any;

  constructor(private generaldata: GeneralsettingService, private router: Router, private fb: FormBuilder,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.orgId2 = this.activatedRoute.snapshot.paramMap.get('orgId2');
    this.initForm();
    this.updatePageLoad(true);
    this.generaldata.getGeneralSettingData(this.orgId2).subscribe(response => {
      this.initializeFormValues(response);
    }, (err: HttpErrorResponse) => {
      this.updatePageLoad(false);
      console.log(err.message);
    });
  }

  initializeFormValues(response) {

    this.form.get('defaultOrganizationLanguage').setValue(response.defaultOrganizationLanguage);
    this.updateOrgLanguageList(response.defaultOrganizationLanguage);
    this.form.get('systemNotificationEmail').setValue(response.systemNotificationEmail);
    if (response.defaultFolderVisibility === 'Private') {
      this.sharedFolderVisibility = false;
      this.privateFolderVisibility = true;
    } else {
      this.sharedFolderVisibility = true;
      this.privateFolderVisibility = false;
    }

    if (response.notificationReplySentFrom === 'Silverpop') {
      this.wcaNotificationReplies = true;
      this.customNotificationReplies = false;
    } else {
      this.wcaNotificationReplies = false;
      this.customNotificationReplies = true;
      this.showCustomPane = true;
    }
    this.form.get('includeRecipientIP').setValue(response.includeRecipientIP);
    this.updateNotificationVmtaList(response.notificationVmtaNames, response.notificationVmtaId);
    this.form.get('notificationFromName').setValue(response.notificationFromName);
    this.form.get('notificationFromAddress').setValue(response.notificationFromAddress);
    this.form.get('notificationProductName').setValue(response.notificationProductName);
    this.form.get('notificationSignature').setValue(response.notificationSignature);
    this.form.get('notificationReplyToAddress').setValue(response.notificationReplyToAddress);
    this.form.get('defaultFolderVisibility').setValue(response.defaultFolderVisibility);
    this.form.get('notificationReplySentFrom').setValue(response.notificationReplySentFrom);

    this.updatePageLoad(false);
  }

  initForm() {
    this.createOrgLanguageList();
    this.createVmtaList();
    this.form = this.fb.group({
      userorganizationdefault: [''],
      defaultOrganizationLanguage: ['en_US'],
      systemNotificationEmail: ['', [Validators.
      pattern('^(?!.*\\.{2})[A-Za-z0-9\\-_.+!#$%&*/=?^{|}~]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}\\b$')]],
      notificationFromAddress: ['', [Validators.required,
      Validators.pattern('^(?!.*\\.{2})[A-Za-z0-9\\-_.+!#$%&*/=?^{|}~]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}\\b$')]],
      notificationFromName: ['', [Validators.required]],
      notificationProductName: ['', [Validators.required]],
      notificationSignature: ['', [Validators.required]],
      notificationReplyToAddress: ['', [Validators.required,
      Validators.pattern('^(?!.*\\.{2})[A-Za-z0-9\\-_.+!#$%&*/=?^{|}~]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}\\b$')]],
      defaultFolderVisibility: ['Shared'],
      notificationReplySentFrom: ['Silverpop'],
      includeRecipientIP: [],
      notificationVmtaNames: []
    });
  }

  get f() {
    return this.form.controls;
  }

  navigateOrgSettingHome() {
    this.router.navigate(['orgsetting']);
  }

  generalSettingOnSubmit() {

    if (this.showCustomPane) {
      if (this.form.invalid) {
        this.validateForm();
        return;
      }
    } else {
      this.clearValidators();
      if (this.form.invalid) {
        this.validateForm();
        return;
      }
    }

    this.submitted = true;
    const generalSetting = {
      defaultFolderVisibility: this.form.get('defaultFolderVisibility').value,
      defaultOrganizationLanguage: this.form.get('defaultOrganizationLanguage').value.value,
      includeRecipientIP: this.form.get('includeRecipientIP').value,
      systemNotificationEmail: this.form.get('systemNotificationEmail').value,
      notificationReplySentFrom: this.form.get('notificationReplySentFrom').value,
      userorganizationdefault: this.form.get('userorganizationdefault').value,
      notificationFromName: this.form.get('notificationFromName').value,
      notificationFromAddress: this.form.get('notificationFromAddress').value,
      notificationProductName: this.form.get('notificationProductName').value,
      notificationSignature: this.form.get('notificationSignature').value,
      notificationReplyToAddress: this.form.get('notificationReplyToAddress').value,
      notificationVmtaId: this.form.get('notificationVmtaNames').value.value
    };

    this.updatePageLoad(true);
    this.generaldata.updateGeneralSetting(generalSetting, this.orgId2).subscribe(data => {
      this.updatePageLoad(false);
      this.navigateOrgSettingHome();
    });
  }

  onFolderVisibilityChange(event) {
    console.log(event.value);
    console.log(this.defaultOrgLanguage);
  }

  onIncludeIpOfContactUserChange(event) {
    console.log(event.checked);
  }

  onChangeNotificationReplies(event) {
    if (event.value === 'Custom') {
      this.showCustomPane = true;
    } else {
      this.showCustomPane = false;
    }
  }

  updatePageLoad(loadFlag: boolean) {
    this.orgGeneralSettingPageLoad = loadFlag;
  }

  createOrgLanguageList() {

    this.orgLanguageList.push({
      value: 'en_US',
      content: 'English (United States)',
      selected: true
    });
    this.orgLanguageList.push({
      value: 'en_AU',
      content: 'English (Australia)',
    });
    this.orgLanguageList.push({
      value: 'en_GB',
      content: 'English (United Kingdom)'
    });
  }

  createVmtaList() {

    this.vmtaList.push({
      value: '0',
      content: 'User Organization Default',
      selected: true
    });

  }

  updateOrgLanguageList(selectedLanguage) {

    const languageList = [];
    this.orgLanguageList.forEach(orgLanguage => {
      if (orgLanguage.value === selectedLanguage) {
        languageList.push({
          value: orgLanguage.value,
          content: orgLanguage.content,
          selected: true
        });
      } else {
        languageList.push({
          value: orgLanguage.value,
          content: orgLanguage.content,
          selected: false
        });
      }
    });
    this.orgLanguageList = languageList;
  }

  updateNotificationVmtaList(backendVmtaList, selectedVmtaId) {

    const tempVmtaList = [];

    tempVmtaList.push({
      value: '0',
      content: 'User Organization Default',
      selected: selectedVmtaId == null || selectedVmtaId === 0 ? true : false
    });

    if (backendVmtaList != null && backendVmtaList.length > 0) {
      backendVmtaList.forEach(vmta => {
        tempVmtaList.push({
          value: vmta.vmtaId,
          content: vmta.friendlyName,
          // content: vmta.vmtaName,
          selected: vmta.vmtaId === selectedVmtaId ? true : false
        });
      });
    }
    this.vmtaList = tempVmtaList;
  }

  clearValidators() {

    this.form.get('notificationFromName').clearValidators();
    this.form.get('notificationFromAddress').clearValidators();
    this.form.get('notificationProductName').clearValidators();
    this.form.get('notificationSignature').clearValidators();
    this.form.get('notificationReplyToAddress').clearValidators();
    this.form.get('notificationFromName').updateValueAndValidity();
    this.form.get('notificationFromAddress').updateValueAndValidity();
    this.form.get('notificationProductName').updateValueAndValidity();
    this.form.get('notificationSignature').updateValueAndValidity();
    this.form.get('notificationReplyToAddress').updateValueAndValidity();

  }

  validateForm() {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control.markAsTouched({ onlySelf: true });
    });
  }

}
