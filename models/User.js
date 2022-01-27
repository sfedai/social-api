const { Schema, model } = require('mongoose');

var validateEmail = function(email) {
  var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email)
};

const userSchema = new Schema(
  {
    // TODO: Done create username field
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // TODO: Done w/o validate create email field
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validateEmail, 'Please enter a valid email address']
    },

    thoughts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Thought',
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

userSchema.virtual('friendCount').get(function () {
  return this.friends.length;
});

const User = model('User', userSchema);

module.exports = User;
