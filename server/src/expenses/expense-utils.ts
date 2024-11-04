import { Expense } from "../types";
import { Request, Response } from "express";
import { Database } from "sqlite";

export async function createExpenseServer(req: Request, res: Response, db: Database) {
	// Type casting the request body to the expected format.
	const { id, cost, description } = req.body as { id: string; cost: number; description: string };

	if (!description || !id || !cost) {
		return res.status(400).send({ error: "Missing required fields" });
	}

	try {
		await db.run("INSERT INTO expenses (id, description, cost) VALUES (?, ?, ?);", [id, description, cost]);
	} catch (error) {
		return res.status(400).send({ error: `Expense could not be created, + ${error}` });
	}

	res.status(201).send({ id, description, cost });
}

export async function deleteExpense(req: Request, res: Response, db: Database) {
  try {
    await db.run("DELETE FROM expenses WHERE id = ?;", [req.params.id]);
  } catch (error) {
    return res.status(400).send({ error: `Expense could not be deleted, + ${error}` });
  }

  res.status(200).send("Delete Successful");
}

export async function getExpenses(req: Request, res: Response, db: Database) {
  let expenses;
  try {
    expenses = await db.all("SELECT * FROM expenses");
  } catch (error) {
    return res.status(400).send({ error: `Could not get expenses, + ${error}` });
  }

  res.status(200).send({ data: expenses });
}
