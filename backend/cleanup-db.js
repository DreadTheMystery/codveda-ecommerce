const { sequelize, User } = require("./src/models");

async function cleanupDatabase() {
  try {
    console.log("🔧 Starting database cleanup...");

    // Remove duplicate emails (keep the first one)
    const duplicateEmails = await sequelize.query(
      `
      SELECT email, COUNT(*) as count 
      FROM users 
      WHERE email IS NOT NULL 
      GROUP BY email 
      HAVING count > 1
    `,
      { type: sequelize.QueryTypes.SELECT }
    );

    for (const duplicate of duplicateEmails) {
      console.log(`Removing duplicate entries for email: ${duplicate.email}`);
      const users = await User.findAll({
        where: { email: duplicate.email },
        order: [["createdAt", "ASC"]],
      });

      // Keep the first user, delete the rest
      for (let i = 1; i < users.length; i++) {
        await users[i].destroy();
      }
    }

    // Remove users with null emails
    const nullEmailUsers = await User.findAll({ where: { email: null } });
    for (const user of nullEmailUsers) {
      await user.destroy();
    }

    console.log("✅ Database cleanup completed");
  } catch (error) {
    console.error("❌ Database cleanup failed:", error);
  } finally {
    await sequelize.close();
  }
}

if (require.main === module) {
  cleanupDatabase();
}

module.exports = { cleanupDatabase };
