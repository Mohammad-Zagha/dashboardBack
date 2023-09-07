
const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      
      required: true,
  
    },
   email: {
      type: String
    },
    age:{
      type: String
    },
    phoneNumber: {
      type: String
    },
      weight: {
      type: String,
      required: true
    },
    status: {
      type: String
    },
    startDate: {
      type: Date
    },
    endDate: {
      type: Date
    },
    dateArray: [
      {
        startDate: {
          type: Date
        },
        endDate: {
          type: Date
        },
        price:{
            type:String
        }
      }
    ],
    daysLeft:{
      type:String
    },
    frozenDate:{
      type: Number
    },
    owner:{
      type : String,
    
      
    }
  },
  {
    timestamps: true
  }
);
dashboardSchema.index({ name: 1, owner: 1 }, { unique: true });
const Subs = mongoose.model('Subs', dashboardSchema);

module.exports = Subs;
