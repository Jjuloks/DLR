const BASE_URL = '/api'; //proxy przez Vite
 
    export async function fetchStrapi(endpoint){
        const res = await fetch(`${BASE_URL}/${endpoint}?populate=*`);
        if (!res.ok) throw new Error(`Błąd API : ${res.status}`);
        return res.json();
    }