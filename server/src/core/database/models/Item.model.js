import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['article', 'tweet', 'image', 'video', 'pdf', 'link', 'note'],
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      text: true,
    },
    excerpt: {
      type: String,
      maxlength: 500,
    },
    author: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    thumbnail: {
      type: String,
    },
    filePath: {
      type: String,
    },
    fileSize: {
      type: Number,
    },
    mimeType: {
      type: String,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    autoTags: [
      {
        tag: {
          type: String,
          trim: true,
          lowercase: true,
        },
        confidence: {
          type: Number,
          min: 0,
          max: 1,
        },
      },
    ],
    topics: [
      {
        name: {
          type: String,
          trim: true,
        },
        score: {
          type: Number,
          min: 0,
          max: 1,
        },
      },
    ],
    isFavorite: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    readingTime: {
      type: Number,
    },
    wordCount: {
      type: Number,
    },
    lastViewedAt: {
      type: Date,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    metadata: {
      type: Map,
      of: mongoose.Schema.Types.Mixed,
    },
    processingStatus: {
      type: String,
      enum: ['pending', 'processing', 'completed', 'failed'],
      default: 'pending',
    },
    embeddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Embedding',
    },
  },
  {
    timestamps: true,
  }
);

itemSchema.index({ user: 1, createdAt: -1 });
itemSchema.index({ user: 1, type: 1 });
itemSchema.index({ user: 1, tags: 1 });
itemSchema.index({ user: 1, isFavorite: 1 });
itemSchema.index({ content: 'text', title: 'text' });

const Item = mongoose.model('Item', itemSchema);

export default Item;
