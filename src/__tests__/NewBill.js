import { fireEvent, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import BillsUI from "../views/BillsUI.js";
import firebase from "../__mocks__/firebase";
import { localStorageMock } from "../__mocks__/localStorage.js";
import { ROUTES } from "../constants/routes";
import firestore from "../__mocks__/firestore.js";
import userEvent from "@testing-library/user-event";
import { matchers } from "@testing-library/jest-dom";

describe("Given I am connected as an employee", () => {
  // Test for checking that the form is correctly sent.
  describe("When the form is submitted", () => {
    test("Then the bill should be sent", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })
      const expenseType = screen.getByTestId("expense-type")
      userEvent.selectOptions(expenseType, [ screen.getByText("Travels") ])
      const date = screen.getByTestId("datepicker")
      userEvent.type(date, "2022-03-19")
      const amount = screen.getByTestId("amount")
      userEvent.type(amount, "1")
      const pct = screen.getByTestId("pct")
      userEvent.type(pct, "2")
      const fileUpload = screen.getByTestId("file")
      const file = new File(["test"], "test.png", { type: "image/png" })
      userEvent.upload(fileUpload, file)
      expect(fileUpload.files).toHaveLength(1)
      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.fileName = "test.jpg"
      const newBillForm = screen.getByTestId("form-new-bill")
      newBillForm.addEventListener("submit", handleSubmit)
      fireEvent.submit(newBillForm)
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
    // ^^^^^

    // Test for checking that bills page opens after submitting the bill.
    test("Then bills page should be opened", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore: null,
        localStorage: window.localStorage
      })
      const handleSubmit = jest.fn(newBill.handleSubmit)
      newBill.fileName = "test.jpg"
      const newBillForm = screen.getByTestId("form-new-bill")
      newBillForm.addEventListener("submit", handleSubmit)
      fireEvent.submit(newBillForm)
      expect(handleSubmit).toHaveBeenCalled()
      expect(screen.getAllByText("My fees")).toBeTruthy()
    });
    // ^^^^^
  });
  // Test for checking that the file format is supported.
  describe("When the file format is not supported", () => {
    test("Then the send button is disabled", () => {
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      Object.defineProperty(window, "localStorage", { value: localStorageMock })
      window.localStorage.setItem("user", JSON.stringify({ type: "Employee" }))
      const html = NewBillUI()
      document.body.innerHTML = html
      const newBill = new NewBill({
        document,
        onNavigate,
        firestore,
        localStorage: window.localStorage
      })
      const file = screen.getByTestId("file")
      const handleChangeFile = jest.fn(newBill.handleChangeFile)
      file.addEventListener("change", handleChangeFile)
      fireEvent.change(file, { 
        target: {
          files: [new File([""], "test.txt", {
            type: "text/txt"
          })],
        }
      })
      const sendButton = screen.getByTestId('btn-send-bill')
      expect(sendButton).toBeDisabled()
      expect(handleChangeFile).toHaveBeenCalled()
    });
  });
  // ^^^^^
});

// Post NewBill integration test.
describe("Given I am a user connected as an Employee", () => {
  describe("When I create a new bill", () => {
    test("fetches new bill to mock API Post", async () => {
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    });

    test("fetches new bill from an API and fails with 404 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    });
    
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    });
  });
});
// ^^^^^