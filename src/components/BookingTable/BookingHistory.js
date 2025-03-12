import React from 'react';
import {
  Row,
  Form,
  Table, 
} from 'reactstrap';
import PropTypes from 'prop-types';

export default function BookingHistory({
  bookingHistory,
}) {
  BookingHistory.propTypes = {
    bookingHistory: PropTypes.any,
  };
  //  Table Contact
  const columns = [
    {
      name: 'id',
      selector: 'contact_id',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
      name: 'From Date',
     },
    {
      name: 'Court',
    },
    {
      name: 'From Time',
    },
    {
      name: 'To Time',
    },
    {
      name: 'Booking Status',
    },
    {
      name: 'Payment Status',
    },
  ];
  return (
    <Form>
      <Row>
        <Table id="example" className="display border border-secondary rounded">
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {bookingHistory &&
              bookingHistory.map((element, i) => {
                return (
                  <tr key={element.contact_id}>
                    <td>{i + 1}</td>
                    <td>{element.booking_date}</td>
                    <td>{element.hall}</td>
                    <td>{element.assign_time}</td>
                    <td>{element.to_assign_time}</td>
                    <td>{element.status}</td>
                    <td>{element.payment_status}</td>
                  </tr>
                );
              })}
          </tbody>
        </Table>
      </Row>
    </Form>
  );
}
