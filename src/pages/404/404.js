import { NavLink, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-gray-100">
      <div className="flex flex-col items-center">
        <h1 className="text-[120px] font-extrabold text-gray-700">404</h1>
        <p className="text-2xl font-medium text-gray-600 mb-6">
          Đường dẫn không hợp lệ
        </p>
        <NavLink
          onClick={handleBack}
          className="px-4 py-2 font-medium text-white bg-indigo-500 rounded-md hover:bg-indigo-600 no-underline transition-all duration-200 ease-in-out"
        >
          Quay lại
        </NavLink>
      </div>
    </div>
  );
};

export default NotFound;
