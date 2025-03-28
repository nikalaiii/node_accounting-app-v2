const fs = require('node:fs').promises;
const path = require('node:path');
const { v4: uuidv4 } = require('uuid');

const baseUrl = path.resolve(__dirname, 'expenses.json');

const formatDate = (timestamp) => {
  const date = new Date(timestamp);

  return date.toISOString().replace('T', ' ').split('.')[0];
};

const getData = async () => {
  try {
    const data = await fs.readFile(baseUrl);

    return JSON.parse(data);
  } catch {
    return undefined;
  }
};

const expensesService = {
  async getAll() {
    try {
      const response = await getData();

      if (response) {
        return response;
      } else {
        return undefined;
      }
    } catch (err) {
      throw new Error(`catch error getAll: ${err.message}`);
    }
  },

  async addNew(newExpense) {
    try {
      const currentData = await getData();

      const doneExpense = {
        id: uuidv4(),
        ...newExpense,
        spentAt: formatDate(Date.now()),
      };

      currentData.push(doneExpense);

      await fs.writeFile(baseUrl, JSON.stringify(currentData));

      return doneExpense;
    } catch (err) {
      throw new Error(`catch error add new: ${err}`);
    }
  },

  async getOneExpense(id) {
    const currentData = await getData();

    const foundExpense = currentData.find((exp) => exp.id === id);

    if (foundExpense) {
      return foundExpense;
    } else {
      return null;
    }
  },

  async deleteExpense(id) {
    const currentData = await getData();

    const expenseToDelete = currentData.find((exp) => exp.id === id);

    if (!expenseToDelete) {
      return null;
    }

    const newData = currentData.filter((exp) => exp.id !== id);

    fs.writeFile(baseUrl, JSON.stringify(newData));

    return 1;
  },

  async updateExpense(id, body) {
    const currentData = await getData();

    const expenseIndex = currentData.findIndex((exp) => exp.id === id);

    if (expenseIndex === -1) {
      return null;
    }

    currentData[expenseIndex] = { ...currentData[expenseIndex], ...body };
    await fs.writeFile(baseUrl, JSON.stringify(currentData));

    return currentData[expenseIndex];
  },
};

module.exports = { expensesService };
