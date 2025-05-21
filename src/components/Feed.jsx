import React from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { useDispatch, useSelector} from 'react-redux';
import { addFeed } from '../utils/feedSlice';
import UserCard from './UserCard';



const Feed = () => {
  const dispatch = useDispatch();
  const feedData = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feedData) return;
    try {
      const res = await axios.get(BASE_URL + "/user/feed", {
        withCredentials: true,
      });
      dispatch(addFeed(res?.data?.data));
    } catch (err) {
      console.error('Error :', err);
    }
  }

  useEffect(() => {
    getFeed();
  }, []);

  if(!feedData) return;

  if (feedData.length <= 0) {
    return (
      <div className='flex justify-center my-10'>
        <h1 className='text-bold text-2xl '>No new users found!</h1>
      </div>
    )
  }

  return (
    feedData && (<div className='flex justify-center my-10'>
      <UserCard user={feedData[0]} />
    </div>)
  )
}

export default Feed;