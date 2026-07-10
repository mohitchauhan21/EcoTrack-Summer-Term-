# Models

This directory contains Mongoose schema definitions.

Each model should:
- Define a schema with proper validation
- Export the compiled model as default

Example:
```js
import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
  },
  { timestamps: true }
);

export default mongoose.model('Item', itemSchema);
```
