// src/server.ts
import { app } from './app';
import logger from './logger/logger';
import CONFIG from '../src/config/config'

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Server running at http://${CONFIG.LOCAL_HOST}:${PORT}/`);
});
