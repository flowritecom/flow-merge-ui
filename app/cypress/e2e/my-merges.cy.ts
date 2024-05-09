/// <reference types="cypress" />
import merges from "../fixtures/merges";

describe('my merges page', () => {
  beforeEach(() => {
    cy.viewport(1025, 600)
    localStorage.setItem("llm-lab-hf-api-key", "asd");
    cy.intercept("/api/v1/merges", merges)
    cy.visit('http://127.0.0.1:8000/#/')
  })

  it('selects merge on click, displays details', () => {
    const merge_config = JSON.parse(merges[0].merge_config)
    cy.get(".merge-list-element").first().click()
    cy.get("[data-test=sidebar] h3").should("have.text", merges[0].merge_name)
    cy.get("[data-test=sidebar]").should("contain.text", merge_config.method)
    cy.get("[data-test=sidebar]").should("contain.text", merge_config.base_model)
    cy.get("[data-test=sidebar]").should("contain.text", merge_config.method_global_parameters.top_k)
    cy.get("[data-test=sidebar]").should("contain.text", merge_config.method_global_parameters.scaling_coefficient)
  })

})
