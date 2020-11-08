import { Response, Request } from 'express'
import db from '../database/connection';
import convertHourToMinutes from '../utils/convertHourToMinutes';

interface ScheduleItem {
    week_day: number;
    from: string;
    to: string;
}

export default class classesController {

    //puxando dados do banco de dados
    async index(request: Request, response: Response) {
        const filters = request.query;

        const subject = filters.subject as string;
        const week_day = filters.week_day as string;
        const time = filters.time as string;

        if (!filters.week_day || !filters.subject || !filters.time) {

            return response.status(400).json({
                error: 'Missing filters to search classes'
            })
        }

        const timeInMinutes = convertHourToMinutes(time);

        //retornando materia // filtros
        const classes = await db('classes')
            .whereExists(function () {
                this.select('class_schedule.*')
                    .from('class_schedule')
                    .whereRaw('`class_schedule`. `class_id` = `classes`.`id`')
                    .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
                    .whereRaw('`class_schedule`.`from` <= ??', [timeInMinutes])
                    .whereRaw('`class_schedule`.`to` > ??', [timeInMinutes])
            })

            //relacinamentos
            .where('classes.subject', '=', subject)
            .join('users', 'classes.user_id', '=', 'users.id')
            .select(['classes.*', 'users.*'])

        response.json(classes);
    }

    async create(request: Request, response: Response) {
        const {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost,
            schedule

        } = request.body;

        const trx = await db.transaction();// executando tudo de uma só vez

        try {

            // utilzando a rota de classes e salvando no banco db. // retornando o id em array
            const insertUsersIds = await trx('users').insert({
                name,
                avatar,
                whatsapp,
                bio
            });

            // console.log(insertUsersIds)

            // retornando o id 
            const user_id = insertUsersIds[0]

            // salvando na tabela de classe // retorna o id em array
            const inserttedClassesIds = await trx('classes').insert({
                subject,
                cost,
                user_id,
            });

            const class_id = inserttedClassesIds[0];

            const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {

                return {
                    class_id,
                    week_day: scheduleItem.week_day,
                    from: convertHourToMinutes(scheduleItem.from),
                    to: convertHourToMinutes(scheduleItem.to)
                }
            })

            await trx('class_schedule').insert(classSchedule);

            await trx.commit(); // inserindo tudo ao mesmo tempo

            return response.status(201).send(); // criado com sucesso

        } catch (err) {

            await trx.rollback();

            return response.status(400).json({

                error: 'Unexpected error while creating new class'
            })
        }

    }
}