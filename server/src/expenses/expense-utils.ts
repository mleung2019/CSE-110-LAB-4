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

export function deleteExpense(req: Request, res: Response, db: Database) {
	// TO DO: Implement deleteExpense function
	// for (let i = 0; i < expenses.length; i++) {
	// 	if (expenses[i].id === req.params.id) {
	// 		expenses.splice(i, 1);
	// 	}
	// }
	// res.status(200).send("Delete Successful");
}

export function getExpenses(req: Request, res: Response, db: Database) {
	// res.status(200).send({ data: expenses });
}
