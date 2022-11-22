import { Route, Routes } from "react-router-dom";

import BookingDetails from "../pages/BookingDetails";

const TripsRoutes = () => {
  return (
    <Routes>
      <Route path=":id/:place" element={<BookingDetails />} />
    </Routes>
  );
};

export default TripsRoutes;
