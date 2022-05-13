try {
    require('dotenv').config();
} catch {
    console.log('[production mode]');
}
import httpServer from './src/api/server';

const PORT = process.env.PORT || 8080
httpServer.listen(process.env.PORT, function () {
    console.log(`-- listening on ${PORT}`);
});
