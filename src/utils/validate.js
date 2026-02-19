
const validate =
    (schema, type = 'body') =>
        (req, res, next) => {

            const result = schema.safeParse(req[type]);

            if (!result.success) {
                return res.status(400).json({
                    message: "Validation failed",
                    errors: result.error.errors.map(err => ({
                        field: err.path.join('.'),
                        message: err.message
                    }))
                });
            }

            req[type] = result.data;
            next();
        };

export default validate;


