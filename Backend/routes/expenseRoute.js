import express from "express";
import { authMiddleware } from "../middleware/auth.js";

import {
  addExpense,
  getAllExpense,
  updateExpense,
  deleteExpense,
  downloadExpenseData,
  getExpenseOverview
} from "../controllers/expenseController.js";

const expenseRouter = express.Router();

// ➤ Add Expense
expenseRouter.post("/add", authMiddleware, addExpense);

// ➤ Get All Expenses
expenseRouter.get("/get", authMiddleware, getAllExpense);

// ➤ Update Expense
expenseRouter.put("/update/:id", authMiddleware, updateExpense);

// ➤ Delete Expense
expenseRouter.delete("/delete/:id", authMiddleware, deleteExpense);

// ➤ Download Excel
expenseRouter.get("/download", authMiddleware, downloadExpenseData);

// ➤ Overview
expenseRouter.get("/overview", authMiddleware, getExpenseOverview);

export default expenseRouter;