import expenseModel from "../models/expenseModel.js";
import getDateRange from "../utils/dateFilter.js";
import XLSX from "xlsx";


// ➤ Add Expense
export async function addExpense(req, res) {
    const { description, amount, category, date } = req.body;
    const userId = req.user._id;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newExpense = new expenseModel({ //create new expense document
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        await newExpense.save();//save to database

        res.json({
            success: true,
            message: "Expense added successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}


// ➤ Get All Expenses
export async function getAllExpense(req, res) {
    const userId = req.user._id;

    try {   //find all expenses for the user and sort by date in descending order
        const expenses = await expenseModel
            .find({ userId })
            .sort({ date: -1 });

        res.json({
            success: true,
            data: expenses
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Update Expense
export async function updateExpense(req, res) {
    const userId = req.user._id;
    const { id } = req.params; //get expense id from request parameters
    const { description, amount, category, date } = req.body;

    try {//update the expense document that matches the id and userId with the new data, and return the updated document
        const updatedExpense = await expenseModel.findOneAndUpdate(
            { _id: id, userId },//both id and userId must match to ensure that users can only update their own expenses
            { description, amount, category, date },
            { new: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.json({
            success: true,
            message: "Expense updated successfully",
            data: updatedExpense
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Delete Expense
export async function deleteExpense(req, res) {
    try {
        const expense = await expenseModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!expense) {
            return res.status(404).json({
                success: false,
                message: "Expense not found"
            });
        }

        res.json({
            success: true,
            message: "Expense deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Download Expense Excel
export async function downloadExpenseData(req, res) {
    const userId = req.user._id;

    try {//get all expenses for the user, sort by date, and format the data for Excel export. Then create a worksheet and workbook using XLSX, write the workbook to a file, and send it as a download response
        const expenses = await expenseModel
            .find({ userId })
            .sort({ date: -1 });


        const plainData = expenses.map(exp => ({//format data for Excel export
            Description: exp.description,
            Amount: exp.amount,
            Category: exp.category,
            Date: new Date(exp.date).toLocaleDateString()
        }));
        // Create a worksheet and workbook using XLSX, write the workbook to a file, and send it as a download response
        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();
          //add sheet to workbook
        XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

        const filePath = "expenses_details.xlsx";//save to file
        XLSX.writeFile(workbook, filePath);

        res.download(filePath);//send file to user

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Expense Overview
export async function getExpenseOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;//daily/week/monthly/quarterly/yearly, default is monthly
        const { start, end } = getDateRange(range);

        const expenses = await expenseModel.find({//get expenses in data range
            userId,
            date: {
                $gte: start,
                $lte: end
            }
        }).sort({ date: -1 });

        //Calculate total, average, number of transactions, and recent transactions for the overview

        const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
        const averageExpense = expenses.length ? totalExpense / expenses.length : 0;
        const numberOfTransactions = expenses.length;
        const recentTransactions = expenses.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalExpense,
                averageExpense,
                numberOfTransactions,
                recentTransactions,
                range
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}