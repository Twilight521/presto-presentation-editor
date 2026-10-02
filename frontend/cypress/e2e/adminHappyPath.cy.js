describe("flow happy path", () => {
  it("register, create a presentation, add slides, switch slides, delete presentation, logout and log back in", () => {
    const email = `test${Date.now()}@example.com`;
    const password = "123456";
    const name = "username";
    const pName = "Test presentation";
    const pDescription = "This is presentation description";
    const newTitle = "new title";

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

    // edit title
    cy.contains(pName).click();
    cy.url().should("include", "/presentation/edit");
    cy.contains(/title/i).click();
    cy.get('input[name="title"]').should("be.visible").clear().type(newTitle);
    cy.get('button[type="submit"]').click();
    cy.contains(/back/i).click();
    cy.url().should("include", "/dashboard");
    cy.contains(newTitle).should("exist");

    // edit thumbnail
    cy.contains(newTitle).click();
    cy.contains(/thumbnail/i).click();
    cy.get('input[type="file"]').selectFile("cypress/fixtures/thumbnail.png");
    cy.get('button[type="submit"]').click();
    cy.contains(/back/i).click();
    cy.get("img").should("have.attr", "src").and("not.be.empty");

    // add slides
    cy.contains(newTitle).click();
    cy.url().should("include", "/presentation/edit");
    cy.url().should("include", "/1");
    cy.contains(/page 1/i).should("exist");
    cy.contains(/add/i).click();
    cy.contains(/page 2/i).should("exist");
    cy.contains(/add/i).click();
    cy.contains(/page 3/i).should("exist");
    // previous page ←
    cy.contains(/←/).click();
    cy.contains(/page 2/i).should("exist");
    cy.contains(/←/).click();
    cy.contains(/page 1/i).should("exist");
    // next page →
    cy.contains(/→/).click();
    cy.contains(/page 2/i).should("exist");
    cy.contains(/→/).click();
    cy.contains(/page 3/i).should("exist");

    // delete presentation
    cy.contains(/delete presentation/i).click();
    cy.contains(/are you sure/i).should("be.visible");
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
    cy.contains(newTitle).should("not.exist");

    // log out successfully
    cy.contains(/logout/i).click();
    cy.url().should("eq", "http://localhost:3000/");

    // log back in successfully
    cy.contains(/login/i).click();
    cy.get('input[name="email"]').type(email);
    cy.get('input[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should("include", "/dashboard");
  });
});
