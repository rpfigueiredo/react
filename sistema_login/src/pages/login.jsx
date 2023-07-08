import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import CentralizarElementos from "../components/centralizar_elementos";
import CentralizarHorizontalmente from "../components/centralizar_horizontalmente";

import "../styles/login.css";

import { loginService } from "../services/login_service";

import { useNavigate  } from "react-router-dom"

export default function Login() {
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [emailError, setEmailError] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [errorMessage, setErrorMessage] = React.useState("");

  const navigate = useNavigate();

  const validateEmail = () => {
    if (!email) {
      setEmailError("O campo de e-mail é obrigatório.");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Digite um endereço de e-mail válido.");
    } else {
      setEmailError("");
    }
  };

  const validatePassword = () => {
    if (!senha) {
      setPasswordError("O campo de senha é obrigatório.");
    } else {
      setPasswordError("");
    }
  };

  const temErroOuCampoVazio = () => {
    return Boolean(passwordError) || Boolean(emailError) || !email || !senha;
  }

  const validateFields = () => {
    validateEmail();
    validatePassword();
  };

  const handleLogin = () => {
    // Chamar o serviço de login e tratar o erro 401

    validateFields();

    if (temErroOuCampoVazio()) {
      return;
    }

    let userName = email;
    let password = senha;
    let roles = [{ roleName: "ROLE_ATENDENTE" }];
    let body = { userName, password, roles };
    loginService
      .fazerLogin(body)
      .then((resp) => {
        const {tokenJwt, roles} = resp.data;

        localStorage.setItem("token", tokenJwt);
        localStorage.setItem("roles", JSON.stringify(roles));
        
        navigate("/home");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          setErrorMessage("Usuário ou senha incorretos.");
        }
      });
  };

  return (
    <CentralizarElementos>
      <Card sx={{ minWidth: 275, maxWidth: 800, padding: 2, width: 300 }}>
        <CardContent>
          <CentralizarHorizontalmente>
            <TextField
              id="standard-basic"
              label="e-mail"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
              error={Boolean(emailError)}
              helperText={emailError}
            />
          </CentralizarHorizontalmente>
          <CentralizarHorizontalmente>
            <TextField
              id="standard-password-input"
              label="senha"
              type="password"
              autoComplete="current-password"
              variant="standard"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onBlur={validatePassword}
              error={Boolean(passwordError)}
              helperText={passwordError}
            />
          </CentralizarHorizontalmente>
          <CentralizarHorizontalmente>
            {errorMessage && (
              <Typography sx={{ color: "red", mt: 1, fontSize: 14 }}>
                {errorMessage}
              </Typography>
            )}
          </CentralizarHorizontalmente>
        </CardContent>

        <CentralizarHorizontalmente>
          <Button
            onClick={handleLogin}
            variant="contained"
            sx={{ marginBottom: 2 }}
          >
            ENTRAR
          </Button>
        </CentralizarHorizontalmente>
      </Card>
    </CentralizarElementos>
  );
}
