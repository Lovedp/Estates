import Joi from 'joi';

export const listingSchema = Joi.object({
  name: Joi.string().min(10).max(64).required(),
  description: Joi.string().min(50).max(2000).required(),
  address: Joi.string().required(),
  category: Joi.string()
    .valid('family-house', 'apartment', 'lands', 'modern-villa', 'offices')
    .required(),
  regularPrice: Joi.number().min(1).required(),
  discountPrice: Joi.number().min(0).default(0),
  bedrooms: Joi.number().min(1).max(20).required(),
  bathrooms: Joi.number().min(1).max(10).required(),
  furnished: Joi.boolean().required(),
  parking: Joi.boolean().required(),
  type: Joi.string().valid('sale', 'rent').required(),
  offer: Joi.boolean().required(),
  imageUrls: Joi.array().items(Joi.string().uri()).min(1).max(6).required(),
  status: Joi.string().valid('draft', 'active', 'sold', 'rented').default('active')
});