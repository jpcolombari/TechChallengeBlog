const mongoose = require('mongoose');

async function test() {
  await mongoose.connect('mongodb://localhost:27017/tech-challenge-blog');
  const schema = new mongoose.Schema({ name: String });
  const Model = mongoose.model('Test', schema);
  try {
    await Model.findById(undefined).exec();
    console.log("Success with undefined");
  } catch (err) {
    console.error("Error with undefined:", err.message);
  }
  process.exit(0);
}
test();
