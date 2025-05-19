import React, { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest } from '../utils/requestSlice';


const Request = () => {
    const dispatch = useDispatch();
    const request = useSelector((store) => store.request);
    const fetchRequest = async () => {
        try {
            const res = await axios.get(BASE_URL + '/user/requests/received', {
                withCredentials: true,
            });

            dispatch(addRequest(res?.data?.data));
        }
        catch (err) {
            console.error('Error :', err);
        }

    };

    useEffect(() => {
        fetchRequest();
    }, []);

    return (
        <div>
            <h1>Request</h1>
        </div>
    )
}

export default Request;