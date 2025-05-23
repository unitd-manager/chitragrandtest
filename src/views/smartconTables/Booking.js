import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import moment from 'moment';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
import { Link } from 'react-router-dom';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';

const Booking = () => {
  //state variable
  const [bookings, setBookings] = useState(null);
  const [loading, setLoading] = useState(false);

  //getting Booking data in db
  const getBooking = () => {
    api
      .get('/booking/getBooking')
      .then((res) => {
        setBookings(res.data.data);
        $('#example').DataTable({
          // pagingType: 'full_numbers',
          // pageLength: 20,
          // processing: true,
          // dom: 'Bfrtip',
          // // buttons: [
          //   {
          //     extend: 'print',
          //     text: 'Print',
          //     className: 'shadow-none btn btn-primary',
          //   },
          // ],
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getBooking();
  }, []);

  //  stucture of Booking list view
  const columns = [
    {
      name: '#',
      selector: '',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => <Icon.Edit2 />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    {
      name: 'Customer Name',
    },
    {
      name: 'From Date',
    },
    {
      name: 'To Date',
    },
    {
      name: 'Check in Time',
    },
    // {
    //   name: 'To AssignTime',
    // },
    // {
    //   name: 'Total Hour',
    // },
  
    {
      name: 'Email',
    },
    {
      name: 'Mobile',
    },
    {
      name: 'Status',
    },
  ];

  return (
    <div className="MainDiv">
      <div className="pt-xs-25">
        <BreadCrumbs />
        <CommonTable
          loading={loading}
          title="Booking List"
          Button={
            <Link to="/BookingDetails">
              <Button color="primary" className="shadow-none">
                Add New
              </Button>
            </Link>
          }
        >
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {bookings &&
              bookings.map((element, index) => {
                return (
                  <tr key={element.booking_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/BookingEdit/${element.booking_id}?tab=1`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    <td>{element.first_name}</td>
                    <td>{(element.booking_date)?moment(element.booking_date).format('DD-MM-YYYY'):''}</td>
                    <td>{(element.to_booking_date)?moment(element.to_booking_date).format('DD-MM-YYYY'):''}</td>
                    <td>{element.assign_time}</td>
                    {/* <td>{element.to_assign_time}</td> */}
                    {/* <td>{element.total_hour}</td> */}
                    <td>{element.email}</td>
                    <td>{element.mobile}</td>
                    <td>{element.status}</td>
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};

export default Booking;
