'use strict';

import pino from 'pino';

const isProd = process.env.NODE_ENV === 'production';

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    redact: {
        paths: [
            'req.headers.authorization',
            '*.password',
            '*.pin',
            '*.token'
        ],
        censor: '[REDACTED]'
    },
    transport: !isProd
        ? {
            target: 'pino-pretty',
            options: {
                colorize: true,
                translateTime: 'yyyy-mm-dd HH:MM:ss'
            }
        }
        : undefined
});

export default logger;
