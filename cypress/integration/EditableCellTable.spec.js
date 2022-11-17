describe("EditableCellTable.spec", () => {
  it(`should be able to edit text inputs correctly`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(
      `[data-tip="Must include the letter 'a'"] [data-test="tgCell_name"]:first`
    ).should("contain", "tom88"); //should lowercase "Tom88"
    cy.get(`[data-test="tgCell_name"]:first`).click();
    cy.get(".cellDragHandle").should("exist");
    cy.get(`[data-test="tgCell_name"]:first`).dblclick();
    cy.get(".cellDragHandle").should("not.exist");
    cy.focused().type("_zonk{enter}");
    cy.get(
      `[data-tip="Must include the letter 'a'"] [data-test="tgCell_name"]:first`
    ).should("contain", "tom88_zonk");
    cy.get(".cellDragHandle").should("exist");
  });

  it(`should be able to edit dropdown inputs correctly`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(
      `[data-tip="Please choose one of the accepted values"] [data-test="tgCell_type"]:first`
    ).should("contain", "fail"); //should lowercase "Tom"
    cy.get(`[data-test="tgCell_type"]:first`).dblclick();
    cy.focused().type("old{enter}");
    cy.get(`[data-test="tgCell_type"]:first`).should("contain", "old");
  });
  it(`smart increment should work`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`.rt-td:contains(nancy110)`).click();
    cy.dragBetween(`.cellDragHandle`, `button:contains(Add 10 Rows)`);
    cy.contains("nancy137");
  });
  it(`smart increment + multi column drag should work`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`.rt-td:contains(nancy110)`).click();
    cy.get(`.rt-tr:contains(nancy110) .rt-td:contains(too old)`).click({
      shiftKey: true
    });

    cy.dragBetween(`.cellDragHandle`, `button:contains(Add 10 Rows)`);
    cy.get(`.rt-tr:contains(nancy137):contains(too old)`);
  });

  it(`drag should be repeating down`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    const makeSureInitialRowsAreCorrect = () => {
      cy.get(".rt-tr-group")
        .eq(5)
        .should("contain", "tom93");
      cy.get(".rt-tr-group")
        .eq(6)
        .should("contain", "tom94");
    };
    makeSureInitialRowsAreCorrect();
    cy.get(`.rt-td:contains(tom93)`).click();
    cy.get(`.rt-td:contains(tom94)`).modclick("{meta}");
    cy.dragBetween(`.cellDragHandle`, `.rt-td:contains(tom99)`);
    makeSureInitialRowsAreCorrect();
    const overwrittenRows = [7, 8, 9, 10, 11];
    overwrittenRows.forEach(index => {
      cy.get(".rt-tr-group")
        .eq(index)
        .should("contain", index % 2 === 0 ? "tom94" : "tom93");
    });
  });

  it(`drag should be repeating up`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    const makeSureInitialRowsAreCorrect = () => {
      cy.get(".rt-tr-group")
        .eq(15)
        .should("contain", "tom103");
      cy.get(".rt-tr-group")
        .eq(16)
        .should("contain", "tom104");
      cy.get(".rt-tr-group")
        .eq(17)
        .should("contain", "tom105");
    };
    cy.get(`.rt-td:contains(tom103)`).click();
    cy.get(`.rt-td:contains(tom104)`).modclick("{meta}");
    cy.get(`.rt-td:contains(tom105)`).modclick("{meta}");
    cy.dragBetween(`.cellDragHandle`, `.rt-td:contains(tom90)`);
    makeSureInitialRowsAreCorrect();
    const overwrittenRows = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    const vals = ["tom105", "tom103", "tom104"];
    overwrittenRows.forEach((rowIndex, i) => {
      cy.get(".rt-tr-group")
        .eq(rowIndex)
        .should("contain", vals[i % 3]);
    });
  });

  it(`should be able to edit numeric inputs correctly`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(
      `[data-tip="Must be a number"] [data-test="tgCell_howMany"]:first`
    ).should("contain", "NaN"); //should lowercase "Tom"
    cy.get(`[data-test="tgCell_howMany"]:first`).dblclick();
    cy.focused().type("11{enter}");
    cy.get(`[data-test="tgCell_howMany"]:first`).should("contain", "12"); //should have 12 post format
    cy.get(
      `[data-tip="Must be a number"] [data-test="tgCell_howMany"]:first`
    ).should("not.exist");
  });
  it(`undo/redo should work`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`.rt-td:contains(tom88)`).dblclick();
    cy.focused().type("{selectall}tasty55{enter}");
    cy.get(`.rt-td:contains(tasty55)`).dblclick();
    cy.focused().type("{selectall}delishhh{enter}");
    cy.get(`.rt-td:contains(delishhh)`);
    cy.focused().type("{meta}z");
    cy.focused().type("{meta}z");
    cy.get(`.rt-td:contains(tom88)`);
    cy.focused().type("{meta}{shift}z");
    cy.focused().type("{meta}{shift}z");
    cy.get(`.rt-td:contains(delishhh)`);
  });
  it(`deleting should work, default val should get reapplied`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`.rt-td:contains(tom88)`).click();
    cy.focused().type("{backspace}");
    cy.get(`.rt-td:contains(tom88)`).should("not.exist");
    cy.get(`.rt-td:contains(WAY TOO HOT)`).click();
    cy.focused().type("{backspace}");
    cy.get(`.rt-td:contains(WAY TOO HOT)`).should("not.exist");
    //the default value should not repopulate
    cy.get(`[data-test="tgCell_weather"]:first:contains(sunny)`).should(
      "not.exist"
    );
  });
  it(`adding 10 rows should work`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`[data-index="59"]`).should("not.exist");
    cy.contains(`Add 10 Rows`).click();
    cy.get(`[data-index="59"]`).should("exist");
    //the last error should now be in the type column
    cy.get(`.rt-td.hasCellError:last [data-test="tgCell_type"]`).should(
      "exist"
    );
    //the last row should be auto populate with default values
    cy.get(`[data-test="tgCell_weather"]:last`).contains("sunny");
  });
  it(`single row delete should work`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`.rt-td:contains(tom88)`).rightclick();
    cy.contains("Remove Row").click();
    cy.get(`.rt-td:contains(tom88)`).should("not.exist");
  });
  it(`multi row delete should work`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`.rt-td:contains(tom88)`).click();
    cy.get(`[data-index="6"]`).click({ shiftKey: true });
    cy.get(`[data-index="6"]`).rightclick();
    cy.get(`[data-index="43"]`).should("exist");
    cy.contains("Remove Rows").click();
    cy.get(`[data-index="43"]`).should("not.exist"); //6 rows should be deleted!
    cy.get(`.rt-td:contains(tom88)`).should("not.exist");
  });
  it(`paste should overflow and create new rows`, () => {
    cy.visit("#/DataTable/EditableCellTable");
    cy.get(`[data-test="tgCell_name"]:last`).click();
    cy.get(`[data-index="52"]`).should("not.exist");
    cy.focused().paste(`hettie mclaughlin	new	cloudy	6	True
laura stevens	new	HOT	6	Yes
lucas jensen	old	rainy	4	false
todd ross	old	snowy	4	no`);
    cy.get(`[data-test="tgCell_isProtein"]:last[data-copy-text="false"]`);
    cy.get(`[data-test="tgCell_weather"]:last`)
      .closest(`.hasCellError`)
      .should("exist");
    cy.get(`[data-index="52"]`).should("exist");
  });
});
