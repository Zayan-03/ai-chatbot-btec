const Joi = require('joi');

const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body);
    
    if (error) {
      return res.status(400).json({
        success: false,
        error: 'Validation error',
        code: 'VALIDATION_ERROR',
        details: error.details.map(d => ({ field: d.path[0], message: d.message }))
      });
    }
    
    req.validatedData = value;
    next();
  };
};

// Define schemas
const schemas = {
  register: Joi.object({
    email: Joi.string().email().required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    password: Joi.string().min(8).required()
  }),
  
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),
  
  createConversation: Joi.object({
    title: Joi.string().max(200).required(),
    description: Joi.string().max(1000).optional()
  }),
  
  sendMessage: Joi.object({
    content: Joi.string().required(),
    file_ids: Joi.array().items(Joi.string()).optional()
  }),
  
  updateProfile: Joi.object({
    username: Joi.string().alphanum().min(3).max(30).optional(),
    bio: Joi.string().max(500).optional(),
    avatar_url: Joi.string().uri().optional()
  })
};

module.exports = { validateRequest, schemas };
