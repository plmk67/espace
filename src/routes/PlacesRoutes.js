import { Route, Routes } from "react-router-dom";

import Place from "../pages/Place";

const PlacesRoutes = () => {
  return (
    <Routes>
      <Route path=":id/:title" element={<Place />} />
    </Routes>
  );
};

export default PlacesRoutes;
