import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector } from 'react-redux';
import { addRequest, removeRequest } from '../utils/requestSlice';


const Request = () => {
    const dispatch = useDispatch();
    const request = useSelector((store) => store.request);
    

    const reviewRequest = async (status, _id) => {
        try {
            const res = await axios.post(BASE_URL + '/request/review/' + status + "/" + _id, {}, {
                withCredentials: true,
            });
            dispatch(removeRequest(_id));


        } catch (err) {
            console.error('Error :', err);
        }
    }

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

    if (!request) return;

    if (request.length === 0) {
        return (
            <div className='flex justify-center my-10'>
                <h1 className='text-bold text-2xl '>No Requests Found</h1>
            </div>
        )
    }


    return (
        <div className='text-center my-10'>
            <h1 className='text-bold text-white text-3xl '>Request</h1>
            {request.map((req) => {
                const { _id, firstName, lastName, photoUrl, age, gender, about } = req.fromUserId;
                return (
                    <div key={_id} className='flex justify-between items-center  m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto '>
                        <div><img alt="photo" className="w-25 h-20 rounded-full" src={photoUrl} /></div>
                        <div className='text-left mx-4'>
                            <h2 className='font-bold text-xl'>{firstName + " " + lastName}</h2>
                            {age && gender && (<p> {age + " " + gender}</p>)}
                            <p>{about}</p>
                        </div>
                        <div>
                            <button className="btn btn-primary mx-2" onClick={() => reviewRequest("rejected", req._id)}>Reject</button>
                            <button className="btn btn-secondary mx-2" onClick={() => reviewRequest("accepted", req._id)}>Accept</button>
                        </div>
                    </div>
                )
            })}
        </div>
    )
}

export default Request;