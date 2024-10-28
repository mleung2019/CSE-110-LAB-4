import { useContext, useEffect } from "react";
import { AppContext } from "../../context/AppContext";
import { fetchBudget } from "../../utils/budget-utils";

const Budget = () => {
  const { budget, setBudget } = useContext(AppContext);

  // Fetch budget on component mount
  useEffect(() => {
    loadBudget();
  }, []);

  // Function to load expenses and handle errors
  const loadBudget = async () => {
    try {
      const budgetServer = await fetchBudget();
      setBudget(budgetServer);
    } catch (err: any) {
      console.log(err.message);
    }
  };

  return (
    <div className="alert alert-secondary p-3 d-flex align-items-center justify-content-between">
      <div>Budget: ${budget}</div>
    </div>
  );
};

export default Budget;
