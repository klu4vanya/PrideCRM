import React from "react";
import { createGlobalStyle } from "styled-components";
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AdminPanel from "./Components/Admin";
import Ranked from "./Components/Ranked";
import TournamentSchedule from "./Components/Schedule";
import TournamentProfile from "./Components/MyProfile";
import { MainPage } from "./Components/MainPage";
import AuthPage from "./Components/Auth";

import "./App.css";

const GlobalStyle = createGlobalStyle`
 @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap');

  body {
    font-family: "Poppins", sans-serif;
  }
`;

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/admin" element={ <AdminPanel /> } />
          <Route path="/ranked" element={<Ranked />} /> 
          <Route path="/schedule" element={<TournamentSchedule />} />
          <Route path="/myprofile" element={<TournamentProfile />} />
          <Route path="/auth" element={<AuthPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
