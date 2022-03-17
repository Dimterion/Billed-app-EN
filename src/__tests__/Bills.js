import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage"

describe("Given I am connected as an employee", () => {
  // Tests for checking page loading and error message.
  describe("Given the page is loading", () => {
    test("Then page should be rendered", () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getByText("Loading...")).toBeTruthy()
    })
  })
  describe("Given an error occurs", () => {
    test("Then error page should be rendered", () => {
      const html = BillsUI({ error: "Error. Page is not loading." })
      document.body.innerHTML = html
      expect(screen.getByText("Erreur")).toBeTruthy()
    })
  })
  // ^^^^^
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
  })
})