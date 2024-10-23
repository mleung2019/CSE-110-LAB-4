import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { Expense } from "../../types/types";

const AddExpenseForm = () => {
  // Exercise: Consume the AppContext here
  const { expenses, setExpenses } = useContext(AppContext);

  // Exercise: Create name and cost to state variables
  const [name, setName] = useState("");
  const [cost, setCost] = useState(0);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Exercise: Add add new expense to expenses context array
    let id: Number;
    if (expenses.length) {
      id = Number(expenses[expenses.length - 1].id) + 1;
    } else {
      id = 1;
    }
    const newExpense: Expense = {
      id: id.toString(),
      name: name,
      cost: cost,
    };
    setExpenses([...expenses, newExpense]);
  };

  return (
    <form onSubmit={(event) => onSubmit(event)}>
      <div className="row">
        <div className="col-sm">
          <label htmlFor="name">Name</label>
          <input
            required
            type="text"
            className="form-control"
            id="name"
            data-testid="name"
            value={name}
            // HINT: onChange={}
            onChange={(e) => setName(e.target.value)}
          ></input>
        </div>
        <div className="col-sm">
          <label htmlFor="cost">Cost</label>
          <input
            required
            type="text"
            className="form-control"
            id="cost"
            data-testid="cost"
            value={cost}
            // HINT: onChange={}
            onChange={(e) => {
              let cost = Number(e.target.value);
              // Note: If the cost value is NaN, change it to 0
              if (isNaN(cost)) cost = 0;
              setCost(cost);
            }}
          ></input>
        </div>
        <div className="col-sm">
          <button type="submit" className="btn btn-primary mt-3">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddExpenseForm;
