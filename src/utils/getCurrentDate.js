// Genera un date personalizada para tener el formato deseado
const getCurrentDate = async () => {
    let date = new Date();

    let hour = fechaActual.getHours();
    let minutes = fechaActual.getMinutes();
    let seconds = fechaActual.getSeconds();

    let currentDate = `${hour}:${minutes}:${seconds}`;
    console.log(currentDate)
    return currentDate
}

module.exports = { getCurrentDate }