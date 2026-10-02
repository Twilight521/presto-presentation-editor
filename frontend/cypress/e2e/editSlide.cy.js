describe("edit text image happy path", () => {
  it("register, create a presentation, add text, edit text, add image, preview", () => {
    const email = `test${Date.now()}@example.com`;
    const password = "123456";
    const name = "username";
    const pName = "Test presentation";
    const pDescription = "This is presentation description";
    const testText = "hello test textbox";
    const updatedText = "updated text";

    // register
    cy.visit("http://localhost:3000");
    cy.contains(/register/i).click();
    cy.get("input[name=name]").type(name);
    cy.get("input[name=email]").type(email);
    cy.get("input[name=password]").type(password);
    cy.get("input[name=confirmPassword]").type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");

    // create a new presentation
    cy.contains(/new presentation/i).click();
    cy.get('input[name="pName"]').type(pName);
    cy.get('input[name="pDescription"]').type(pDescription);
    cy.get("form")
      .contains(/^create$/i)
      .click();
    cy.contains(pName).should("exist");
    cy.contains(pDescription).should("exist");

    cy.contains(pName).click();
    cy.url().should("include", "/presentation/edit");

    cy.contains(/text/i).click();
    cy.get("input[name=width]").type("30");
    cy.get("input[name=height]").type("30");
    cy.get("textarea").type(testText);
    cy.get("input[name=fontSize]").type("1.6");
    cy.get('button[type="submit"]').click();
    cy.contains(testText).should("exist");

    // edit text
    cy.contains(testText).dblclick();
    cy.get("textarea").clear().type(updatedText);
    cy.get('button[type="submit"]').click();
    cy.contains(updatedText).should("exist");
    cy.contains(testText).should("not.exist");

    // add image
    cy.contains(/image/i).click();
    cy.get("input[name=width]").type("30");
    cy.get("input[name=height]").type("30");
    cy.get('input[type="file"]').selectFile("cypress/fixtures/thumbnail.png");
    cy.get("input[name=description]").type("test description");
    cy.get('button[type="submit"]').click();
    cy.get("img").should("exist");

    // check preview
    cy.url().then((url) => {
      const previewUrl = url.replace("/edit/", "/preview/");
      cy.visit(previewUrl);
    });
    cy.url().should("include", "/presentation/preview");
    cy.contains(updatedText).should("exist");
    cy.contains(testText).should("not.exist");
    cy.get("img").should("exist");
    cy.get('img[alt="test description"]').should("exist");
  });
});
