import express from 'express';

const app = express();

app.use( express.json() );
app.use( express.urlencoded({limit:10*1024*1024} ))

export default app;