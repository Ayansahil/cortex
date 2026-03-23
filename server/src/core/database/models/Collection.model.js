import mongoose from 'mongoose';

const collectionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    color: {
      type: String,
      default: '#3b82f6',
    },
    icon: {
      type: String,
      default: 'folder',
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
    itemCount: {
      type: Number,
      default: 0,
    },
    coverImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

collectionSchema.index({ user: 1, name: 1 });

collectionSchema.pre('save', function (next) {
  this.itemCount = this.items.length;
  next();
});

const Collection = mongoose.model('Collection', collectionSchema);

export default Collection;
