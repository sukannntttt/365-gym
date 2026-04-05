const mongoose = require('mongoose');

async function fix() {
  await mongoose.connect('mongodb://sukantrai826_db_user:jvqbgE02NszuX0Sx@ac-vpovpa0-shard-00-00.pw3gga2.mongodb.net:27017,ac-vpovpa0-shard-00-01.pw3gga2.mongodb.net:27017,ac-vpovpa0-shard-00-02.pw3gga2.mongodb.net:27017/?ssl=true&replicaSet=atlas-4239ro-shard-0&authSource=admin&appName=Cluster0');
  
  try {
    await mongoose.connection.collection('diets').dropIndex('goal_1');
    console.log('Index goal_1 dropped');
  } catch (e) {
    console.log('Error dropping goal_1:', e.message);
  }

  process.exit();
}

fix();
