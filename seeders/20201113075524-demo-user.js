"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    return queryInterface.bulkInsert("users", [
      {
        name: "kazuaki",
        token: "kazuaki",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "John",
        token: "testtoken",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Mike",
        token: "testtoken",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Chris",
        token: "testtoken",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Tom",
        token: "testtoken",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("users", null, {});
  },
};
