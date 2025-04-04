import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Container, Row, Col, Card, Table, Input, Label } from 'reactstrap';
import Select from 'react-select';
import api from '../../../constants/api';
import TenderContactDetails from '../../TenderTable/TenderContactDetails';

const HotelDashboard3 = ({
  bookingCartId,
  sessionId,
  selectedRooms,
  // setSelectedRooms,
  actionType,
}) => {
  const [roomDetails, setRoomDetails] = useState([]);
  const [bookingId, setBookingId] = useState(null);
  const [contactIds, setContactId] = useState('');

  console.log('selectedRooms', selectedRooms);
  console.log('roomDetails', roomDetails);
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
    contact_id:'',
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
  useEffect(() => {
    if (bookingCartId) {
      api
        .post('/bookingcart/get-room-details', { booking_cart_id: bookingCartId })
        .then((res) => {
          if (Array.isArray(res.data.data)) {
            setRoomDetails(res.data.data);
          } else if (res.data.data) {
            setRoomDetails([res.data.data]);
          } else {
            setRoomDetails([]);
            console.error('Unexpected response format:', res.data);
          }
        })
        .catch((err) => {
          console.error('Error fetching room details:', err);
          setRoomDetails([]);
        });
    }
  }, [bookingCartId]);

  // Handle input change
  const handleInputChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  // Confirm Check-in
  const confirmCheckin = () => {
    if (
      !bookingCartId ||
      !customer.mobile ||
      !customer.address_flat ||
      !customer.checkInTime ||
      !customer.checkInDate 
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
        address_po_code: customer.address_po_code,
        check_in_time: customer.checkInTime,
        check_in_date: customer.checkInDate,
        contact_id:contactIds
      })
      .then((res) => {
        console.log('Check-in Response:', res.data);
        if (res.data.booking_id) {
          setBookingId(res.data.booking_id);
          setCustomer((prev) => ({ ...prev, confirmed: true }));
          updateRoomSelection();
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
    // newDataWithCompanyId.company_id = selectedCompany;
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
    api
      .post('/contact/insertContact', newDataWithCompanyId)
      .then(() => {
        // getContact(newDataWithCompanyId.company_id);
        alert('Contact Inserted Successfully', 'success');
        window.location.reload();
      })
      .catch(() => {
        alert('Unable to add Contact! try again later', 'error');
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

  useEffect(() => {
    getCompany();
  }, []);
  const options = company?.map((e) => ({
    value: e.contact_id,
    label: `${e.first_name} (${e.mobile})`,
  }));

  useEffect(() => {
    if (customer?.contact_id) {
      getContactById(customer.contact_id);
    }
  }, [customer.contact_id]);

  return (
    <Container className="mt-4">
      <Row>
        <Col md="6">
          <Card className="shadow p-3 h-100">
            <h5 className="mb-3 text-center">Room Availability</h5>
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
          </Card>

          {customer.confirmed && (
            <Card className="shadow p-3 mt-3 text-center">
              <h5 className="text-success fw-bold">✅ Check-in Confirmed!</h5>
              <p>Booking ID: {bookingId}</p>
            </Card>
          )}
        </Col>

        <Col md="6">
          <Card className="shadow p-3 h-100">
            <h5 className="mb-3 text-center">Customer Details</h5>
            <Row>
              <Col md="12">
                <Label>
                  Customer Name (OR){' '}
                  <span className="anchor" onClick={addContactToggle}>
                    <b>
                      <u>Add New</u>
                    </b>
                  </span>
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
                />
              </Col>
            </Row>
            <Input type="text" name="first_name" placeholder="Full Name" className="mb-2" value={customer.first_name} onChange={handleInputChange} />
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
              </Col>
              <Col md="6">
                <Label>Check in Date</Label>
                <Input
                  type="date"
                  name="checkInDate"
                  className="mb-3"
                  value={customer.checkInDate}
                  onChange={handleInputChange}
                />
              </Col>
              <Col md="6">
                <Label>Check in Date</Label>
                <Input
                  type="time"
                  name="checkInTime"
                  className="mb-3"
                  value={customer.checkInTime}
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
                Confirm Check-in
              </Button>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

HotelDashboard3.propTypes = {
  sessionId: PropTypes.string.isRequired,
  actionType: PropTypes.string.isRequired,
  bookingCartId: PropTypes.number.isRequired,
  selectedRooms: PropTypes.array.isRequired, // Change from object to array
  // setSelectedRooms: PropTypes.func.isRequired,
};

export default HotelDashboard3;
