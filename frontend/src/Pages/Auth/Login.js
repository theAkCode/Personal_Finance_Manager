import { useCallback, useEffect, useState } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { loginAPI } from "../../utils/ApiRequest";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({ email: "", password: "" });

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
    const { email, password } = values;
    setLoading(true);

    const { data } = await axios.post(loginAPI, { email, password });

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/");
      toast.success(data.message, toastOptions);
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
              <h2 className="text-white">Login</h2>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formBasicEmail" className="mb-3">
                <Form.Label className="text-white">Email address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  name="email"
                  onChange={handleChange}
                  value={values.email}
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
                />
              </Form.Group>

              <div className="d-flex flex-column align-items-center">
                <Link to="/forgotPassword" className="text-white mb-3">
                  Forgot Password?
                </Link>

                <Button
                  type="submit"
                  className="w-100 btn btn-warning"
                  disabled={loading}
                >
                  {loading ? "Signing in…" : "Login"}
                </Button>

                <p className="mt-3 text-white">
                  Don't Have an Account?{" "}
                  <Link to="/register" className="text-warning">Register</Link>
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

export default Login;
