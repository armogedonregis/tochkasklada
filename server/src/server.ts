require('module-alias/register')
import HyperExpress, { Request, Response } from 'hyper-express';
import router from './routes/route';

const server = new HyperExpress.Server();

const corsMiddleware = async (req: Request, res: Response) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    
    if (req.method === 'OPTIONS') {
        res.status(200).send();
        return;
    }
};

server.use('/api', corsMiddleware, router);

server.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

const port = parseInt(process.env.PORT || '5000');

server.all('*', (request, response) => {
    response.status(404).json({
        message: 'Маршрут не найден'
    });
});

server.listen(port)
    .then(() => console.log(`Server started listening on port ${port}`))
    .catch((error) => console.log('Failed to start server: ', error))