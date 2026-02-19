import { z } from 'zod';

const positiveId = z.coerce
    .number()
    .int('Must be an integer')
    .positive('Must be a positive integer');

export default {
    positiveId
};
