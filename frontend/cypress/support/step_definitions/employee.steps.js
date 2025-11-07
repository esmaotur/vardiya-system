import { Given, When, Then } from "@badeball/cypress-cucumber-preprocessor";

// 🌐 API URL'i
const API_URL = "http://localhost:3001";

Given("kullanıcı anasayfayı ziyaret eder", () => {
  cy.visit("/");
  cy.wait(1000); // 1 saniye bekler
});

When("kullanıcı yeni bir çalışan ekler", () => {
  cy.get('input[placeholder="Ad Soyad"]').type("Mimi1");
  cy.wait(1000); // yazma sonrası kısa bekleme
  cy.get('input[placeholder="E-posta"]').type("mimi1@gmail.com");
  cy.wait(1000);
  cy.get('input[placeholder="Rol"]').type("Yazılım Mühendisi");
  cy.wait(1000);
  cy.get('button[type="submit"]').click();
  cy.wait(1500); // form gönderildikten sonra 1.5 saniye bekle
});

Then("başarılı bir bildirim görmeli", () => {
  cy.on("window:alert", (txt) => {
    expect(txt).to.include("Yeni çalışan eklendi");
  });
  cy.wait(1000);
});

Then("yeni çalışan listede görünmeli", () => {
  cy.wait(1000); // liste güncellenmesi için bekle
  cy.contains("Mimi1", { timeout: 10000 }).should("be.visible");
});

