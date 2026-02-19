import { z } from 'zod';
import common from './common.js';

const classIdParamSchema = z.object({
    classId: common.positiveId
});

const createSessionSchema = z.object({
    class_id: common.positiveId,
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().optional().nullable(),
    session_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Expected YYYY-MM-DD'),
    duration: z.coerce.number().int('Duration must be an integer').positive('Duration must be positive'),
    start_time: z
        .string()
        .trim()
        .regex(/^([01]\d|2[0-3]):([0-5]\d)(:[0-5]\d)?$/, 'Expected HH:MM or HH:MM:SS')
        .optional()
        .nullable()
        .or(z.literal(''))
});

export default {
    classIdParamSchema,
    createSessionSchema
};
