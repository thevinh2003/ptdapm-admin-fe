import NotFound from "../pages/404/404";
import LoginForm from "../components/Form/LoginForm";

export const publicRoutes = [
  {
    path: "*",
    layout: null,
    component: NotFound,
  },
  {
    path: "/login",
    layout: null,
    component: LoginForm,
  },
];
