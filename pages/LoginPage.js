const path = require('path');
const {clickWithHealing} = require('../self-healing/healingEngine');
class LoginPage {
  constructor(page) {
    this.page = page;

    this.contactUsUrl = 'https://www.webdriveruniversity.com/Contact-Us/contactus.html';
    this.alertsUrl = 'https://www.webdriveruniversity.com/Popup-Alerts/index.html';
    this.dropdownUrl = 'https://www.webdriveruniversity.com/Dropdown-Checkboxes-RadioButtons/index.html';
    this.uploadUrl = 'https://www.webdriveruniversity.com/File-Upload/index.html';

    this.firstName = page.getByPlaceholder('First Name');
    this.lastName = page.getByPlaceholder('Last Name');
    this.emailAddress = page.getByPlaceholder('Email Address');
    this.comments = page.getByPlaceholder('Comments');
    this.submitButton = "//input[@value='SUBMI']";
    this.successMessage = page.locator('//h1');
    this.errorMessage = page.getByText('fields are required');

    this.courseDropdown = page.locator("xpath=//select[@id='dropdowm-menu-1']");
    this.ideDropdown = page.locator("xpath=//select[@id='dropdowm-menu-2']");
    this.frontendDropdown = page.locator("xpath=//select[@id='dropdowm-menu-3']");
    this.yellowRadio = page.locator("xpath=//input[@value='yellow']");
    this.optionOne = page.locator("xpath=//input[@value='option-1']");
    this.optionTwo = page.locator("xpath=//input[@value='option-2']");
    this.cabbageRadio = page.locator("xpath=//input[@value='cabbage']");
    this.fruitSelect = page.locator("xpath=//*[@id='fruit-selects']");

    this.alertButton = page.locator("xpath=//*[@id='button1']");
    this.confirmButton = page.locator("xpath=//*[@id='button4']");
    this.confirmMessage = page.locator("//p[@id='confirm-alert-text']");
    this.modalButton = page.locator("xpath=//*[@id='button2']");
    this.modalHeading = page.getByRole('heading', { name: 'It’s that Easy!! Well I think' });
    this.modalText = page.getByText('We can inject and use');
    this.closeModalButton = page.getByRole('button', { name: 'Close' });

    this.fileUpload = page.locator("xpath=//input[@id='myFile']");
    this.uploadSubmitButton = page.locator("xpath=//input[@id='submit-button']");
  }

  async goToContactUs() {
    await this.page.goto(this.contactUsUrl);
  }

  async fillContactUsForm({ firstName, lastName, email, comments }) {
    await this.firstName.fill(firstName);
    await this.lastName.fill(lastName);
    await this.emailAddress.fill(email);
    await this.comments.fill(comments);
  }

  async submitContactUs() {
    return clickWithHealing(this.page, this.submitButton);
  }

  async goToDropdownPage() {
    await this.page.goto(this.dropdownUrl);
  }

  async selectCourse(course) {
    await this.courseDropdown.selectOption(course);
  }

  async selectIde(optionValue) {
    await this.ideDropdown.selectOption({ value: optionValue });
  }

  async selectFrontend(optionValue) {
    await this.frontendDropdown.selectOption({ value: optionValue });
  }

  async selectYellowRadio() {
    await this.yellowRadio.click();
  }

  async checkOptionOne() {
    await this.optionOne.check();
  }

  async checkOptionTwo() {
    await this.optionTwo.check();
  }

  async goToAlertsPage() {
    await this.page.goto(this.alertsUrl);
  }

  async clickAlertButton() {
    await this.alertButton.click();
  }

  async clickConfirmButton() {
    await this.confirmButton.click();
  }

  async clickModalButton() {
    await this.modalButton.click();
  }

  async closeModal() {
    await this.closeModalButton.click();
  }

  async goToUploadPage() {
    await this.page.goto(this.uploadUrl);
  }

  async uploadFile(relativeFilePath) {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    await this.fileUpload.setInputFiles(fullPath);
  }

  async submitUpload() {
    await this.uploadSubmitButton.click();
  }
}

module.exports = { LoginPage };
