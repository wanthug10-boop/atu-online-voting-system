const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
p.$queryRawUnsafe("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
  .then(r => { console.log("Tables:", JSON.stringify(r, null, 2)); })
  .catch(e => console.error("Error:", e.message))
  .finally(() => p.$disconnect());