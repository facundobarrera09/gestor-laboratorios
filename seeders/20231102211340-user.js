'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      username: 'test',
      passwordHash: 'owoj19f1j19f1j9f',
      email: 'example@test.com',
      verified: true,
      createdBy: 1,
      updatedBy: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: 1,
    }]);
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
