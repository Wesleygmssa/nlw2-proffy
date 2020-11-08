export default function convertHourToMinutes(time: any) {

    // partinfo e fazendo a transformação em numeros e minutos
    const [hour, minutes] = time.split(':').map(Number);
    const timeInMinutes = (hour * 60) + minutes;
    return timeInMinutes;

}