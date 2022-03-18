import { screen, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage"
import { ROUTES, ROUTES_PATH } from "../constants/routes.js"
import firebase from "../__mocks__/firebase"
import Firestore from "../app/Firestore"
import Router from "../app/Router"

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
    // Test for checking that bill icon is highlighted.
    test("Then bill icon in vertical layout should be highlighted", () => {
      Firestore.bills = () => ({ bills, get: jest.fn().mockResolvedValue() })
      document.body.innerHTML = `<div id="root"></div>`
      Router()
      expect(screen.getByTestId("icon-window").classList.contains("active-icon")).toBe(true)
    })
    // ^^^^^
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
        const testBills = new Bills({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        })
        const handleClickNewBill = jest.fn(testBills.handleClickNewBill)
        const btnBill = screen.getByTestId("btn-new-bill")
        fireEvent.click(btnBill)
        expect(screen.getByText("Send a fee")).toBeTruthy()
      })
    })
    // ^^^^^
    // Tests for the click event on the eye icon and modal.
    describe("When I click on the eye icon", () => {
      test("Then a modal should be displayed", () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        const testBills = new Bills({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        })
        testBills.handleClickIconEye = jest.fn()
        screen.getAllByTestId("icon-eye")[0].click()
        expect(testBills.handleClickIconEye).toBeCalled()
      })
      test("Then a receipt image should be shown", () => {
        const html = BillsUI({ data: bills })
        document.body.innerHTML = html
        const testBills = new Bills({
          document,
          onNavigate,
          firestore: null,
          localStorage: window.localStorage,
        })
        const eyeIcon = screen.getAllByTestId("icon-eye")[0]
        $.fn.modal = jest.fn()
        testBills.handleClickIconEye(eyeIcon)
        expect($.fn.modal).toBeCalled()
        expect(document.querySelector(".modal")).toBeTruthy()
      })
    })
    // ^^^^^
  })
})
// GET Bills integration test.
describe("Given I am a user connected as an Employee", () => {
  describe("When I navigate to Bills page", () => {
    test("fetches bills from mock API GET", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
// ^^^^^