import React, { useEffect, useState, useRef, useContext } from 'react';
import { GET, POST } from '../api';
import { toast } from "react-hot-toast";
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const [firstName, setFirstName] = useState('');
  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const checkauth = await GET('/api/checkauth');
      if (checkauth.data?.caught) {
        toast.error(checkauth.data.message);
        navigate('/login');
      }

      try {
        const response = await GET('/api/user/userprofile/get');
        if (response.data.success === false) {
          console.log('Error:', response.data.message);
          return;
        }
        if (response.data?.caught) {
          navigate('/login'); return;
        }
        const { username, firstName, lastName, age, phoneNo, email, topics } = response.data.user;
        setUserName(username);
        setFirstName(firstName);
        setLastName(lastName);
        setAge(age);
        setPhoneNo(phoneNo);
        setEmail(email);
        setTopics(topics);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserProfile();
  }, [navigate]);

  const handleUpdateProfile = async () => {
    const updatedData = {
      username: userName,
      firstName,
      lastName,
      age,
      phoneNo,
      email,
      topics,
    };
    const response = await POST('/api/user/userprofile/update', updatedData);

    if (response.data.success) {
      toast.success(response.data.message);
    }
    else if (response.data?.caught) {
      navigate('/login'); return;
    }
  };

  return (
    <div>
      {/* User profile rendering code here */}
    </div>
  );
};

export default UserProfile;
