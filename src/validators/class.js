import { z } from 'zod';
import common from './common.js';

const instructorIdParamSchema = z.object({
    instructorId: common.positiveId
});

const studentIdParamSchema = z.object({
    studentId: common.positiveId
});

const userIdParamSchema = z.object({
    userId: common.positiveId
});

const classIdParamSchema = z.object({
    classId: common.positiveId
});

export default {
    instructorIdParamSchema,
    studentIdParamSchema,
    userIdParamSchema,
    classIdParamSchema
};
