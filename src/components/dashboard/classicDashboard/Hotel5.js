import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Row, Col, Card, Table, Input, Label,Modal,ModalHeader,ModalBody, Spinner } from 'reactstrap';
import Select from 'react-select';
import moment from 'moment';
import api from '../../../constants/api';
import TenderContactDetails from '../../TenderTable/TenderContactDetails';
import ReservationModal from '../../TenderTable/ReservationModel';

const HotelDashboard3 = ({
  bookingCartId,
  sessionId,
  selectedRooms,
  // setSelectedRooms,
  getRoomDetails,
  actionType,
  getRoomsByUpdate,
  roomDetails,
  getcartHistory,
}) => {
  const [bookingId, setBookingId] = useState(null);
  const [contactIds, setContactId] = useState('');
  const [allCountries, setallCountries] = useState();
  const [customerReservation, setCustomerReservation] = useState('');
  const [customerReservationHistory, setCustomerReservationHistory] = useState('');
  const [loading, setLoading] = useState(true);
  const [cartAmount, setCartAmount] = useState({
    booking_cart_history_id: null,
    amount: null,
  });

  const [isSaving, setIsSaving] = useState(false);

  const [showLogHistoryModal, setShowLogHistoryModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal
  const [selectedReservation, setSelectedReservation] = useState(null); // Selected reservation data


  const toggleModal = () => setIsModalOpen(!isModalOpen);
  const toggleModalHistory = () => setShowLogHistoryModal(!showLogHistoryModal);



  // Function to handle reservation confirmation
  const confirmReservation = (formData) => {
    console.log('Reservation Confirmed:', formData);
    toggleModal();
  };

  // const getCurrentDate = () => {
  //   const today = new Date();
  //   return today.toISOString().split('T')[0]; // Extracts YYYY-MM-DD
  // };

  // const getCurrentTime = () => {
  //   const now = new Date();
  //   return now.toTimeString().slice(0, 5); // Extracts HH:MM
  // };
  // const getCurrentDate = () => {
  //   return new Date().toISOString().split("T")[0]; // Returns YYYY-MM-DD
  // };

  // const getCurrentTime = () => {
  //   const now = new Date();
  //   return now.getHours().toString().padStart(2, "0") + ":" + now.getMinutes().toString().padStart(2, "0"); // Returns HH:MM
  // };

  const currentDate = moment().format('YYYY-MM-DD');
  const currentTime = moment().format('HH:mm:ss');

  const [customer, setCustomer] = useState({
    name: '',
    address: '',
    address_flat: '',
    address_state: '',
    phone: '',
    email: '',
    city: '',
    gst_no: '',
    address_country: '',
    address_po_code: '',
    checkInTime: '',
    checkInDate: '',
    contact_id: '',
    confirmed: false,
  });

  const updateRoomSelection = () => {
    if (!sessionId || !actionType || !bookingCartId) {
      alert('Missing session ID, action type, or booking cart ID.');
      return;
    }

    if (!selectedRooms || selectedRooms.length === 0) {
      alert('No rooms selected.');
      return;
    }

    const requestData = {
      sessionId,
      actionType,
      bookingCartId,
      rooms: selectedRooms.map(({ roomhistoryId }) => ({
        roomhistoryId,
        isAvailable: 'No',
      })),
    };

    console.log('📌 Sending API Request:', JSON.stringify(requestData, null, 2));

    api
      .post('/bookingcart/update-room-selection', requestData)
      .then((res) => {
        console.log('API Response:', res.data); // Log the response

        // Check if res.data is an array
        if (Array.isArray(res.data)) {
          res.data.forEach((item) => {
            console.log(item); // Process each item
          });
        } else if (res.data && res.data.rooms && Array.isArray(res.data.rooms)) {
          // If res.data has rooms and it's an array, loop through it
          res.data.rooms.forEach((room) => {
            console.log(room); // Process each room
          });
        } else if (res.data && typeof res.data === 'object') {
          // If res.data is an object but not an array, use Object.keys(), Object.values(), or Object.entries()
          // Example using Object.keys():
          Object.keys(res.data).forEach((key) => {
            console.log(key, res.data[key]); // Iterate over each key-value pair
          });

          // Or Example using Object.values():
          Object.values(res.data).forEach((value) => {
            console.log(value); // Iterate over each value
          });

          // Or Example using Object.entries():
          Object.entries(res.data).forEach(([key, value]) => {
            console.log(key, value); // Iterate over each key-value pair
          });
        } else {
          console.error('Data is not iterable:', res.data);
        }

        // Handling success or failure
        if (res.data.success) {
          getRoomDetails();
          alert('✅ Rooms updated successfully!');
          // setSelectedRooms([]); // Clear selection
          // Set the flag to true
        } else {
          throw new Error(res.data.message || 'Unknown error');
        }
      })
      .catch((err) => {
        console.error('🚨 API Error:', err.response?.data || err.message);
        alert('⚠ Failed to update rooms. Please try again.');
      });
  };

  // Ensure function is defined before calling it
  if (typeof updateRoomSelection !== 'function') {
    console.error('updateRoomSelection is not defined.');
  }

  // Fetch room details based on bookingCartId
  console.log('bookingCartId', bookingCartId);

  // Handle input change
  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handleInputChangeAmount = (e, room) => {
    setCartAmount({
      booking_cart_history_id: room.booking_cart_history_id,
      amount: e.target.value,
    });
  };

  // Confirm Check-in
  const confirmCheckin = () => {
    if (
      // !bookingCartId ||
      !customer.first_name ||
      !customer.phone_direct ||
      !customer.address_flat
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    api
      .post('/bookingcart/confirm-checkins', {
        booking_cart_id: bookingCartId,
        name: customer.first_name,
        address: customer.address,
        phone: customer.mobile,
        email: customer.email,
        city: customer.city,
        address_country: customer.address_country,
        address_flat: customer.address_flat,
        address_state: customer.address_state,
        gst_no: customer.gst_no,
        amount: customer.amount,
        address_po_code: customer.address_po_code,
        check_in_time: currentTime,
        check_in_date: currentDate,
        contact_id: contactIds,
        room_change_status:"Active"
      })
      .then((res) => {
        console.log('Check-in Response:', res.data);
        if (res.data.booking_id) {
          setBookingId(res.data.booking_id);
          setCustomer((prev) => ({ ...prev, confirmed: true }));
          updateRoomSelection();
          getRoomsByUpdate();
        }
      })
      .catch((err) => {
        console.error('Error confirming check-in:', err);
      });
  };

  const getContactById = (contactId) => {
    api
      .post('/contact/getContactById', { contact_id: contactId })
      .then((res) => {
        setCustomer(res.data.data[0]);
        setCustomerReservation(res.data.data[0]);
      })
      .catch(() => {});
  };

  const getContactByIdHistory = (contactId) => {
    setLoading(true);
    api
      .post('/booking/getBookingDataHistory', { contact_id: contactId })
      .then((res) => {
        setCustomerReservationHistory(res.data.data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
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
  
  
  const [company, setCompany] = useState();

  const getCompany = () => {
    api
      .get('/contact/getContact')
      .then((res) => {
        setCompany(res.data.data);
      })
      .catch(() => {});
  };
  const getAllCountries = () => {
    api
      .get('/clients/getCountry')
      .then((res) => {
        setallCountries(res.data.data);
      })
      .catch(() => {});
  };

  useEffect(() => {
    getCompany();
    getAllCountries();
  }, []);
  const options = company?.map((e) => ({
    value: e.contact_id,
    label: `${e.first_name} (${e.phone_direct})`,
  }));

  useEffect(() => {
    if (customer?.contact_id) {
      getContactById(customer.contact_id);
    }
    if (customer?.contact_id) {
      getContactByIdHistory(customer.contact_id);
    }
  }, [customer.contact_id]);
  const BackTolist = () => {
    window.location.reload();
  };

  const handleSave = () => {
    setIsSaving(true); // Start loader
  
    api
      .post('/bookingcart/editBookingCartHistoryAmount', cartAmount)
      .then(() => {
        getcartHistory();
      })
      .catch((err) => {
        console.error('Error saving amount:', err);
      })
      .finally(() => {
        setIsSaving(false); // Stop loader
      });
  };
  

  return (
    <Container className="mt-4">
      <Row>
        {bookingId && (
          <Col md="12">
            {bookingId && (
              <Card className="shadow p-3 mt-3 text-center">
                <h5 className="text-success fw-bold">✅ Check-in Confirmed!</h5>
                <p>Booking ID: {bookingId}</p>
                <Button
                  onClick={BackTolist}
                  style={{
                    display: 'flex', // To enable flexbox layout
                    justifyContent: 'center', // Horizontally center
                    alignItems: 'center', // Vertically center
                    margin: '0 auto', // Optionally, you can use margin auto for better centering
                  }}
                >
                  Back to Check In
                </Button>
              </Card>
            )}
            <Card className="shadow p-3 h-100">
              <h5 className="mb-3 text-center">Room Confirm</h5>
              <Table bordered className="text-center">
                <thead style={{ backgroundColor: '#87CEFA', color: 'red' }}>
                  <tr>
                    <th>Room Type</th>
                    <th>Room Numbers</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedRooms?.map((room) => (
                    <tr key={room?.roomId}>
                      <td className="fw-bold">{room?.roomType}</td> {/* Correct property name */}
                      <td>{room?.roomNumber}</td> {/* Correct property name */}
                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* <Button color="primary" onClick={() => { setSelectedReservation({ booking_date: moment().format('YYYY-MM-DD'), delux: 2 }); toggleModal(); }}>
              Reservation
            </Button> */}
            </Card>
          </Col>
        )}
        {!bookingId && (
          <Col md="6">
            <Card className="shadow p-3 h-100" style={{ marginBottom: '250px' }}>
              <h5 className="mb-3 text-center">Room Availability</h5>
              {contactIds && ( 
              <span
        className="anchor"
        onClick={() => {
          getContactByIdHistory(customer.contact_id);
          toggleModalHistory(true);
        }}
      >
        <b><u style={{ color: 'green' ,marginLeft:140}}>This Customer Booking History</u></b>
      </span>
       )}
              <Table bordered className="text-center">
                <thead style={{ backgroundColor: '#87CEFA', color: 'red' }}>
                  <tr>
                    <th>Room Type</th>
                    <th>Room Numbers</th>
                    <th>Room Price</th>
                  </tr>
                </thead>
                <tbody>
                  {roomDetails?.map((room) => (
                    <tr key={room?.booking_cart_history_id}>
                      <td className="fw-bold">{room?.room_type}</td>
                      <td>{room?.room_number}</td>
                      <td>
                        <Input
                          // type="number"
                          name="amount"
                          className="mb-3"
                          type="text"
                          defaultValue={room?.amount}
                          onChange={(e) => handleInputChangeAmount(e, room)}
                        />
                      </td>
                      <td>
  <Button color="primary" size="sm" onClick={handleSave} disabled={isSaving}>
    {isSaving ? (
      <>
        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
        Saving...
      </>
    ) : (
      'Save'
    )}
  </Button>
</td>

                    </tr>
                  ))}
                </tbody>
              </Table>
              {/* <Button
                color="primary"
                onClick={() => {
                  setSelectedReservation({ booking_date: moment().format('YYYY-MM-DD'), delux: 2 });
                  toggleModal();
                }}
              >
                Reservation
              </Button> */}
            </Card>

            {customer.confirmed && (
              <Card className="shadow p-3 mt-3 text-center">
                <h5 className="text-success fw-bold">✅ Check-in Confirmed!</h5>
                <p>Booking ID: {bookingId}</p>
              </Card>
            )}
          </Col>
        )}
        {!bookingId && (
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

                  <Select
                    className="mb-2"
                    options={options}
                    placeholder="Select or search customer..."
                    onChange={(selectedOption) => {
                      setContactId(selectedOption.value); // Debugging log
                      setCustomer((prev) => ({ ...prev, contact_id: selectedOption?.value })); // Store contact_id
                    }}
                    isSearchable
                  />

                  <TenderContactDetails
                    addContactModal={addContactModal}
                    addContactToggle={addContactToggle}
                    AddNewContact={AddNewContact}
                    handleAddNewContact={handleAddNewContact}
                    newContactData={newContactData}
                    allCountries={allCountries}
                  />
                </Col>
              </Row>
              <Input
                type="text"
                name="first_name"
                placeholder="Full Name"
                className="mb-2"
                value={customer.first_name}
                onChange={handleInputChange}
              />
              {/* <Input
              type="textarea"
              name="address"
              placeholder="Address"
              className="mb-2"
              value={customer.address}
              onChange={handleInputChange}
            /> */}
              <Input
                type="textarea"
                name="address_flat"
                placeholder="Area"
                className="mb-2"
                value={customer.address_flat}
                onChange={handleInputChange}
              />
              <Row>
                <Col md="6">
                  <Input
                    type="text"
                    name="mobile"
                    placeholder="Phone Number"
                    className="mb-2"
                    value={customer.phone_direct}
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
                <Col md="6">
                  <Input
                    type="text"
                    name="gst_no"
                    placeholder="Gst No"
                    className="mb-2"
                    value={customer.gst_no}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md="6">
                  <Input
                    type="text"
                    name="amount"
                    placeholder="Advance Amount"
                    className="mb-2"
                    value={customer.amount}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col md="6">
                  <Label>Check in Date</Label>
                  <Input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    name="checkInDate"
                    className="mb-3"
                    value={currentDate}
                    onChange={handleInputChange}
                    disabled
                  />
                </Col>
                <Col md="6">
                  <Label>Check in Time</Label>
                  <Input
                    type="time"
                    name="checkInTime"
                    className="mb-3"
                    value={currentTime}
                    onChange={handleInputChange}
                    disabled
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
                  Confirm Check-in
                </Button>
              )}
            </Card>
          </Col>
        )}
      </Row>
      {selectedReservation && (
        <ReservationModal
          reservationData={selectedReservation}
          isOpen={isModalOpen}
          customerReservation={customerReservation}
          toggle={toggleModal}
          confirmReservation={confirmReservation}
        />
      )}
       
         <Modal isOpen={showLogHistoryModal} toggle={() => setShowLogHistoryModal(false)} size="xl">
         <ModalHeader toggle={() => setShowLogHistoryModal(false)}>
          Booking History
         </ModalHeader>
         <ModalBody>
           <Col md="12">
             <Card className="p-3 shadow-lg">
               <h4 className="text-center mb-3">Booking History</h4>
               {loading ? (
                 <div className="text-center my-3">
                   <Spinner color="primary" />
                 </div>
               ) : (
                 <Table bordered hover responsive>
                   <thead className="table-primary">
                     <tr>
                        <th>S.No</th>
                       <th>From Date</th>
                       <th>From Time</th>
                       <th>Room Count</th>
                       <th>Room Numbers</th>
                       <th>Booking Status</th>
                       <th>Payment Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {Array.isArray(customerReservationHistory) && customerReservationHistory?.map((element,index) => (
                       <tr key={element.contact_id}>
                          <td>{index+1}</td>
                          <td>{element.booking_date}</td>
                    <td>{element.assign_time}</td>
                    <td>{element.booking_service_count}</td>
                    <td>{element.room_details}</td>
                    <td>{element.status}</td>
                    <td>{element.payment_status}</td>

                       </tr>
                     ))}
                   </tbody>
                 </Table>
               )}
             </Card>
           </Col>
         </ModalBody>
       </Modal>
  
    </Container>
  );
};

HotelDashboard3.propTypes = {
  sessionId: PropTypes.string.isRequired,
  actionType: PropTypes.string.isRequired,
  bookingCartId: PropTypes.number.isRequired,
  selectedRooms: PropTypes.array.isRequired, // Change from object to array
  getRoomDetails: PropTypes.func.isRequired,
  getRoomsByUpdate: PropTypes.func.isRequired,
  roomDetails: PropTypes.array.isRequired,
  getcartHistory: PropTypes.func.isRequired,
};

export default HotelDashboard3;
