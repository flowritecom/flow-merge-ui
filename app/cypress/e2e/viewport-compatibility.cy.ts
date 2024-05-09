/// <reference types="cypress" />
import models from "../fixtures/merges"

describe('the app', () => {
  beforeEach(() => {
    localStorage.setItem("llm-lab-hf-api-key", "asd");
    cy.intercept("/api/v1/merges", models)
    cy.visit('http://127.0.0.1:8000/#/')
  })

  it('asks to widen the screen on small screens', () => {
    cy.viewport(1023, 600)
    cy.get("[data-test=viewport-compatibility-popup]").should("be.visible")
    cy.get("[data-test=viewport-compatibility-popup] h3").should("have.text", "Widen your screen")
    cy.get("[data-test=viewport-compatibility-popup] p").should("have.contain", "Make your window larger or switch to a larger screen to start merging.")
  })

  it('doesnt display the popup on bigger screens', () => {
    cy.viewport(1025, 600)
    cy.get("[data-test=viewport-compatibility-popup]").should("not.exist")
  })
})
