import React, { useEffect, useState, useRef, useContext } from 'react';
import { Button, Form, Container, Row, Col, Image, Badge, Modal } from 'react-bootstrap';
import { FaTimes } from 'react-icons/fa';
import { GET, POST } from '../api';
import { toast } from "react-hot-toast";
import ResetPassword from '../components/ResetPassword';
import { ThemeContext } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const UserProfile = () => {
  const { mode } = useContext(ThemeContext);
  const [firstName, setFirstName] = useState('');
  const [userName, setUserName] = useState('');
  const [lastName, setLastName] = useState('');
  const [age, setAge] = useState('');
  const [phoneNo, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [topics, setTopics] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {


    const fetchUserProfile = async () => {

      const checkauth = await GET('/api/checkauth');
      if (checkauth.data?.caught) {
        toast.error(checkauth.data?.message);
        navigate('/login');
      }

      try {
        const response = await GET('/api/user/userprofile/get');
        if (response.data?.success === false) {
          console.log('Error:', response.data?.message);
          return;
        }
        if (response.data?.caught) {
          // toast.error(response.data?.message);
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

  const handleAddTopic = () => {
    if (inputValue.trim() !== '') {
      setTopics([...topics, inputValue.trim()]);
      setInputValue('');
      inputRef.current.focus();
    }
  };

  const handleRemoveTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

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

    if (response.data?.success) {
      toast.success(response.data?.message);
    }
    else if (response.data?.caught) {
      // toast.error(response.data?.message);
      navigate('/login'); return;
    }
  };

  return (
    <div style={{
      marginTop: "150px",
      animation: "fadeIn 0.5s ease"
    }}>
      <div style={{
        textAlign: "center",
        marginBottom: "2rem"
      }}>
        <Image
          src="https://1.bp.blogspot.com/-4XH4gYWBqkc/X_fjW3OyqKI/AAAAAAAAFaY/Tg3RZ4lICOIwmliLKBcGkVSkpk0hdH-wwCLcBGAsYHQ/s1200/News.jpg"
          roundedCircle
          style={{
            width: "150px",
            height: "150px",
            border: `4px solid ${mode === 'dark' ? '#2c2c2c' : 'white'}`,
            boxShadow: mode === 'dark' ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.15)',
            transition: "transform 0.3s ease"
          }}
          alt="Profile"
        />
      </div>

      <Container style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "2rem",
        background: mode === 'dark' ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        boxShadow: mode === 'dark' ? '0 8px 32px rgba(0, 0, 0, 0.3)' : '0 8px 32px rgba(0, 0, 0, 0.1)',
        borderRadius: "20px",
        backdropFilter: "blur(10px)",
        border: `1px solid ${mode === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.2)'}`,
        transition: "transform 0.3s ease, background-color 0.3s ease"
      }}>

        <Form>
          <Form.Group style={{ marginBottom: "1.5rem" }}>
            <Form.Label style={{
              fontWeight: 600,
              color: mode === 'dark' ? '#e0e0e0' : '#2c3e50',
              marginBottom: "0.5rem",
              fontSize: "1.1rem"
            }}>
              User Name
            </Form.Label>
            <Form.Control
              type="text"
              placeholder="User name"
              value={userName}
              readOnly
              onChange={(e) => setUserName(e.target.value)}
              style={{
                borderRadius: "10px",
                border: `1px solid ${mode === 'dark' ? '#404040' : '#e0e0e0'}`,
                padding: "0.75rem 1rem",
                background: mode === 'dark' ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                color: mode === 'dark' ? '#ffffff' : '#000000'
              }}
            />
          </Form.Group>

          <Row style={{ marginBottom: "1.5rem" }}>
            <Col>
              <Form.Group>
                <Form.Label style={{
                  fontWeight: 600,
                  color: mode === 'dark' ? '#e0e0e0' : '#2c3e50',
                  marginBottom: "0.5rem",
                  fontSize: "1.1rem"
                }}>
                  First Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    border: `1px solid ${mode === 'dark' ? '#404040' : '#e0e0e0'}`,
                    padding: "0.75rem 1rem",
                    background: mode === 'dark' ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: mode === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label style={{
                  fontWeight: 600,
                  color: mode === 'dark' ? '#e0e0e0' : '#2c3e50',
                  marginBottom: "0.5rem",
                  fontSize: "1.1rem"
                }}>
                  Age
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    border: `1px solid ${mode === 'dark' ? '#404040' : '#e0e0e0'}`,
                    padding: "0.75rem 1rem",
                    background: mode === 'dark' ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: mode === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row style={{ marginBottom: "1.5rem" }}>
            <Col>
              <Form.Group controlId="formLastName">
                <Form.Label
                  style={
                    {
                      fontWeight: 600,
                      color: mode === 'dark' ? '#e0e0e0' : '#2c3e50',
                      marginBottom: "0.5rem",
                      fontSize: "1.1rem"
                    }
                  } >Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    border: `1px solid ${mode === 'dark' ? '#404040' : '#e0e0e0'}`,
                    padding: "0.75rem 1rem",
                    background: mode === 'dark' ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: mode === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </Form.Group>
            </Col>

            <Col>
              <Form.Group controlId="formPhone">
                <Form.Label
                  style={
                    {
                      fontWeight: 600,
                      color: mode === 'dark' ? '#e0e0e0' : '#2c3e50',
                      marginBottom: "0.5rem",
                      fontSize: "1.1rem"
                    }
                  } >Phone No.</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="phone number"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                  style={{
                    borderRadius: "10px",
                    border: `1px solid ${mode === 'dark' ? '#404040' : '#e0e0e0'}`,
                    padding: "0.75rem 1rem",
                    background: mode === 'dark' ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                    color: mode === 'dark' ? '#ffffff' : '#000000'
                  }}
                />
              </Form.Group>

            </Col>
          </Row>


          <Form.Group controlId="formEmail" style={{ marginBottom: "1.5rem" }}>
            <Form.Label
              style={
                {
                  fontWeight: 600,
                  color: mode === 'dark' ? '#e0e0e0' : '#2c3e50',
                  marginBottom: "0.5rem",
                  fontSize: "1.1rem"
                }
              }>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="email"
              value={email}
              readOnly
              style={{
                borderRadius: "10px",
                border: `1px solid ${mode === 'dark' ? '#404040' : '#e0e0e0'}`,
                padding: "0.75rem 1rem",
                background: mode === 'dark' ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                color: mode === 'dark' ? '#ffffff' : '#000000'
              }}
            />
          </Form.Group>

          <div style={{ marginBottom: "1.5rem" }}>
            <Form.Label style={{
              fontWeight: 600,
              color: mode === 'dark' ? '#e0e0e0' : '#2c3e50',
              marginBottom: "0.5rem",
              fontSize: "1.1rem"
            }}>
              Topics
            </Form.Label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Form.Control
                type="text"
                placeholder="topics of interest"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                ref={inputRef}
                style={{
                  flex: 1,
                  borderRadius: "10px",
                  border: `1px solid ${mode === 'dark' ? '#404040' : '#e0e0e0'}`,
                  padding: "0.75rem 1rem",
                  background: mode === 'dark' ? 'rgba(45, 45, 45, 0.9)' : 'rgba(255, 255, 255, 0.9)',
                  color: mode === 'dark' ? '#ffffff' : '#000000'
                }}
              />
              <Button
                onClick={handleAddTopic}
                style={{
                  padding: "0.75rem 2rem",
                  borderRadius: "50px",
                  background: mode === 'dark' ? 'linear-gradient(45deg, #0056b3, #003d80)' : 'linear-gradient(45deg, #007bff, #0056b3)',
                  border: "none",
                  boxShadow: mode === 'dark' ? '0 4px 15px rgba(0, 86, 179, 0.3)' : '0 4px 15px rgba(0, 123, 255, 0.2)',
                  fontWeight: 600,
                  letterSpacing: "0.5px",
                  transition: "all 0.3s ease"
                }}
              >
                Add
              </Button>
            </div>
            <div style={{ marginTop: "10px", display: "flex", flexWrap: "wrap", gap: "5px" }}>
              {topics?.map((topic, index) => (
                <Badge
                  key={index}
                  pill
                  style={{
                    padding: "0.5rem 1rem",
                    background: mode === 'dark' ? '#4a4a4a' : '#6c757d',
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s ease"
                  }}
                >
                  {topic}
                  <FaTimes
                    onClick={() => handleRemoveTopic(index)}
                    style={{ cursor: 'pointer' }}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
            marginTop: "2rem"
          }}>
            <Button
              onClick={handleUpdateProfile}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "50px",
                background: mode === 'dark' ? 'linear-gradient(45deg, #1a7531, #158765)' : 'linear-gradient(45deg, #28a745, #20c997)',
                border: "none",
                boxShadow: mode === 'dark' ? '0 4px 15px rgba(26, 117, 49, 0.3)' : '0 4px 15px rgba(40, 167, 69, 0.2)',
                fontWeight: 600,
                letterSpacing: "0.5px",
                transition: "all 0.3s ease"
              }}
            >
              Update Profile
            </Button>
            <Button
              onClick={() => setShowModal(true)}
              style={{
                padding: "0.75rem 2rem",
                borderRadius: "50px",
                background: mode === 'dark' ? 'linear-gradient(45deg, #a82632, #c94f5c)' : 'linear-gradient(45deg, #dc3545, #f86778)',
                border: "none",
                boxShadow: mode === 'dark' ? '0 4px 15px rgba(168, 38, 50, 0.3)' : '0 4px 15px rgba(220, 53, 69, 0.2)',
                fontWeight: 600,
                letterSpacing: "0.5px",
                transition: "all 0.3s ease"
              }}
            >
              Change Password
            </Button>
          </div>
        </Form>
      </Container>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <ResetPassword setShowModal={setShowModal} />
      </Modal>
    </div>
  );
};

export default UserProfile;