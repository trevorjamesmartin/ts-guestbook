import logger from './src/api/common/logger';
try {
    require('dotenv').config();
} catch {
    logger.info('Express [production mode]');
}
import app from './src/api/server';

const PORT = process.env.PORT || 8080
const HOST = process.env.HOST || "127.0.0.1"
app.listen(process.env.PORT, function () {
    logger.info(`🟢 server listening at http://${HOST}:${PORT}`);
});
