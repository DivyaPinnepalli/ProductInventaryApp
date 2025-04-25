import { Schema, model } from 'mongoose';

const productSchema = new Schema({
  user:            { type: Schema.Types.ObjectId, ref: 'User', required: true },
  barcode:         { type: String, required: true },
  name:            { type: String, default: '' },
  brand:           { type: String, default: '' },
  category:        { type: [String], default: [] },
  unit:            { type: String, default: '' },
  mrp:             { type: Number, default: 0 },
  imageUrl:        { type: String, default: '' },
  description:     { type: String, default: '' },
  discountedPrice: { type: Number, default: 0 },
  stock:           { type: Number, default: 0 },
}, { timestamps: true });

export default model('Product', productSchema);




// import { Schema, model } from 'mongoose';

// const productSchema = new Schema({

//   barcode:        { type: String, required: true, unique: true },
//   name:           { type: String, default: '' },
//   brand:          { type: String, default: '' },
//   category:       { type: [String], default: [] },
//   unit:           { type: String, default: '' },
//   mrp:            { type: Number, default: 0 },
//   imageUrl:       { type: String, default: '' },
//   description:    { type: String, default: '' },
//   discountedPrice:{ type: Number, default: 0 },
//   stock:          { type: Number, default: 0 },
// });

// export default model('Product', productSchema);
