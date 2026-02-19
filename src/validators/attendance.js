import { z } from 'zod';
import common from './common.js';

const sessionIdParamSchema = z.object({
    sessionId: common.positiveId
});

const addBulkAttendanceSchema = z.object({
    session_id: common.positiveId,
    attendance: z
        .array(
            z.object({
                student_id: common.positiveId,
                status: z.enum(['PRESENT', 'ABSENT', 'LATE'])
            })
        )
        .min(1, 'attendance must be a non-empty array')
});

export default {
    sessionIdParamSchema,
    addBulkAttendanceSchema
};
