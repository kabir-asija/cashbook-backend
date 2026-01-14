import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;
    const transactions =
      await sql`SELECT * FROM transactions WHERE user_id=${userId} ORDER BY created_At DESC`;
    res.status(200).json(transactions);
  } catch (error) {
    console.log("Error getting the transaction: ", error);
    return res.status(500).json({ message: "Internal Sever Error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { user_id, title, amount, category } = req.body;

    if (!user_id || !title || amount === undefined || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction =
      await sql`INSERT INTO transactions(user_id,title,amount,category)
        VALUES (${user_id},${title},${amount},${category})
        RETURNING *`;
    res.status(201).json(transaction[0]);
  } catch (error) {
    console.log("Error creating the transaction: ", error);
    return res.status(500).json({ message: "Internal Sever Error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction id" });
    }

    const transactions =
      await sql`DELETE FROM transactions where id=${id} RETURNING *`;
    if (transactions.length === 0) {
      return res.status(404).json({ message: "transaction not found" });
    }
    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.log("Error deleteing the transaction: ", error);
    return res.status(500).json({ message: "Internal Sever Error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;
    const balanceResult = await sql`
    SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id=${userId}
    `;
    const incomeResult = await sql`
SELECT COALESCE(SUM(amount),0) as income From transactions
 WHERE user_id=${userId} AND amount > 0
`;
    const expensesResult = await sql`
SELECT COALESCE(SUM(amount),0) as expenses From transactions
 WHERE user_id=${userId} AND amount < 0
`;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    console.log("Error getting the transaction summary : ", error);
    return res.status(500).json({ message: "Internal Sever Error" });
  }
}
