import axios from 'axios';
import React, { useEffect } from 'react'
import { BASE_URL } from '../utils/constants';
import { useSelector, useDispatch } from 'react-redux';
import { addConnection } from '../utils/connectionSlice';
import { Link } from 'react-router-dom';


const Connections = () => {
    const dispatch = useDispatch();
    const connections = useSelector((store) => store.connection);

    const fetchConnections = async () => {
        try {
            const res = await axios.get(BASE_URL + '/user/connections', {
                withCredentials: true,
            });

            dispatch(addConnection(res?.data?.data))

        } catch (err) {
            console.error('Error :', err);
        }
    };
    useEffect(() => {
        fetchConnections();
    }, []);

    if (!connections) return;

    if (connections.length === 0) {
        return (
            <div className='flex justify-center my-10'>
                <h1 className='text-bold text-2xl '>No Connections Found</h1>
            </div>
        )
    }


    return (
        <div className='text-center my-10'>
            <h1 className='text-bold text-white text-3xl '>Connections</h1>
            {connections.map((connection) => {
                const { _id, firstName, lastName, photoUrl, age, gender, about } = connection;
                return (
                    <div key={_id} className='flex justify-between m-4 p-4 rounded-lg bg-base-300 w-1/2 mx-auto '>
                        <div><img alt="photo" className="w-25 h-20 rounded-full" src={photoUrl} /></div>
                        <div className='text-left mx-4'>
                            <h2 className='font-bold text-xl'>{firstName + " " + lastName}</h2>
                            {age && gender && (<p> {age + " " + gender}</p>)}
                            <p>{about}</p>
                        </div>
                        <Link to={"/chat/" + _id}><button className='btn btn-primary mt-2'>Chat</button></Link>
                    </div>
                )
            })}
        </div>
    )
}

export default Connections;