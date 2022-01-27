const { Schema, model } = require('mongoose');
const reactionSchema = require('./Reaction');
const dateFormat = require('../utils/dateFormat');

const thoughtSchema = new Schema(
  {
    // TODO: Done add thoughtText
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280
    },

    // TODO: DONE add createdAt
    createdAt: {
      type: Date,
      default: Date.now,
      get: timestamp => dateFormat(timestamp)
    },
    // TODO: DONE add username
    username: {
      type: String,
      required: true
    },

    // TODO: Done add reactions
    reactions: [
      {
        type: reactionSchema,
        ref: 'Reaction',
      }
    ],

  },
  {
    // TODO: Done Add toJSON 
    toJSON: {
      virtuals: true,
    },
    id: false,
  }
);

thoughtSchema.virtual('reactionCount').get(function() {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
