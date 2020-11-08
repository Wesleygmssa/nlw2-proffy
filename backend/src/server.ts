import express, { Router } from 'express';
import cors from 'cors';
import routes from './routes/routes';

const app = express(); //chamando a funcção

app.use(cors()); // liberação para retorno da api para front end
app.use(express.json()); // requisição request.body jSON.
app.use(routes); // importando as rotas

app.listen(3333, () => {
    console.log('start')
}); //ouvir requisição http

