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
    return queryInterface.bulkInsert("tasks", [
      {
        userId: 1,
        task: "create GET METHOD",
        project: "API solo project",
        priority: 1,
        due: "2020-11-16 09:00:00",
        comment: "by TDD",
        completed: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        userId: 1,
        task: "create POST METHOD",
        project: "API solo project",
        priority: 2,
        due: "2020-11-16 09:00:00",
        comment: "by TDD",
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        userId: 1,
        task: "create PATCH METHOD",
        project: "API solo project",
        priority: 3,
        due: "2020-11-16 09:00:00",
        comment: "by TDD",
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        userId: 1,
        task: "create DELETE METHOD",
        project: "API solo project",
        priority: 4,
        due: "2020-11-16 09:00:00",
        comment: "by TDD",
        completed: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        userId: 2,
        task: "goto MUSASHIYA",
        project: "RAMEN project",
        priority: 5,
        due: "2020-11-16 12:00:00",
        comment: "at Hiyoshi",
        completed: false,
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
    await queryInterface.bulkDelete("tasks", null, {});
  },
};
