'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'John',
      passwordHash: 'kqkfkqf',
      email: 'example@example.com',
      verified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 1,
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
