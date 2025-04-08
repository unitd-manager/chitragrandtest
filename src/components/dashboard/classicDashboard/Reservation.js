import React, { useState, useEffect } from 'react';
// import PropTypes from "prop-types";
import { Button, Container, Row, Col, Card, Table, Input, Label } from 'reactstrap';
import Select from 'react-select';
import moment from 'moment';
// import { useNavigate } from 'react-router-dom';
import api from '../../../constants/api';
import TenderContactDetails from '../../TenderTable/TenderContactDetails';
import ReservationModal from '../../TenderTable/ReservationModel';

const Reservation = () => {
  const [bookingId, setBookingId] = useState(null);
  // const navigate = useNavigate();
  // const [selectedRoomType, setSelectedRoomType] = useState("");
  const [contactIds, setContactId] = useState('');
  const [customer, setCustomer] = useState({
    // first_name: '',
    // address: '',
    // address_flat: '',
    // address_state: '',
    // mobile: '',
    // email: '',
    // city: '',
    // gst_no: '',
    // address_country: '',
    // address_po_code: '',
    assign_time: '',
    booking_date: '',
    to_booking_date: '',
    to_assign_time: '',
    contact_id: '',
    delux: '',
    super_delux_double: '',
    delux_triple: '',
    confirmed: false,
  });

  const [customerReservation, setCustomerReservation] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [selectedReservation, setSelectedReservation] = useState(null); // Selected reservation data

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  // Function to handle reservation confirmation
  const confirmReservation = (formData) => {
    console.log('Reservation Confirmed:', formData);
    toggleModal();
  };

  // Handle input changes
  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // const handleNavigation = () => {
  //   window.location.reload();
  // };

  const BackTolist = () => {
    window.location.reload();
  };

  // Confirm Check-in
  const confirmCheckin = () => {
    if (!customer.contact_id) {
      alert('Please fill in Name fields.');
      return;
    }
    if (!customer.booking_date) {
      alert('Please fill in From Date fields.');
      return;
    }
    if (!customer.to_assign_time) {
      alert('Please fill in To Time fields.');
      return;
    }
    if (!customer.to_booking_date) {
      alert('Please fill in To date fields.');
      return;
    }
    if (!customer.assign_time) {
      alert('Please fill in From Time fields.');
      return;
    }

    api
    .post('/booking/checkDuplicateReservation', {
      contact_id: contactIds,
      booking_date: customer.booking_date,
      to_booking_date: customer.to_booking_date,
    })
    .then((res1) => {
      console.log('res1',res1)
      if (res1.data.exists) {
        alert('Reservation already exists for this customer with the selected date and room!');
        return;
      }
  
      // Continue with reservation insert
      api
        .post('/booking/getReservationValidationInsert', {
          assign_time: customer.assign_time,
          booking_date: customer.booking_date,
          to_assign_time: customer.to_assign_time,
          to_booking_date: customer.to_booking_date,
          contact_id: contactIds,
          delux: customer.delux,
          super_delux_double: customer.super_delux_double,
          delux_triple: customer.delux_triple,
        })
        .then((res) => {
          setBookingId(res.data.contact_id);
          setCustomer((prev) => ({ ...prev, confirmed: true }));
          // handleNavigation();
        })
        .catch((err) => {
          console.error('Error confirming check-in:', err);
        });
    })
    .catch((err) => {
      console.error('Error checking duplicate reservation:', err);
    });
  
  };
  
  console.log('customer',customer)

  const getContactById = (contactId) => {
    api
      .post('/contact/getContactById', { contact_id: contactId })
      .then((res) => {
        // setCustomer(res.data.data[0]);
        setCustomerReservation(res.data.data[0]);
      })
      .catch(() => {});
  };

  const [addContactModal, setAddContactModal] = useState(false);
  const addContactToggle = () => {
    setAddContactModal(!addContactModal);
  };

  const [newContactData, setNewContactData] = useState({
    salutation: '',
    first_name: '',
    email: '',
    phone_direct: '',
    mobile: '',
    address_flat: '',
    address_state: '',
    address_street: '',
    address_po_code: '',
    address_country: '',
    gst_no: '',
  });

  const handleAddNewContact = (e) => {
    setNewContactData({ ...newContactData, [e.target.name]: e.target.value });
  };

  const AddNewContact = () => {
    const newDataWithCompanyId = newContactData;
  
    if (newDataWithCompanyId.first_name.trim() === '') {
      alert('Please fill Name field', 'warning');
      return;
    }
  
    if (!newDataWithCompanyId.phone_direct || newDataWithCompanyId.phone_direct.trim() === '') {
      alert('Please fill Phone Direct field', 'warning');
      return;
    }
  
    if (!newDataWithCompanyId.address_flat || newDataWithCompanyId.address_flat.trim() === '') {
      alert('Please fill Address field', 'warning');
      return;
    }
  
    if (!newDataWithCompanyId.address_state || newDataWithCompanyId.address_state.trim() === '') {
      alert('Please fill Address State field', 'warning');
      return;
    }
  
    if (
      !newDataWithCompanyId.address_po_code ||
      newDataWithCompanyId.address_po_code.trim() === ''
    ) {
      alert('Please fill Postal Code field', 'warning');
      return;
    }
  
    // Check for duplicate
    api
    .post('/contact/CheckContactEmailPhone', {
      first_name: newDataWithCompanyId.first_name,
      phone_direct: newDataWithCompanyId.phone_direct,
    })
    .then((res) => {
      const duplicateData = res.data.data;
      
  
      console.log('Duplicate check result:', res.data);
  
      if (Array.isArray(duplicateData) && duplicateData.length > 0) {
        // 👇 Show alert if duplicate found
        alert('Contact with same name and phone already exists!', 'warning');
      }
    })
    .catch(() => {
      api
      .post('/contact/insertContact', newDataWithCompanyId)
      .then((res1) => {
        alert('Contact Inserted Successfully', 'success');
        const insertedDataId = res1.data.data.insertId;
        getContactById(insertedDataId);
        addContactToggle();
      })
      .catch(() => {
        alert('Unable to add Contact! Try again later.', 'error');
      });
    });
  
  };

  // const AddNewContact = () => {
  //   const newDataWithCompanyId = newContactData;
  //   // newDataWithCompanyId.company_id = selectedCompany;
  //   if (newDataWithCompanyId.first_name.trim() === '') {
  //     alert('Please fill Name field', 'warning');
  //     return;
  //   }

  //   if (!newDataWithCompanyId.phone_direct || newDataWithCompanyId.phone_direct.trim() === '') {
  //     alert('Please fill Phone Direct field', 'warning');
  //     return;
  //   }

  //   if (!newDataWithCompanyId.address_flat || newDataWithCompanyId.address_flat.trim() === '') {
  //     alert('Please fill Address field', 'warning');
  //     return;
  //   }

  //   if (!newDataWithCompanyId.address_state || newDataWithCompanyId.address_state.trim() === '') {
  //     alert('Please fill Address State field', 'warning');
  //     return;
  //   }

  //   if (
  //     !newDataWithCompanyId.address_po_code ||
  //     newDataWithCompanyId.address_po_code.trim() === ''
  //   ) {
  //     alert('Please fill Postal Code field', 'warning');
  //     return;
  //   }
  //   api
  //     .post('/contact/insertContact', newDataWithCompanyId)
  //     .then(() => {
  //       // getContact(newDataWithCompanyId.company_id);
  //       alert('Contact Inserted Successfully', 'success');
  //       window.location.reload();
  //     })
  //     .catch(() => {
  //       alert('Unable to add Contact! try again later', 'error');
  //     });
  // };
  const [company, setCompany] = useState();

  const getCompany = () => {
    api
      .get('/contact/getContact')
      .then((res) => {
        setCompany(res.data.data);
      })
      .catch(() => {});
  };

  const checkDuplicateReservation = (ContactId, bookingDate, toBookingDate) => {
    if (!ContactId || !bookingDate || !toBookingDate) return;

  
    api
      .post('/booking/checkDuplicateReservation', {
       ContactId,
       bookingDate,
       toBookingDate,
      })
      .then((res) => {
        if (res.data.exists) {
          alert('Reservation already exists for this customer with the selected date and room!'`${res.data.data.booking_date}`);
        }
      })
      .catch((err) => {
        console.error('Error checking duplicate reservation:', err);
      });
  };
  

  useEffect(() => {
    getCompany();
  }, []);
  const options = company?.map((e) => ({
    value: e.contact_id,
    label: `${e.first_name} (${e.phone_direct})`,
  }));

  // useEffect(() => {
  //   if (customer?.contact_id) {
  //     getContactById(customer.contact_id);
  //   }
  // }, [customer.contact_id]);


  

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center fw-bold text-uppercase p-3 bg-primary text-white rounded shadow-sm">
        <i className="fas fa-calendar-check me-2"></i> Reservation
      </h2>
      {customer.confirmed && (
             <Col md="12">
           
               <Card className="shadow p-3 mt-3 text-center">
                 <h5 className="text-success fw-bold">✅ Reservation Confirmed!</h5>
                 {/* <p>Booking ID: {bookingId}</p> */}
                 <Button
                   onClick={BackTolist}
                   style={{
                     display: 'flex', // To enable flexbox layout
                     justifyContent: 'center', // Horizontally center
                     alignItems: 'center', // Vertically center
                     margin: '0 auto', // Optionally, you can use margin auto for better centering
                   }}
                 >
                   Back to Reservation
                 </Button>
               </Card>
            
           </Col>
          )}
      <Row>
      {!customer.confirmed && (
        <Col md="6">
          <Card className="shadow p-3 h-100">
            <h5 className="mb-3 text-center">Room Selection</h5>
            <Table bordered className="text-center">
              <thead style={{ backgroundColor: '#87CEFA', color: 'red' }}>
                <tr>
                  <th>Delux</th>
                  <th>Super Delux Double</th>
                  <th>Delux Triple</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <Input
                      type="number"
                      name="delux"
                      className="mb-3"
                      min="1"
                      value={customer.delux}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="super_delux_double"
                      className="mb-3"
                      min="1"
                      value={customer.super_delux_double}
                      onChange={handleInputChange}
                    />
                  </td>
                  <td>
                    <Input
                      type="number"
                      name="delux_triple"
                      className="mb-3"
                      min="1"
                      value={customer.delux_triple}
                      onChange={handleInputChange}
                    />
                  </td>
                </tr>
              </tbody>
            </Table>
          </Card>

        
        </Col>
           )}
        {!customer.confirmed && (
        <Col md="6">
          <Card className="shadow p-3 h-100">
            <h5 className="mb-3 text-center">Customer Details</h5>
            <Row>
              <Col md="12">
              <Label>
  Customer Name (OR){' '}
  <span className="anchor" onClick={addContactToggle}>
    <b><u>Add New</u></b>
  </span>
  {contactIds && (
    <>
      {' '} (AND){' '}
      <span
        className="anchor"
        onClick={() => {
          setSelectedReservation({
            booking_date: moment().format('YYYY-MM-DD'),
          });
          getContactById(customer.contact_id);
          toggleModal();
        }}
      >
        <b><u style={{ color: 'green' }}>Already Reserved</u></b>
      </span>
    </>
  )}
</Label>

                {selectedReservation && (
        <ReservationModal
          reservationData={selectedReservation}
          isOpen={isModalOpen}
          customerReservation={customerReservation}
          toggle={toggleModal}
          confirmReservation={confirmReservation}
        />
      )}
{/* 
                <Select
                  className="mb-2"
                  options={options}
                  placeholder="Select or search customer..."
                  onChange={(selectedOption) => {
                    setContactId(selectedOption.value); // Debugging log
                    setCustomer((prev) => ({ ...prev, contact_id: selectedOption?.value })); // Store contact_id
                  }}
                  isSearchable
                /> */}
                
                <Select
  className="mb-2"
  options={options}
  placeholder="Select or search customer..."
  onChange={(selectedOption) => {
    const selectedContactId = selectedOption?.value;
    setContactId(selectedContactId);
    setCustomer((prev) => ({ ...prev, contact_id: selectedContactId }));
    
    // 🔁 Fetch contact details now
    // getContactById(selectedContactId);
  
    // 🔁 Check for duplicates
    checkDuplicateReservation(
      selectedContactId,
      customer.booking_date,
      customer.to_booking_date
    );
  }}
  
  isSearchable
/>

                <TenderContactDetails
                  addContactModal={addContactModal}
                  addContactToggle={addContactToggle}
                  AddNewContact={AddNewContact}
                  handleAddNewContact={handleAddNewContact}
                  newContactData={newContactData}
                />
              </Col>
            </Row>
            {/* <Input type="text" name="first_name" placeholder="Full Name" className="mb-2" value={customer.first_name} onChange={handleInputChange} /> */}
            {/* <Input
              type="textarea"
              name="address"
              placeholder="Address"
              className="mb-2"
              value={customer.address}
              onChange={handleInputChange}
            /> */}
            {/* <Input
              type="textarea"
              name="address_flat"
              placeholder="Area"
              className="mb-2"
              value={customer.address_flat}
              onChange={handleInputChange}
            /> */}
            <Row>
              {/* <Col md="6">
                <Input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  className="mb-2"
                  value={customer.mobile}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="mb-2"
                  value={customer.email}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>

            <Row>
              <Col md="6">
                <Input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="mb-2"
                  value={customer.city}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Input
                  type="text"
                  name="address_state"
                  placeholder="State"
                  className="mb-2"
                  value={customer.address_state}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Input
                  type="text"
                  name="address_country"
                  placeholder="Country"
                  className="mb-2"
                  value={customer.address_country}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Input
                  type="text"
                  name="address_po_code"
                  placeholder="Po Code"
                  className="mb-2"
                  value={customer.address_po_code}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="12">
                <Input
                  type="text"
                  name="gst_no"
                  placeholder="Gst No"
                  className="mb-2"
                  value={customer.gst_no}
                  onChange={handleInputChange}
                />
              </Col> */}
              <Col md="6">
                <Label>Check in Date</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  name="booking_date"
                  className="mb-3"
                  value={customer.booking_date}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Label>Check in Time</Label>
                <Input
                  type="time"
                  name="assign_time"
                  className="mb-3"
                  value={customer.assign_time}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Label>Check Out Date</Label>
                <Input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  name="to_booking_date"
                  className="mb-3"
                  value={customer.to_booking_date}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Label>Check Out Time</Label>
                <Input
                  type="time"
                  name="to_assign_time"
                  className="mb-3"
                  value={customer.to_assign_time}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Label>Advance Amount</Label>
                <Input
                  type="text"
                  name="amount"
                  className="mb-3"
                  value={customer.amount}
                  onChange={handleInputChange}
                />
              </Col>
            </Row>

            {/* <Input type="time" name="checkInTime" className="mb-3" value={customer.checkInTime} onChange={handleInputChange} /> */}
            {!bookingId && (
              <Button
                style={{ backgroundColor: '#87CEFA', borderColor: '#87CEFA', color: 'red' }}
                className="w-100"
                onClick={() => {
                  confirmCheckin();
                  // updateRoomSelection();
                }}
              >
                Confirm Reservation
              </Button>
            )}
          </Card>
        </Col>
         )}
      </Row>
    </Container>
  );
};

// Updated PropTypes
// Reservation.propTypes = {
//   // bookingCartId: PropTypes.string.isRequired,
//   // roomData: PropTypes.array.isRequired, // Fix: Change from string to array
// };

export default Reservation;
