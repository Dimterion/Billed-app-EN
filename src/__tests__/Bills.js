import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"

describe("Given I am connected as an employee", () => {
  // Tests for checking page loading and error message.
  describe("When the page is loading", () => {
    test("Then page should be rendered", () => {
      const html = BillsUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getByText("Loading...")).toBeTruthy()
    })
  })
  describe("When an error occurs", () => {
    test("Then error page should be rendered", () => {
      const html = BillsUI({ error: "Error. Page is not loading." })
      document.body.innerHTML = html
      expect(screen.getByText("Erreur")).toBeTruthy()
    })
  })
  // ^^^^^
  describe("When I am on Bills Page", () => {
    // onNavigate function and defineProperty before each of the following tests.
    const pathname = ROUTES_PATH["Bills"]
    let onNavigate;
    beforeEach(() => {
      onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      Object.defineProperty(window, "location", { value: { hash: pathname }})
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
    })
    // ^^^^^
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
    // Test for the click event for the "New fee" button.
    describe(`When I click on the "New fee" button`, () => {
      test("Then new form should be opened", () => {
        const html = BillsUI({ data: [] })
        document.body.innerHTML = html
        const allBills = new Bills({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        })
        const handleClickNewBill = jest.fn(allBills.handleClickNewBill)
        const btnBill = screen.getByTestId("btn-new-bill")
        fireEvent.click(btnBill)
        expect(screen.getByText("Send a fee")).toBeTruthy()
      })
    })
    // ^^^^^
  })
})