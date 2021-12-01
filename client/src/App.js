import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./App.css";
import { RecoilRoot } from "recoil";

import Mainpage from "./pages/Mainpage";
import Home from "./pages/Home";


const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [userinfo, setUserinfo] = useState(null);

  const history = useHistory();

  const isAuthenticated = () => {
    axios.get(`${process.env.REACT_APP_API_URL}/user/info`).then((res) => {
      setUserinfo(res.data.data.userInfo);
      setIsLogin(true);
      history.push("/");
    });
  };
  
  const handleResponseSuccess = () => {
    isAuthenticated();
  };

  return (
    <>
      <BrowserRouter>
        <Switch>
         <Route
              exact
              path="/"
              render={() =>
                isLogin ? (
                  <Route exact path="/home">
                    <Home userinfo={userinfo}/>
                  </Route>
          
                ) : (
                  <Mainpage handleResponseSuccess={handleResponseSuccess} />
                )
              }
            />
            <Redirect from="*" to="/" />
        </Switch>
      </BrowserRouter>
    </>
  );
};

export default App;
