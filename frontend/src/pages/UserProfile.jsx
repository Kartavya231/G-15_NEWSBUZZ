import React, { useState, useRef, useContext } from "react";
import {
  Button,
  Form,
  Container,
  Row,
  Col,
  Image,
  Badge,
  Modal,
} from "react-bootstrap";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-hot-toast";
import ResetPassword from "../components/ResetPassword";
import { ThemeContext } from "../context/ThemeContext";

const UserProfile = () => {
  const { mode } = useContext(ThemeContext);
  const [firstName, setFirstName] = useState("");
  const [userName, setUserName] = useState("");
  const [lastName, setLastName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [topics, setTopics] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef(null);

  const handleAddTopic = () => {
    if (inputValue.trim() !== "") {
      setTopics([...topics, inputValue.trim()]);
      setInputValue("");
      inputRef.current.focus();
    }
  };

  const handleRemoveTopic = (index) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleUpdateProfile = () => {
    // Simulating an update action with a success toast
    toast.success("Profile updated successfully!");
  };

  return (
    <div
      style={{
        marginTop: "150px",
        animation: "fadeIn 0.5s ease",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "2rem",
        }}
      >
        <Image
          src="https://1.bp.blogspot.com/-4XH4gYWBqkc/X_fjW3OyqKI/AAAAAAAAFaY/Tg3RZ4lICOIwmliLKBcGkVSkpk0hdH-wwCLcBGAsYHQ/s1200/News.jpg"
          roundedCircle
          style={{
            width: "150px",
            height: "150px",
            border: `4px solid ${mode === "dark" ? "#2c2c2c" : "white"}`,
            boxShadow:
              mode === "dark"
                ? "0 4px 12px rgba(0, 0, 0, 0.3)"
                : "0 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "transform 0.3s ease",
          }}
          alt="Profile"
        />
      </div>

      <Container
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "2rem",
          background:
            mode === "dark"
              ? "rgba(30, 30, 30, 0.95)"
              : "rgba(255, 255, 255, 0.95)",
          boxShadow:
            mode === "dark"
              ? "0 8px 32px rgba(0, 0, 0, 0.3)"
              : "0 8px 32px rgba(0, 0, 0, 0.1)",
          borderRadius: "20px",
          backdropFilter: "blur(10px)",
          border: `1px solid ${
            mode === "dark"
              ? "rgba(255, 255, 255, 0.1)"
              : "rgba(255, 255, 255, 0.2)"
          }`,
          transition: "transform 0.3s ease, background-color 0.3s ease",
        }}
      >
        <Form>
          {/* User Profile Fields */}
          <Form.Group style={{ marginBottom: "1.5rem" }}>
            <Form.Label>User Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter User name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Age</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Enter age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group>
                <Form.Label>Phone No.</Form.Label>
                <Form.Control
                  type="tel"
                  placeholder="Enter phone number"
                  value={phoneNo}
                  onChange={(e) => setPhoneNo(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>

          <Form.Group style={{ marginBottom: "1.5rem" }}>
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              readOnly
            />
          </Form.Group>

          {/* Topics of Interest */}
          <Form.Group style={{ marginBottom: "1.5rem" }}>
            <Form.Label>Topics</Form.Label>
            <div style={{ display: "flex", gap: "10px" }}>
              <Form.Control
                type="text"
                placeholder="Enter topics of interest"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                ref={inputRef}
              />
              <Button onClick={handleAddTopic}>Add</Button>
            </div>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                flexWrap: "wrap",
                gap: "5px",
              }}
            >
              {topics.map((topic, index) => (
                <Badge key={index} pill>
                  {topic}
                  <FaTimes
                    onClick={() => handleRemoveTopic(index)}
                    style={{ cursor: "pointer", marginLeft: "5px" }}
                  />
                </Badge>
              ))}
            </div>
          </Form.Group>

          <div style={{ textAlign: "center" }}>
            <Button
              onClick={handleUpdateProfile}
              style={{ marginRight: "10px" }}
            >
              Update Profile
            </Button>
            <Button onClick={() => setShowModal(true)}>Change Password</Button>
          </div>
        </Form>
      </Container>

      {/* Change Password Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <ResetPassword setShowModal={setShowModal} />
      </Modal>
    </div>
  );
};

export default UserProfile;