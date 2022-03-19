import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import BillsUI from "../views/BillsUI.js"
import firebase from "../__mocks__/firebase"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { ROUTES } from "../constants/routes";

describe("Given I am connected as an employee", () => {
  // Test for checking that the file is added to the bill.
  describe("When I am on NewBill Page, and the receipt is added", () => {
    test("Then the receipt should appear in the input form", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const firestore = null
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      const inputFile = screen.getByTestId("file")
      inputFile.addEventListener("change", handleChangeFile)
      fireEvent.change(inputFile, {
        target: {
          files: [new File(["image.png"], "image.png", { type: "image/png" })]
        }
      })
      expect(handleChangeFile).toHaveBeenCalled()
      expect(inputFile.files[0].name).toBe("image.png")
    })
  })
  // ^^^^^
  // Test for checking the file format.
  describe("When the file format is not correct", () => {
    test("Then a new bill shouldn't be sent", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee"}))
      const firestore = null
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.fileName = "invalid"
      const submitBtn = screen.getByTestId("form-new-bill")
      submitBtn.addEventListener("submit", handleSubmit)
      fireEvent.submit(submitBtn)
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getAllByText("My fees")).toBeTruthy()
    })
  })
  // ^^^^^
  // Test for checking that the new bill is sent once the form is submitted.
  describe("When the form is submitted", () => {
    test("Then a new bill should be sent", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const firestore = null
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      const submitBtn = screen.getByTestId("form-new-bill")
      submitBtn.addEventListener("submit", handleSubmit)
      fireEvent.submit(submitBtn)
      expect(handleSubmit).toHaveBeenCalled()
    })
  })
  // ^^^^^
})
// Post NewBill integration test.
describe("Given I am a user connected as an Employee", () => {
  describe("When I create a new bill", () => {
    test("fetches new bill to mock API Post", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches new bill from an API and fails with 404 message error", async () => {
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