import mongoose from 'mongoose';

const embeddingSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vector: {
      type: [Number],
      required: true,
    },
    model: {
      type: String,
      required: true,
      default: 'text-embedding-3-small',
    },
    dimensions: {
      type: Number,
      required: true,
      default: 1536,
    },
    textContent: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

embeddingSchema.index({ user: 1, item: 1 });

const Embedding = mongoose.model('Embedding', embeddingSchema);

export default Embedding;
