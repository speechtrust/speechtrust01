import { app } from './app.js'
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT || 8050;

app.listen(port, () => {
    console.log(`app is listning at port ${port}`)
})