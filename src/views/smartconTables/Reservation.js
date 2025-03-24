import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import moment from 'moment';
import { Button, Input, Label } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const Reservation = () => {
  // State variables
  const [reservation, setReservation] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchName, setSearchName] = useState('');
  const [searchMobile, setSearchMobile] = useState('');

  // Fetch reservation data from API
  const getReservation = () => {
    setLoading(true);
    api
      .get('/booking/getReservation')
      .then((res) => {
        setReservation(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getReservation();
  }, []);

  // Get today's date in YYYY-MM-DD format
  const today = moment().format('YYYY-MM-DD');

  // Filtered data based on selected booking date range, name, and mobile
  // Filtered and sorted data
  const filteredReservations = reservation
  .filter((element) => {
    const bookingDate = element.booking_date ? moment(element.booking_date).format('YYYY-MM-DD') : null;

    return (
      (!fromDate || (bookingDate && bookingDate >= fromDate)) &&
      (!toDate || (bookingDate && bookingDate <= toDate)) &&
      (!searchName || element.first_name.toLowerCase().includes(searchName.toLowerCase())) &&
      (!searchMobile || element.mobile.includes(searchMobile))
    );
  })
  .sort((a, b) => {
    const bookingDateA = moment(a.booking_date).format('YYYY-MM-DD');
    const bookingDateB = moment(b.booking_date).format('YYYY-MM-DD');

    // Show today's bookings first
    if (bookingDateA === today) return -1;
    if (bookingDateB === today) return 1;

    // Sort by booking date (latest first)
    return moment(bookingDateB).diff(moment(bookingDateA));
  });




  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        <BreadCrumbs />

        {/* Filters Section */}
        <div className="d-flex align-items-center mb-3 flex-wrap" style={{ gap: '10px' }}>
  <Label style={{ whiteSpace: 'nowrap' }}>From:</Label>
  <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} style={{ width: '150px' }} />

  <Label style={{ whiteSpace: 'nowrap' }}>To:</Label>
  <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} style={{ width: '150px' }} />

  {/* <Label style={{ whiteSpace: 'nowrap' }}>Search:</Label>
  <Input type="text" placeholder="Customer Name or Mobile" value={searchName} 
    onChange={(e) => { setSearchName(e.target.value); setSearchMobile(e.target.value); }} 
    style={{ width: '250px' }} /> */}

  <Button color="secondary" onClick={() => { setFromDate(''); setToDate(''); setSearchName(''); setSearchMobile(''); }} style={{ whiteSpace: 'nowrap' }}>
    Reset
  </Button>
</div>



        {/* Reservation Table */}
        <CommonTable
          loading={loading}
          title="Reservation List"
          Button={
            <Link to="/ReservationDetails">
              <Button color="primary" className="shadow-none">
                Add New
              </Button>
            </Link>
          }
        >
          <thead>
            <tr>
              <td>#</td>
              <td>Edit</td>
              <td>Customer Name</td>
              <td>Booking Date</td>
              <td>To Date</td>
              <td>Reservation Date</td>
              <td>Room Type</td>
              <td>Room Count</td>
              <td>Status</td>
            </tr>
          </thead>
          <tbody>
            {filteredReservations.length > 0 ? (
              filteredReservations.map((element, index) => {
                const bookingDate = element.booking_date ? moment(element.booking_date).format('YYYY-MM-DD') : null;
                const isToday = bookingDate === today;

                return (
                  <tr key={element.reservation_id} style={{ backgroundColor: isToday ? '#ffcccc' : 'transparent' }}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/ReservationEdit/${element.reservation_id}?tab=1`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    <td>{element.first_name}</td>
                    <td>{bookingDate ? moment(bookingDate).format('DD-MM-YYYY') : ''}</td>
                    <td>{element.to_booking_date ? moment(element.to_booking_date).format('DD-MM-YYYY') : ''}</td>
                    <td>{element.reservation_date ? moment(element.reservation_date).format('DD-MM-YYYY') : ''}</td>
                    <td>{element.room_type}</td>
                    <td>{element.room_count}</td>
                    <td>{element.status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" className="text-center">
                  No reservations found for selected criteria.
                </td>
              </tr>
            )}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Reservation;
