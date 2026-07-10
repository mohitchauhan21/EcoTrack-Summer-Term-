# Controllers

This directory contains Express route controller functions.

Each controller should:
- Import `asyncHandler` from `../utils/asyncHandler.js`
- Import `ApiResponse` from `../utils/ApiResponse.js`
- Import `ApiError` from `../utils/ApiError.js`
- Export named handler functions

Example:
```js
import asyncHandler from '../utils/asyncHandler.js';
import ApiResponse from '../utils/ApiResponse.js';

export const getItems = asyncHandler(async (req, res) => {
  const items = await Item.find();
  res.status(200).json(new ApiResponse(200, items, 'Items fetched'));
});
```
