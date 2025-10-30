import Income from "../model/Income.js";
import * as XLSX from "xlsx";


export const addIncome = async (req, res) => {
  const userId = req.user.id;

  try {
    const { source, amount, date, icon } = req.body;

    if (!source || !amount || !date) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newIncome = new Income({
      userId,
      icon,
      source,
      amount,
      date: new Date(date),
    });

    await newIncome.save();

    res.status(201).json({
      success: true,
      message: "Income added successfully",
      income: newIncome, 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllIncome = async(req, res)=>{
     const userId = req.user.id;
    try {
   
    const incomes = await Income.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      incomes,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const deleteIncome = async(req,res)=>{
      try {
    const { id } = req.params;

    const income = await Income.findOneAndDelete( req.params.id );

    if (!income) {
      return res.status(404).json({ message: "Income not found or not authorized" });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export const downloadIncomeExcel = async (req, res) => {
  try {
    const userId = req.user.id;

    const incomes = await Income.find({ userId }).sort({ date: -1 });

    if (incomes.length === 0) {
      return res.status(404).json({ message: "No income records found" });
    }

    const data = incomes.map((item) => ({
      Source: item.source,
      Amount: item.amount,
      Date: new Date(item.date).toLocaleDateString(),
    }));

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Incomes");

    // Create Excel buffer instead of writing file
    const buffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    //  Set headers for browser download
    res.setHeader("Content-Disposition", "attachment; filename=income_details.xlsx");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );


    res.send(buffer);
  } catch (error) {
    console.error("Error generating income Excel:", error);
    res.status(500).json({ message: "Error generating Excel file" });
  }
};