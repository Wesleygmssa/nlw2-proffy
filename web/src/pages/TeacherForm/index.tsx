import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Input from '../../components/Input';
import PageHeader from '../../components/PageHeader';
import warningIcon from '../../assets/images/icons/warning.svg'
import Textarea from '../../components/Textarea';
import Select from '../../components/Select';

import './styles.css'
import api from '../../services/api';

function TeacherForm() {
    const history = useHistory();

    //estados anotando cada valor no input
    const [name, setName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [bio, setBio] = useState('');


    const [subject, setSubject] = useState('');
    const [cost, setCost] = useState('');


    //variavel de estado
    const [scheduleItems, setScheduleItems] = useState([
        { week_day: 0, from: '', to: '' }

    ]);
    /* ------------------------------------------------- */

    /*---------------- functions------------------------- */
    function addNewScheduleItem() {
        setScheduleItems([
            ...scheduleItems,
            { week_day: 0, from: '', to: '' }
        ]);


    }

    //looper dentro do outro
    function setScheduleItemValue(position: number, field: string, value: string) {
        //percorrendo o array // criando um array com as novas alterações que eu quero
        const updateScheduleItem = scheduleItems.map((scheduleItem, index) => {
            if (index === position) {
                return { ...scheduleItem, [field]: value };
            }

            return scheduleItem;
        });

        // console.log(updateScheduleItem);
        setScheduleItems(updateScheduleItem);
    }

    //function de submit do form
    function handleCreateClass(e: FormEvent) {
        e.preventDefault();

        api.post('classes', {
            name,
            avatar,
            whatsapp,
            bio,
            subject,
            cost: Number(cost),
            schedule: scheduleItems
        }).then(() => {

            alert('Cadstro realizado com sucesso'); //alerta de mensagem

            history.push('/'); //rota direcinamento

        }).catch(() => {

            alert('Erro no cadastro'); //alerta de mensagem
        });

        // console.log({
        //     name,
        //     avatar,
        //     whatsapp,
        //     bio,
        //     subject,
        //     cost,
        //     scheduleItems
        // });
    }

    /* -------------------------------------------------------------------------- */

    return (
        <div id="page-teacher-form" className="container">
            <PageHeader
                title="Que incrível que você que da aulas. "
                description="O primeiro é passo é preencher esse formulário de inscrição"
            />
            <main>
                <form onSubmit={handleCreateClass}>
                    <fieldset>
                        <legend>Seus dados</legend>

                        <Input
                            name="name"
                            label="Nome completo"
                            //valor do input
                            value={name}
                            //valor digitado pela pessoa
                            onChange={(e) => { setName(e.target.value) }}
                        />

                        <Input
                            name="avatar"
                            label="Avatar"
                            value={avatar}
                            onChange={(e) => { setAvatar(e.target.value) }}
                        />

                        <Input
                            name="whatsapp"
                            label="Whatsapp"
                            value={whatsapp}
                            onChange={(e) => { setWhatsapp(e.target.value) }}
                        />

                        <Textarea
                            name="bio"
                            label="Biografia"
                            value={bio}
                            onChange={(e) => { setBio(e.target.value) }}
                        />

                    </fieldset>

                    <fieldset>
                        <legend>Sobre a aula</legend>

                        <Select
                            name="subject"
                            label="Matéria"
                            value={subject}
                            onChange={(e) => { setSubject(e.target.value) }}
                            options={[
                                { value: 'Artes', label: 'Artes' },
                                { value: 'Biologia', label: 'Biologia' },
                                { value: 'Ciência', label: 'Ciência' },
                                { value: 'Educação fisica', label: 'Educação fisica' },
                                { value: 'Física', label: 'Física' },
                                { value: 'Geografia', label: 'Geografia' },
                                { value: 'História', label: 'História' },
                                { value: 'Matemática', label: 'Matemática' },
                                { value: 'Português', label: 'Português' },
                                { value: 'Química', label: 'Química' }
                            ]}
                        />

                        <Input
                            name="cost"
                            label="Custo da sua hora por aula"
                            value={cost}
                            onChange={(e) => { setCost(e.target.value) }}
                        />

                    </fieldset>

                    <fieldset>
                        <legend>Horários disponíveis

                    <button type="button" onClick={addNewScheduleItem}>
                                + Novo horário
                    </button>
                        </legend>

                        {/* mao retorna item e index */}
                        {scheduleItems.map((scheduleItem, index) => {
                            return (

                                <div key={scheduleItem.week_day} className="schedule-item">
                                    <Select name="week_day"
                                        label="Dia da semana"
                                        value={scheduleItem.week_day}
                                        //index, nome do campo, valor do campo
                                        onChange={e => setScheduleItemValue(index, 'week_day', e.target.value)}

                                        options={[
                                            { value: '0', label: 'Domingo' },
                                            { value: '1', label: 'Segunda-Feira' },
                                            { value: '2', label: 'Terça-feria' },
                                            { value: '3', label: 'Quarta-feira' },
                                            { value: '4', label: 'Quinta-feira' },
                                            { value: '5', label: 'Sexta-feira' },
                                            { value: '6', label: 'Sabado' },
                                        ]}
                                    />

                                    <Input
                                        name="from"
                                        label="Das"
                                        type="time"
                                        value={scheduleItem.from}
                                        onChange={e => setScheduleItemValue(index, 'from', e.target.value)}
                                    />

                                    <Input
                                        name="to"
                                        label="Até"
                                        type="time"
                                        value={scheduleItem.to}
                                        onChange={e => setScheduleItemValue(index, 'to', e.target.value)}
                                    />

                                </div>
                            )
                        })}
                    </fieldset>

                    <footer>
                        <p>
                            <img src={warningIcon} alt="Aviso importante" />
                        Importante! <br />
                        Preencha todos os dados
                    </p>
                        <button type="submit">Salvar cadastro</button>
                    </footer>
                </form>
            </main>
        </div>
    )
}

export default TeacherForm;