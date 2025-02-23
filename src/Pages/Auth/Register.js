// RegisterPage.js
import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { registerAPI } from "../../utils/ApiRequest";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const toastOptions = {
    position: "bottom-right",
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "dark",
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match!", toastOptions);
      return;
    }

    setLoading(true);

    const { data } = await axios.post(registerAPI, { email, password });

    if (data.success === true) {
      navigate("/login");
      toast.success(data.message, toastOptions);
      setLoading(false);
    } else {
      toast.error(data.message, toastOptions);
      setLoading(false);
    }
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async (container) => {
  }, []);

  return (
    <div style={{ position: "relative", overflow: "hidden", height: "100vh" }}>
      {/* Background particles */}
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: { color: { value: "#000" } },
          fpsLimit: 60,
          particles: {
            number: { value: 200, density: { enable: true, value_area: 800 } },
            color: { value: "#ffcc00" },
            shape: { type: "circle" },
            opacity: { value: 0.5, random: true },
            size: { value: 3, random: { enable: true, minimumValue: 1 } },
            links: { enable: false },
            move: { enable: true, speed: 2 },
          },
          detectRetina: true,
        }}
        style={{
          position: "absolute",
          zIndex: -1,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />

      {/* Form Container */}
      <Container
        className="mt-5"
        style={{
          position: "relative",
          zIndex: 2,
          maxWidth: "500px",
          backgroundColor: "rgba(0, 0, 0, 0.7)", // Add a subtle dark background to the form
          borderRadius: "10px",
          padding: "30px",
        }}
      >
        <Row>
          <Col>
            <div className="text-center">
              <h1 style={{ color: "#ffcc00" }}>
                <AccountBalanceWalletIcon sx={{ fontSize: 50 }} />
              </h1>
              <h2 className="text-white mb-4">Register</h2>
            </div>

            {/* Form */}
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
                  required
                  style={{
                    backgroundColor: "#333",
                    color: "white",
                    border: "1px solid #444",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={handleChange}
                  value={values.password}
                  required
                  style={{
                    backgroundColor: "#333",
                    color: "white",
                    border: "1px solid #444",
                  }}
                />
              </Form.Group>

              <Form.Group controlId="formConfirmPassword" className="mb-3">
                <Form.Label className="text-white">Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  onChange={handleChange}
                  value={values.confirmPassword}
                  required
                  style={{
                    backgroundColor: "#333",
                    color: "white",
                    border: "1px solid #444",
                  }}
                />
              </Form.Group>

              {/* Buttons and Links */}
              <div className="d-flex justify-content-center flex-column align-items-center">
                <Button
                  type="submit"
                  className="btn btn-warning w-100"
                  disabled={loading}
                  style={{ padding: "12px 0", fontSize: "16px", marginBottom: "15px" }}
                >
                  {loading ? "Registering..." : "Register"}
                </Button>

                <p className="text-white">
                  Already have an account?{" "}
                  <Link to="/login" className="text-warning">
                    Login
                  </Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
      </Container>

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};

export default Register;
