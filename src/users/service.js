const fs = require('node:fs').promises;
const path = require('node:path');
const { v4: uuidv4 } = require('uuid');

const usersUrl = path.resolve(__dirname, 'users.json');

const usersService = {
  async getAll() {
    try {
      const usersData = await fs.readFile(usersUrl, 'utf8');

      return JSON.parse(usersData);
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async getUser(id) {
    try {
      const usersData = await fs.readFile(usersUrl, 'utf8');
      const usersArray = JSON.parse(usersData);

      return usersArray.find((user) => user.id === id) || null;
    } catch (err) {
      throw new Error(`Catch error service: ${err.message}`);
    }
  },

  async addUser(name) {
    try {
      const newUser = { id: uuidv4(), name: name };
      const usersData = await fs.readFile(usersUrl, 'utf8');
      const usersArray = JSON.parse(usersData);

      usersArray.push(newUser);

      await fs.writeFile(usersUrl, JSON.stringify(usersArray, null, 2));

      return newUser;
    } catch (err) {
      throw new Error(err.message);
    }
  },

  async deleteUser(id) {
    try {
      const usersData = await fs.readFile(usersUrl, 'utf8');
      const usersArray = JSON.parse(usersData);

      const userToDelete = usersArray.find((user) => user.id === id);

      if (!userToDelete) {
        return null;
      } // Якщо користувача немає

      const newUsersData = usersArray.filter((user) => user.id !== id);

      await fs.writeFile(usersUrl, JSON.stringify(newUsersData, null, 2));

      return userToDelete; // Повертаємо видаленого користувача
    } catch (err) {
      throw new Error(`catch error delete user service: ${err.message}`);
    }
  },

  async updateUser(id, newName) {
    try {
      const usersData = await fs.readFile(usersUrl, 'utf8');
      const usersArray = usersData ? JSON.parse(usersData) : [];

      const userToUpdate = usersArray.find((user) => user.id === id);

      if (!userToUpdate) {
        return null;
      }

      userToUpdate.name = newName;

      await fs.writeFile(usersUrl, JSON.stringify(usersArray, null, 2));

      return userToUpdate;
    } catch (err) {
      throw new Error(`catch error update user service: ${err.message}`);
    }
  },
};

module.exports = { usersService };
