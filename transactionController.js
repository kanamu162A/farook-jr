const pool = require('../config/db');

const getAllTransactions = async (req, res) => {
  try {
    const query = 'SELECT * FROM transactions';
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching transactions:', err);
    res.status(500).json({ message: 'Internal server error contact farook J.r' });
  }
};

const searchTransactions = async (req, res) => {
  const { narration, date } = req.body;
  if (!date) {
    return res.status(400).json({
      message: 'Please Provide all required  fields',
    });
  };
  try {
    const query = `SELECT * FROM transactions WHERE narration LIKE $1 AND date::text LIKE $2`;
    const values = [`%${narration}%`, `%${date}%`];
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No transactions found' });
    };

    res.status(200).json({
      message: 'Data fetched successfully',
      transactions: result.rows,
    });
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ message: 'Server error, please contact farook jr' });
  }
};

module.exports = {searchTransactions,getAllTransactions}