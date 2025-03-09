import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerAPI } from "../../utils/ApiRequest";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [values, setValues] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);

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
    setLoading(true);
    const { name, email, password } = values;

    const { data } = await axios.post(registerAPI, { name, email, password });

    if (data.success) {
      delete data.user.password;
      localStorage.setItem("user", JSON.stringify(data.user));
      toast.success(data.message, toastOptions);
      navigate("/");
    } else {
      toast.error(data.message, toastOptions);
    }
    setLoading(false);
  };

  const particlesInit = useCallback(async (engine) => {
    await loadFull(engine);
  }, []);

  return (
    <div className="position-relative overflow-hidden bg-dark vh-100 d-flex align-items-center justify-content-center">
      <Particles
        id="tsparticles"
        init={particlesInit}
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
        className="position-absolute w-100 h-100"
      />
      <Container className="position-relative">
        <Row className="justify-content-center">
          <Col md={6} lg={4} className="bg-secondary p-4 rounded shadow">
            <div className="text-center mb-4">
              <AccountBalanceWalletIcon sx={{ fontSize: 40, color: "white" }} />
              <h2 className="text-white">Signup</h2>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicName" className="mb-3">
                <Form.Label className="text-white">Full Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  placeholder="Full name"
                  value={values.name}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={values.email}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group controlId="formBasicPassword" className="mb-3">
                <Form.Label className="text-white">Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={values.password}
                  onChange={handleChange}
                />
              </Form.Group>

              <div className="d-flex flex-column align-items-center">
                <Link to="/forgotPassword" className="text-white mb-3">
                  Forgot Password?
                </Link>

                <Button type="submit" className="w-100 btn btn-warning" disabled={loading}>
                  {loading ? "Registering..." : "Signup"}
                </Button>

                <p className="mt-3 text-white">
                  Already have an account?{" "}
                  <Link to="/login" className="text-warning">Login</Link>
                </p>
              </div>
            </Form>
          </Col>
        </Row>
        <ToastContainer />
      </Container>
    </div>
  );
};

export default Register;
