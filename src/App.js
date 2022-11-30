import React from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Trips from "./pages/Trips";
import PlacesRoutes from "./routes/PlacesRoutes";
import TripsRoutes from "./routes/TripsRoutes";
import NotFound from "./pages/NotFound";
import { ChakraProvider } from "@chakra-ui/react";
import { AuthProvider } from "./shared/auth-context";

import Navbar from "./shared/components/navbar";

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places/*" element={<PlacesRoutes />} />
          <Route path="/trips" element={<Trips />} />
          <Route path="/trips/*" element={<TripsRoutes />} />

          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
