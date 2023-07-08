import api from '../config/axios_config';

export const fazerLogin = (body) =>  {
  return api.post("/auth/login", body);
}

export const loginService = {
  fazerLogin
};