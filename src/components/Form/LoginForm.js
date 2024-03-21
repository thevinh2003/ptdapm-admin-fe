import React from "react";
import authAPI from "../../api/authAPI";
import { notification } from "antd";

const LoginForm = () => {
  const [api, contextHolder] = notification.useNotification();

  React.useEffect(() => {
    const adminForm = document.getElementById("admin_login");

    adminForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      const password = e.target.password.value;
      const data = {
        email,
        password,
      };
      const reponse = await authAPI.login(data);
      if (reponse?.message === "Login successfully") {
        window.location.href = "/";
      } else {
        api.error({
          message: (
            <h3 className="font-semibold text-red-600 text-[18px]">
              Thông báo
            </h3>
          ),
          duration: 0,
          description: (
            <span className="font-[450] text-[15px]">{reponse?.message}</span>
          ),
          placement: "topRight",
          key: "errorAuth",
        });
        setTimeout(() => {
          api.destroy();
        }, 2000);
      }
    });

    return () => {
      adminForm.removeEventListener("submit", (e) => {});
    };
  }, [api]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative p-5 sm:max-w-xl w-full sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div>
              <h1 className="text-2xl font-semibold">Login</h1>
            </div>
            <div className="divide-y divide-gray-200">
              <form
                id="admin_login"
                className="py-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7"
              >
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="email"
                    name="email"
                    type="text"
                    required={true}
                    className="peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600 border-none"
                    placeholder="Email address"
                  />
                  <label
                    htmlFor="email"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Email Address
                  </label>
                </div>
                <div className="relative">
                  <input
                    autoComplete="off"
                    id="password"
                    name="password"
                    type="password"
                    required={true}
                    className="border-none peer placeholder-transparent h-10 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                    placeholder="Password"
                  />
                  <label
                    htmlFor="password"
                    className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm"
                  >
                    Password
                  </label>
                </div>
                <div className="relative">
                  <button
                    type="submit"
                    className="border-none bg-cyan-500 text-white rounded-md px-3 py-1 hover:opacity-80 transition-all duration-300"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      {contextHolder}
    </div>
  );
};

export default LoginForm;
