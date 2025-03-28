const { usersService } = require('./service');

const getAll = async (req, res) => {
  const todos = await usersService.getAll();

  res.json(todos);
};

const addUser = async (req, res) => {
  const userName = req.body.name;

  if (!userName || typeof userName !== 'string') {
    res.status(400).send('Invalid data request');
  }

  try {
    await usersService.addUser(userName);
    res.status(201).send('created');
  } catch {
    res.status(500).send('Server error');
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).send('Invalid request data');
  }

  try {
    await usersService.getUser(userId).then((user) => {
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send(user);
      }
    });
  } catch (err) {
    res.status(500).send('Server error');
  }
};

const removeUser = async (req, res) => {
  const userId = req.params.id;

  if (!userId) {
    res.status(400).send('Invalid request data');
  }

  try {
    await usersService.deleteUser(userId);
    res.status(204).send('Succesfully removed');
  } catch {
    res.status(500).send('Server error');
  }
};

const updateUser = async (req, res) => {
  const newName = req.body.name;
  const idToUpdate = req.params.id;

  if (!newName || !idToUpdate) {
    res.status(400).send('Invalid data request');
  }

  try {
    usersService.updateUser(idToUpdate, newName).then((user) => {
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send(JSON.stringify(user));
      }
    });
  } catch {
    res.status(500).send('Server error');
  }
};

module.exports = {
  getAll,
  addUser,
  getUser,
  removeUser,
  updateUser,
};
