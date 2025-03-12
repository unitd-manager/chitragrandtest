import React, { useEffect, useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';
import TenderContactDetails from '../TenderTable/TenderContactDetails';
// import { Link } from 'react-router-dom';
// import moment from 'moment';
import api from '../../constants/api';

export default function BookingDetailComp({ bookingDetails, handleInputs, contact,addContactModal,addContactToggle,handleAddNewContact,AddNewContact,newContactData }) {
  BookingDetailComp.propTypes = {
    bookingDetails: PropTypes.object,
    handleInputs: PropTypes.func,
    contact: PropTypes.array,
    addContactModal: PropTypes.object,
    addContactToggle: PropTypes.object,
    handleAddNewContact: PropTypes.object,
    newContactData: PropTypes.object,
    AddNewContact: PropTypes.object,
    
   
    // employee: PropTypes.array,
    // setEditCustomerModal: PropTypes.func,
   
  };

  const [contactAddress, setContactAddress] = useState();

  console.log('contactAddress',contactAddress)

 
  const getContact = () => {
    api
      .post('/contact/getContactById',{contact_id:bookingDetails && bookingDetails.contact_id})
      .then((res) => {
        setContactAddress(res.data.data[0]);
      })
      .catch(() => {
       
      });
  };

  useEffect(() => {
 
    getContact();
  }, [bookingDetails && bookingDetails.contact_id]); 


 const calculateDays = (startDate, endDate) => {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
  return difference >= 0 ? difference : 0; // Ensure it's not negative
};


  return (
    <>
      <Form>
        <FormGroup>
            <Row>
              <Col md="3">
                <FormGroup>
                  <Label>
                   From Date <span className="required"> *</span>
                  </Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={
                      bookingDetails && bookingDetails.booking_date
                    }
                    name="booking_date"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                  To Date <span className="required"> *</span>
                  </Label>
                  <Input
                    type="date"
                    onChange={handleInputs}
                    value={
                      bookingDetails && bookingDetails.to_booking_date
                    }
                    name="to_booking_date"
                  />
                </FormGroup>
              </Col>

              <Col md="3">
              <FormGroup>
                <Label>Total Days</Label>
                <Input
                  type="text"
                  value={calculateDays(bookingDetails?.booking_date, bookingDetails?.to_booking_date)}
                  readOnly
                />
              </FormGroup>
            </Col>

              <Col md="3">
                <FormGroup>
                  {/* <Label>Customer Name</Label> */}
                  <Label>
                  {/* Customer Name (OR){' '} */}
                    {/* <span className="anchor" onClick={addContactToggle.bind(null)}>
                      <b>
                        <u>Add New</u>
                      </b>
                    </span> */}
                    Customer Name
                  </Label>
                  <Input
                    type="select"
                    onChange={handleInputs}
                    value={bookingDetails && bookingDetails.contact_id}
                    name="contact_id"
                    disabled
                  >
                    <option defaultValue="selected">Please Select</option>
                    {contact &&
                      contact.map((e) => {
                        return (
                          <option key={e.contact_id} value={e.contact_id}>
                            {e.first_name}
                          </option>
                        );

                   
                      })}
                       <TenderContactDetails
                      addContactModal={addContactModal}
                      addContactToggle={addContactToggle}
                      AddNewContact={AddNewContact}
                      newContactData={newContactData}
                      handleAddNewContact={handleAddNewContact}
                    ></TenderContactDetails>
                  </Input>
                </FormGroup>
              </Col>
            
             
                   </Row>
            <Row>
            <Col md="3">
                <FormGroup>
                  <Label>Booking Status</Label>
                  <Input
                    value={bookingDetails && bookingDetails.status}
                    type="select"
                    onChange={handleInputs}
                    name="status"
                    disabled
                  >
                    <option value="">Please Select</option>
                    <option value="Booked">Booked</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </Input>
                </FormGroup>
              </Col>

            {/* <Col md="3">
                <FormGroup>
                  <Label> From Assign Time</Label>
                  <Input
                    type="time"
                    onChange={handleInputs}
                    defaultValue={bookingDetails && bookingDetails.assign_time
                      ? bookingDetails.assign_time.replace(" AM", "").replace(" PM", "").padStart(5, '0')
                      : ''}
                    // defaultValue={bookingDetails && bookingDetails.assign_time ? bookingDetails.assign_time.substring(0, 5) : ''}
                    name="assign_time"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label> To Assign Time</Label>
                  <Input
                    type="time"
                    onChange={handleInputs}
                    defaultValue={bookingDetails && bookingDetails.to_assign_time
                      ? bookingDetails.to_assign_time.replace(" AM", "").replace(" PM", "").padStart(5, '0')
                      : ''}
                    // defaultValue={bookingDetails && bookingDetails.to_assign_time ? bookingDetails.to_assign_time.substring(0, 5) : ''}
                    name="to_assign_time"
                  />
                </FormGroup>
              </Col> */}
              <Col md="3">
                <FormGroup>
                  <Label>Check In Time</Label>
                  <Input
                    value={bookingDetails && bookingDetails.assign_time}
                    type="select"
                    onChange={handleInputs}
                    name="assign_time"
                  >
                    <option value="">Please Select</option>
                    <option value="01:00 AM">01:00 AM</option>
                    <option value="02:00 AM">02:00 AM</option>
                    <option value="03:00 AM">03:00 AM</option>
                    <option value="04:00 AM">04:00 AM</option>
                    <option value="05:00 AM">05:00 AM</option>
                    <option value="06:00 AM">06:00 AM</option>
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 AM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                    <option value="12:00 PM">12:00 AM</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Check Out Time</Label>
                  <Input
                    value={bookingDetails && bookingDetails.to_assign_time}
                    type="select"
                    onChange={handleInputs}
                    name="to_assign_time"
                  >
                    <option value="01:00 AM">01:00 AM</option>
                    <option value="02:00 AM">02:00 AM</option>
                    <option value="03:00 AM">03:00 AM</option>
                    <option value="04:00 AM">04:00 AM</option>
                    <option value="05:00 AM">05:00 AM</option>
                    <option value="06:00 AM">06:00 AM</option>
                    <option value="07:00 AM">07:00 AM</option>
                    <option value="08:00 AM">08:00 AM</option>
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:00 AM">11:00 AM</option>
                    <option value="12:00 AM">12:00 PM</option>
                    <option value="01:00 PM">01:00 PM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="03:00 PM">03:00 PM</option>
                    <option value="04:00 PM">04:00 PM</option>
                    <option value="05:00 PM">05:00 PM</option>
                    <option value="06:00 PM">06:00 PM</option>
                    <option value="07:00 PM">07:00 PM</option>
                    <option value="08:00 PM">08:00 PM</option>
                    <option value="09:00 PM">09:00 PM</option>
                    <option value="10:00 PM">10:00 PM</option>
                    <option value="11:00 PM">11:00 PM</option>
                    <option value="12:00 PM">12:00 AM</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>Payment Status</Label>
                  <Input
                    value={bookingDetails && bookingDetails.payment_status}
                    type="select"
                    onChange={handleInputs}
                    name="payment_status"
                  >
                    <option value="">Please Select</option>
                    <option value="Paid">Paid</option>
                    <option value="Unpaid">Unpaid</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                   Advance Amount
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={bookingDetails && bookingDetails.amount}
                    name="amount"
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                   Address
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactAddress && contactAddress.address_flat}
                    name="address_flat"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                   Address State
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactAddress && contactAddress.address_state}
                    name="address_state"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                   Address Street
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactAddress && contactAddress.address_street}
                    name="address_street"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                  Postal Code
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactAddress && contactAddress.address_po_code}
                    name="address_po_code"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
                 Country
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactAddress && contactAddress.address_country}
                    name="address_country"
                    disabled
                  />
                </FormGroup>
              </Col>
              <Col md="3">
                <FormGroup>
                  <Label>
              GST NO
                  </Label>
                  <Input
                    type="text"
                    onChange={handleInputs}
                    value={contactAddress && contactAddress.gst_no}
                    name="gst_no"
                    disabled
                  />
                </FormGroup>
              </Col>
            </Row>
            <Row></Row>
        </FormGroup>
      </Form>
    </>
  );
}
