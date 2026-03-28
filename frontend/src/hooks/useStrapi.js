import {useState, useEffect} from 'react';
import {fetchStrapi} from '../services/api';

export function useStrapi (endpoint){
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    

    useEffect (()=>{
        fetchStrapi(endpoint).then(json => setData(json.data)).catch(err => setError(err.message)).finally(()=> setLoading(false));
    }, [endpoint]);
return {data, loading, error};
}