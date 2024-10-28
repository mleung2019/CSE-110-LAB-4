import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";

test("Create an Expense", () => {
  render(<App />);

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "100" } });
  fireEvent.click(createExpenseButton);

  const newExpenseName = screen.getByText("Testing");
  const newExpenseCost = screen.getByText("$100");
  const remaining = screen.getByText("Remaining: $1400");
  const spent = screen.getByText("Spent so far: $100");

  expect(newExpenseName).toBeInTheDocument();
  expect(newExpenseCost).toBeInTheDocument();
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});

test("Delete an Expense", () => {
  render(<App />);

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "100" } });
  fireEvent.click(createExpenseButton);

  const deleteExpenseButton = screen.getByText("x");
  const newExpenseName = screen.getByText("Testing");
  const newExpenseCost = screen.getByText("$100");
  fireEvent.click(deleteExpenseButton);

  expect(newExpenseName).not.toBeInTheDocument();
  expect(newExpenseCost).not.toBeInTheDocument();

  // WRONG TEST: Should be "Remaining: $1500"
  const remaining = screen.getByText("Remaining: $1300");
  const spent = screen.getByText("Spent so far: $0");
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});

test("Budget Balance Verification", () => {
  render(<App />);

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  // Create $100 and $400 Expenses
  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "100" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing2" } });
  fireEvent.change(createExpenseCost, { target: { value: "400" } });
  fireEvent.click(createExpenseButton);

  // Satistfies Budget = Remaining Balance + Total Expenditure, since
  // $1500 = $1000 + $500
  let budget = screen.getByText("Budget: $1500");
  let remaining = screen.getByText("Remaining: $1000");
  let spent = screen.getByText("Spent so far: $500");

  expect(budget).toBeInTheDocument();
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();

  // Note: Choose first Expense's delete button
  const deleteExpenseButtons = screen.getAllByText("x");
  fireEvent.click(deleteExpenseButtons[0]);

  // Satistfies Budget = Remaining Balance + Total Expenditure again, since
  // $1500 = $1100 + $400
  budget = screen.getByText("Budget: $1500");
  remaining = screen.getByText("Remaining: $1100");
  spent = screen.getByText("Spent so far: $400");

  expect(budget).toBeInTheDocument();
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});

test("Create an Expense with NaN cost", () => {
  render(<App />);

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  // Create an Expense with Cost value "Test Cost"
  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "Test Cost" } });
  fireEvent.click(createExpenseButton);

  const newExpenseName = screen.getByText("Testing");
  const newExpenseCost = screen.getByText("$0");
  const remaining = screen.getByText("Remaining: $1500");
  const spent = screen.getByText("Spent so far: $0");

  expect(newExpenseName).toBeInTheDocument();
  expect(newExpenseCost).toBeInTheDocument();
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});

test("Go over budget", () => {
  render(<App />);
  window.alert = () => {};

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  // Create $100, $200, $500, $750, and $1000 Expenses
  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "100" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing2" } });
  fireEvent.change(createExpenseCost, { target: { value: "200" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing3" } });
  fireEvent.change(createExpenseCost, { target: { value: "500" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing4" } });
  fireEvent.change(createExpenseCost, { target: { value: "750" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing5" } });
  fireEvent.change(createExpenseCost, { target: { value: "1000" } });
  fireEvent.click(createExpenseButton);

  // Satistfies Budget = Remaining Balance + Total Expenditure, since
  // $1500 = $-1050 + $2550
  const budget = screen.getByText("Budget: $1500");
  // "Remaining Balance" must be negative
  const remaining = screen.getByText("Remaining: $-1050");
  const spent = screen.getByText("Spent so far: $2550");

  expect(budget).toBeInTheDocument();
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});

test("Delete Expenses to go under budget", () => {
  render(<App />);
  window.alert = () => {};

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  // Create $100, $200, $500, $750, and $1000 Expenses
  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "100" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing2" } });
  fireEvent.change(createExpenseCost, { target: { value: "200" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing3" } });
  fireEvent.change(createExpenseCost, { target: { value: "500" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing4" } });
  fireEvent.change(createExpenseCost, { target: { value: "750" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing5" } });
  fireEvent.change(createExpenseCost, { target: { value: "1000" } });
  fireEvent.click(createExpenseButton);

  // "Remaining Balance" is negative
  let remaining = screen.getByText("Remaining: $-1050");
  expect(remaining).toBeInTheDocument();

  // Note: Delete $100 and $1000 Expenses
  const deleteExpenseButtons = screen.getAllByText("x");
  fireEvent.click(deleteExpenseButtons[0]);
  fireEvent.click(deleteExpenseButtons[deleteExpenseButtons.length - 1]);

  // Satistfies Budget = Remaining Balance + Total Expenditure, since
  // $1500 = $50 + $1450
  const budget = screen.getByText("Budget: $1500");
  // "Remaining Balance" is now positive
  remaining = screen.getByText("Remaining: $50");
  const spent = screen.getByText("Spent so far: $1450");

  expect(budget).toBeInTheDocument();
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});

test("Delete Expenses to still be over budget", () => {
  render(<App />);
  window.alert = () => {};

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  // Create $100, $200, $500, $750, and $1000 Expenses
  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "100" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing2" } });
  fireEvent.change(createExpenseCost, { target: { value: "200" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing3" } });
  fireEvent.change(createExpenseCost, { target: { value: "500" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing4" } });
  fireEvent.change(createExpenseCost, { target: { value: "750" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing5" } });
  fireEvent.change(createExpenseCost, { target: { value: "1000" } });
  fireEvent.click(createExpenseButton);

  // "Remaining Balance" is negative
  let remaining = screen.getByText("Remaining: $-1050");
  expect(remaining).toBeInTheDocument();

  // Note: Delete $100 and $500 Expenses
  const deleteExpenseButtons = screen.getAllByText("x");
  fireEvent.click(deleteExpenseButtons[0]);
  fireEvent.click(deleteExpenseButtons[2]);

  // Satistfies Budget = Remaining Balance + Total Expenditure, since
  // $1500 = $-450 + $1950
  const budget = screen.getByText("Budget: $1500");
  // "Remaining Balance" is still negative
  remaining = screen.getByText("Remaining: $-450");
  const spent = screen.getByText("Spent so far: $1950");

  expect(budget).toBeInTheDocument();
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});
