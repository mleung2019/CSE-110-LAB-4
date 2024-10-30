import { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget, updateBudget } from "../../utils/budget-utils";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);
  const [budgetText, setBudgetText] = useState(budget);
  const [edit, setEdit] = useState(false);

  // Fetch budget on component mount
  useEffect(() => {
    loadBudget();
  }, []);

  // Function to load expenses and handle errors
  const loadBudget = async () => {
    try {
      const budgetServer = await fetchBudget();
      setBudget(budgetServer);
      setBudgetText(budgetServer);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      <div>
        {edit ? (
          <input
            type="text"
            value={budgetText}
            onChange={(e) => {
              let budgetText = Number(e.target.value);
              if (isNaN(budgetText)) budgetText = 0;
              setBudgetText(budgetText);
            }}
          ></input>
        ) : (
          `Budget: $${budget} `
        )}
        <button
          className="btn btn-primary"
          type="submit"
          onClick={() => {
            if (edit) {
              updateBudget(budgetText);
              setBudget(budgetText);
            }
            setEdit(!edit);
          }}
        >
          {edit ? "Save" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default Budget;
