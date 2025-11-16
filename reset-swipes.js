const initSqlJs = require('sql.js');
const fs = require('fs');

async function resetSwipes() {
  const SQL = await initSqlJs();

  if (!fs.existsSync('coupling.db')) {
    console.log('❌ Database not found. Run "node seed.js" first.');
    return;
  }

  const buffer = fs.readFileSync('coupling.db');
  const db = new SQL.Database(buffer);

  // Delete all swipes and matches
  db.run('DELETE FROM swipes');
  db.run('DELETE FROM matches');

  // Save database
  const data = db.export();
  const newBuffer = Buffer.from(data);
  fs.writeFileSync('coupling.db', newBuffer);

  db.close();

  console.log('✅ All swipes and matches have been cleared!');
  console.log('Users kept intact. You can now swipe again!');
}

resetSwipes().catch(console.error);
