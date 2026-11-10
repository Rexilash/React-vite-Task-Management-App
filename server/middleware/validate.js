const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({ 
      error: 'Validation failed', 
      details: err.errors.map(e => e.message) 
    });
  }
};

module.exports = validate;