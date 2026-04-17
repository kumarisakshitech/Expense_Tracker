import incomeModel from "../models/incomeModel.js";
import XLSX from "xlsx";
import getDateRange from "../utils/dateFilter.js";

// ➤ Add Income
export async function addIncome(req, res) {
    const userId = req.user._id;
    const { description, amount, category, date } = req.body;

    try {
        if (!description || !amount || !category || !date) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const newIncome = new incomeModel({
            userId,
            description,
            amount,
            category,
            date: new Date(date)
        });

        await newIncome.save();

        res.json({
            success: true,
            message: "Income added successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Get All Income
export async function getAllIncome(req, res) {
    const userId = req.user._id;

    try {
        const incomes = await incomeModel
            .find({ userId })
            .sort({ date: -1 });

        res.json({
            success: true,
            data: incomes
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Update Income
export async function updateIncome(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const { description, amount, category, date } = req.body;

    try {
        const updatedIncome = await incomeModel.findOneAndUpdate(
            { _id: id, userId },
            { description, amount, category, date },
            { new: true }
        );

        if (!updatedIncome) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        res.json({
            success: true,
            message: "Income updated successfully",
            data: updatedIncome
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Delete Income
export async function deleteIncome(req, res) {
    try {
        const income = await incomeModel.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        if (!income) {
            return res.status(404).json({
                success: false,
                message: "Income not found"
            });
        }

        res.json({
            success: true,
            message: "Income deleted successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Download Excel
export async function downloadIncomeExcel(req, res) {
    const userId = req.user._id;

    try {
        const incomes = await incomeModel
            .find({ userId })
            .sort({ date: -1 });

        const plainData = incomes.map(inc => ({
            Description: inc.description,
            Amount: inc.amount,
            Category: inc.category,
            Date: new Date(inc.date).toLocaleDateString()
        }));

        const worksheet = XLSX.utils.json_to_sheet(plainData);
        const workbook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");

        const filePath = "income_details.xlsx";
        XLSX.writeFile(workbook, filePath);

        res.download(filePath);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
}


// ➤ Income Overview
export async function getIncomeOverview(req, res) {
    try {
        const userId = req.user._id;
        const { range = "monthly" } = req.query;
        const { start, end } = getDateRange(range);

        const incomes = await incomeModel.find({
            userId,
            date: {
                $gte: start,
                $lte: end
            }
        }).sort({ date: -1 });

        const totalIncome = incomes.reduce((acc, cur) => acc + cur.amount, 0);
        const averageIncome = incomes.length ? totalIncome / incomes.length : 0;
        const numberOfTransactions = incomes.length;
        const recentTransactions = incomes.slice(0, 9);

        res.json({
            success: true,
            data: {
                totalIncome,
                averageIncome,
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