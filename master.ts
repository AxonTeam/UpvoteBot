import mongoose from 'mongoose';
import { app } from './Modules/';
const port: number = 3001;

console.log('--------------------\nStarting moustache\n--------------------');

mongoose.connect('mongodb://localhost:27017/moustacheDB', {
    useNewUrlParser: true,
    autoReconnect: true
})
    .then(() => console.log('[master] Connected to MongoDB.'))
    .catch(e => console.log(e));

app.listen(port, () => {
    console.log(`[express] Listening at port ${port}`);
});
