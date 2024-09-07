import { useState } from 'react';
import axios from 'axios';

export default ({ url, method, body, onSuccess }) => {
    const [errors, setErrors] = useState(null);

    const doRequest = async(options = {}) => {
        const requestUrl = options.url || url;
        const requestBody = options.body || body;
        try{
            setErrors(null);
            let response;
            if(method === "get" || method === 'delete'){
                response = await axios[method](requestUrl, {
                    params: requestBody,
                    data: requestBody,
                    withCredentials: true
                });
            }else{
                response = await axios[method](requestUrl, requestBody, {
                    withCredentials: true
                });
            }
            // console.log(response);
            if(onSuccess){
                onSuccess(response.data);
            }
            return response.data;
        }catch(err){
            if(err && err.response && err.response.data && err.response.data.errors){
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
            } else {
                setErrors(
                    <div className="alert alert-danger">
                        <h4>Oops... Something went wrong</h4>
                        <h4>please contact the admin: analego2023@gmail.com</h4>
                    </div>
                );
            }
        }
    }

    return { doRequest, errors };
}