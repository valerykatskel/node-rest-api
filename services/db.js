const mongoose = require('mongoose');

exports.connectToDatabase = async (connectUrl) => {
    try {
        mongoose.set('strictQuery', false);  
        mongoose.set('useNewUrlParser', true);
      
        await mongoose.connect(connectUrl);
  
      console.log('connected to database');
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
};