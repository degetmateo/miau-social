import { VIEWS } from './views.js';
export const APP_CONTAINER = document.getElementById('app');

export function navigateTo (view, data) {
    history.pushState({ view }, view, `${view}`);
    render(view, data);
}
 
export function render (view, data) {
    VIEWS[view](data);
}

export function getDateMessage (_parsedTimeUnits) {
    let made_at = '';

    const years = _parsedTimeUnits.years;
    const months = _parsedTimeUnits.months;
    const days = _parsedTimeUnits.days;
    const hours = _parsedTimeUnits.hours;
    const minutes = _parsedTimeUnits.minutes;
    const seconds = _parsedTimeUnits.seconds;

    if (years > 0) {
        years === 1 ? 
            made_at = `hace ${years} año` :
            made_at = `hace ${years} años`;
    }
    else if (months > 0) {
        months === 1 ? 
            made_at = `hace ${months} mes` :
            made_at = `hace ${months} meses`;
    }
    else if (days > 0) {
        days === 1 ? 
            made_at = `hace ${days} día` :
            made_at = `hace ${days} días`;
    } else if (hours > 0) {
        hours === 1 ?
            made_at = `hace ${hours} hora` :
            made_at = `hace ${hours} horas`;
    } else if (minutes > 0) {
        minutes === 1 ?
            made_at = `hace ${minutes} minuto` :
            made_at = `hace ${minutes} minutos`; 
    } else if (seconds > 0) {
        seconds === 1 ?
            made_at = `hace ${seconds} segundo` :
            made_at = `hace ${seconds} segundos`;
    } else {
        made_at = 'ahora'
    }

    return made_at;
}