import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import App from "./App";
import { wait } from "@testing-library/user-event/dist/utils";

test("Create an Expense", () => {
  render(<App />);

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "100" } });
  fireEvent.click(createExpenseButton);

  waitFor(() => {
    const newExpenseName = screen.getByText("Testing");
    const newExpenseCost = screen.getByText("$100");
    const remaining = screen.getByText("Remaining: $1400");
    const spent = screen.getByText("Spent so far: $100");

    expect(newExpenseName).toBeInTheDocument();
    expect(newExpenseCost).toBeInTheDocument();
    expect(remaining).toBeInTheDocument();
    expect(spent).toBeInTheDocument();
  });
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

  const remaining = screen.getByText("Remaining: $1500");
  const spent = screen.getByText("Spent so far: $0");
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});

test("Budget Balance Verification", () => {
  render(<App />);

  const createExpenseName = screen.getByLabelText("Name");
  const createExpenseCost = screen.getByLabelText("Cost");
  const createExpenseButton = screen.getByText("Save");

  fireEvent.change(createExpenseName, { target: { value: "Testing" } });
  fireEvent.change(createExpenseCost, { target: { value: "100" } });
  fireEvent.click(createExpenseButton);
  fireEvent.change(createExpenseName, { target: { value: "Testing2" } });
  fireEvent.change(createExpenseCost, { target: { value: "400" } });
  fireEvent.click(createExpenseButton);

  // Satistfies Budget = Remaining Balance + Total Expenditure, since
  // $1500 = $1000 + $500
  const budget = screen.getByText("Budget: $1500");
  const remaining = screen.getByText("Remaining: $1000");
  const spent = screen.getByText("Spent so far: $500");

  expect(budget).toBeInTheDocument();
  expect(remaining).toBeInTheDocument();
  expect(spent).toBeInTheDocument();
});
