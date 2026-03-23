import mongoose from 'mongoose';

const highlightSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      enum: ['indigo', 'amber', 'emerald', 'rose', 'yellow', 'green', 'blue', 'pink', 'purple'],
      default: 'indigo',
    },
    position: {
      start: {
        type: Number,
        required: true,
      },
      end: {
        type: Number,
        required: true,
      },
      startOffset: Number,
      endOffset: Number,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

highlightSchema.index({ user: 1, item: 1 });
highlightSchema.index({ user: 1, createdAt: -1 });

const Highlight = mongoose.model('Highlight', highlightSchema);

export default Highlight;
