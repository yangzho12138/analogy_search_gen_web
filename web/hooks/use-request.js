import { useState } from 'react';
import axios from 'axios';

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async() => {
        try{
            setErrors(null);
            const response = await axios[method](url, body);
            console.log(response);
            if(onSuccess){
                onSuccess(response.data);
            }
            return response.data;
        }catch(err){
            console.log(err);
            setErrors(
                <div className="alert alert-danger">
                    <h4>Oops...</h4>
                    <ul className="my-0">
                        {err.response.data.errors.map(err => (
                            <li key={err}>{err}</li>
                        ))}
                    </ul>
                </div>
            );
        }
    }

    return { doRequest, errors };
}