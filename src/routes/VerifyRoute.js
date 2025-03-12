import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import BookingHistory from '../views/smartconTables/BookingSuccess';

const VerifyRoute = () => {
  return (
    <Routes>
        <Route path="/VerifyBooking" element={<BookingHistory/>}></Route>
    </Routes>
  );
};

export default VerifyRoute;
