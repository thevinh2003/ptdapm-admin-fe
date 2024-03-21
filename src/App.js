import React, { Suspense } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import Cookies from "js-cookie";
import { publicRoutes, privateRoutes } from "./router";
import DefaultLayout from "./layout/DefaultLayout";
import Loading from "./components/Loading/Loading";

function App() {
  const deviceID = Cookies.get("_fr_device");
  console.log("deviceID", deviceID);

  return (
    <div className="app">
      <Router>
        <Suspense fallback={<Loading />}>
          <Routes>
            {publicRoutes.map((route, index) => {
              let Layout = DefaultLayout;
              if (route.layout === null) {
                Layout = React.Fragment;
              } else if (route.layout) {
                Layout = route.layout;
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    <Layout>
                      <route.component />
                    </Layout>
                  }
                />
              );
            })}
            {privateRoutes.map((route, index) => {
              let Layout = DefaultLayout;
              if (route.layout === null) {
                Layout = React.Fragment;
              } else if (route.layout) {
                Layout = route.layout;
              }
              return (
                <Route
                  key={index}
                  path={route.path}
                  element={
                    !deviceID ? (
                      <Navigate to="/login" replace={true} />
                    ) : (
                      <Layout>
                        <route.component />
                      </Layout>
                    )
                  }
                />
              );
            })}
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
