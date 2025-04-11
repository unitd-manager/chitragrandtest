import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button, Input, Label, FormGroup } from 'reactstrap';
import PropTypes from 'prop-types';

const ReservationModal = ({ isOpen, toggle, customerReservation }) => {
  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  // Check if customerReservation is available and if the booking_date matches today's date
  const isReservationToday = customerReservation?.booking_date === today;

  console.log('customerReservation', customerReservation);
  console.log('Is reservation today:', isReservationToday);

  return (
    <Modal isOpen={isOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>Confirm Your Reservation</ModalHeader>

      {isReservationToday ? (
        <ModalBody>
          <FormGroup>
            <Label>Reservation Date and Time</Label>
            <Input
              type="text"
              name="reservation_date"
              value={customerReservation?.reservation_date || ''}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label>From Date</Label>
            <Input
              type="date"
              name="booking_date"
              value={customerReservation?.booking_date || ''}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label>To Date</Label>
            <Input
              type="date"
              name="to_booking_date"
              value={customerReservation?.to_booking_date || ''}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label>Delux</Label>
            <Input
              type="number"
              name="room_type"
              value={customerReservation?.delux || ''}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label>Super Delux Double</Label>
            <Input
              type="number"
              name="room_type"
              value={customerReservation?.super_delux_double || ''}
              disabled
            />
          </FormGroup>
          <FormGroup>
            <Label>Delux Triple</Label>
            <Input
              type="number"
              name="room_type"
              value={customerReservation?.delux_triple || ''}
              disabled
            />
          </FormGroup>
        </ModalBody>
      ) : (
        <ModalBody>
          <FormGroup>
            <Label>No Booking History For this Customer</Label>
          </FormGroup>
        </ModalBody>
      )}

      <ModalFooter>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

ReservationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  customerReservation: PropTypes.object.isRequired, // assuming it's an object and not an array
};

export default ReservationModal;
