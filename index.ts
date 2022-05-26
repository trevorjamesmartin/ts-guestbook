try {
    require('dotenv').config();
} catch {
    console.log('Express [production mode]');
}
import app from './src/api/server';

const PORT = process.env.PORT || 8080
app.listen(process.env.PORT, function () {
    console.log(`🟢 server listening at port ${PORT}`);
});
