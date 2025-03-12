import React, { useState, useEffect } from 'react';
// import { Row, Col, Form, FormGroup, Label, Button, Input,InputGroup,Dropdown,DropdownMenu,DropdownToggle,DropdownItem } from 'reactstrap';
import { Row, Col, Form, FormGroup, Label, Button, Input } from 'reactstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Select from "react-select";
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
// import BookingModal from '../../components/BookingTable/BookingModal';
import api from '../../constants/api';
import message from '../../components/Message';
import creationdatetime from '../../constants/creationdatetime';
import TenderContactDetails from '../../components/TenderTable/TenderContactDetails';

const BookingDetails = () => {
  //All state Variables
  // const [modal, setModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState();

  //Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState();

  // const toggle = () => {
  //   setModal(!modal);
  // };

  //Logic for adding category in db
  // const [companyInsertData, setCompanyInsertData] = useState({
  //   company_id: '',
  //   phone: '',
  //   website: '',
  //   address_flat: '',
  //   address_street: '',
  //   address_town: '',
  //   address_state: '',
  //   longitude: '',
  //   latitude: '',
  // });

  //setting data in companyInsertData
  // const handleInputs = (e) => {
  //   setCompanyInsertData({ ...companyInsertData, [e.target.name]: e.target.value });
  // };
  //Api call for getting company dropdown
  const getCompany = () => {
    api
      .get('/contact/getContact')
      .then((res) => {
        setCompany(res.data.data);
      })
      .catch(() => {
        message('Company not found', 'info');
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
    gst_no:'',
  });

  const handleAddNewContact = (e) => {
    setNewContactData({ ...newContactData, [e.target.name]: e.target.value });
  };

  const AddNewContact = () => {
    const newDataWithCompanyId = newContactData;
    // newDataWithCompanyId.company_id = selectedCompany;
    if (
      newDataWithCompanyId.salutation !== '' &&
      newDataWithCompanyId.first_name !== '' 
    
    ) {
      api
        .post('/contact/insertContact', newDataWithCompanyId)
        .then(() => {
          // getContact(newDataWithCompanyId.company_id);
          message('Contact Inserted Successfully', 'success');
          window.location.reload();
        })
        .catch(() => {
          message('Unable to add Contact! try again later', 'error');
        });
    } else {
      message('All fields are required.', 'info');
    }
  };
  
  const calculateDays = (startDate, endDate) => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const difference = Math.ceil((end - start) / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
    return difference >= 0 ? difference : 0; // Ensure it's not negative
  };

  //Api for insertCompany
  // const insertCompany = () => {
  //   if (companyInsertData.company_name !== '' && companyInsertData.address_flat !== '') {
  //     api
  //       .post('/company/insertCompany', companyInsertData)
  //       .then(() => {
  //         message('Company inserted successfully.', 'success');
  //         getCompany();
  //         toggle();
  //       })
  //       .catch(() => {
  //         message('Network connection error.', 'error');
  //       });
  //   } else {
  //     message('Please fill all required fields', 'warning');
  //   }
  // };

  //setting data in companyInsertData
  const handleBookingInputs = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  //Logic for adding Booking in db
  const insertBooking = () => {
    api
      .post('/booking/getBookingValidationInsert', {
        booking_date: bookingDetails.booking_date,
        to_booking_date: bookingDetails.to_booking_date,
        assign_time: bookingDetails.assign_time,
        to_assign_time: bookingDetails.to_assign_time,
        hall: bookingDetails.hall,
        booking_id:id,
        contact_id:bookingDetails.contact_id,
        total_hour : calculateDays()
      })
      .then((res1) => {
        if (res1.data.msg === 'Booking already exists for this date, time, and hall') {
          message('Booking already exists for this time slot and date.', 'warning');
        } else if (bookingDetails.contact_id !== '') {
      bookingDetails.creation_date = creationdatetime;
      console.log('res1',res1)
      
         const insertedDataId = res1.data.data.insertId;
      //     message('Booking inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/BookingEdit/${insertedDataId}`);
          }, 300);
     
    } else {
      message('Please fill all required fields', 'warning');
    }
  })
  .catch(() => {
    message('Unable to retrieve booking validation data.', 'error');
  });
  };

  useEffect(() => {
    getCompany();
  }, [id]);

  const options = company?.map((e) => ({
    value: e.contact_id,
    label: e.first_name,
  }));

//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedCustomer, setSelectedCustomer] = useState("Select Customer");

//   const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

//   // Filter customers based on search term
//   const filteredCompany = company?.filter((e) =>
//   (e.first_name && e.first_name.toLowerCase().includes(searchTerm.toLowerCase())) || 
//   (e.phone_direct && e.phone_direct.toLowerCase().includes(searchTerm.toLowerCase()))
// );




  return (
    <div>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Row>
        <Col md="12">
          <ComponentCard title="Booking Details">
            <Form>
              <FormGroup>
                <Row>
                <Col md="4">
      <Label>
        Customer Name (OR){" "}
        <span className="anchor" onClick={addContactToggle}>
          <b>
            <u>Add New</u>
          </b>
        </span>
      </Label>

      <Select
        options={options}
        placeholder="Select or search customer..."
        onChange={(selectedOption) =>
          handleBookingInputs({ target: { name: "contact_id", value: selectedOption?.value } })
        }
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

    {/* <Col md="4">
      <Label>
        Customer Name (OR){" "}
        <span className="anchor" onClick={addContactToggle}>
          <b>
            <u>Add New</u>
          </b>
        </span>
      </Label>

      <InputGroup>
        <Input value={selectedCustomer} readOnly onClick={toggleDropdown} />
        <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown}>
          <DropdownToggle caret>🔽</DropdownToggle>
          <DropdownMenu>
            <Input
              type="text"
              placeholder="Search customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
            {filteredCompany?.length > 0 ? (
              filteredCompany?.map((e) => (
                <DropdownItem
                  key={e.contact_id}
                  onClick={() => {
                    setSelectedCustomer(e.first_name);
                    handleBookingInputs({ target: { name: "contact_id", value: e.contact_id } });
                    setDropdownOpen(false);
                  }}
                >
                  {e.first_name}
                </DropdownItem>
              ))
            ) : (
              <DropdownItem disabled>No customer found</DropdownItem>
            )}
          </DropdownMenu>
        </Dropdown>
      </InputGroup>

      <TenderContactDetails
        addContactModal={addContactModal}
        addContactToggle={addContactToggle}
        AddNewContact={AddNewContact}
        handleAddNewContact={handleAddNewContact}
        newContactData={newContactData}
      />
    </Col> */}
                  <Col md="4">
                <FormGroup>
                  <Label>
                From Date <span className="required"> *</span>
                  </Label>
                  <Input
                    type="date"
                    onChange={handleBookingInputs}
                    value={
                      bookingDetails && bookingDetails.booking_date
                    }
                    name="booking_date"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
                <FormGroup>
                  <Label>
                  To Date <span className="required"> *</span>
                  </Label>
                  <Input
                    type="date"
                    onChange={handleBookingInputs}
                    value={
                      bookingDetails && bookingDetails.to_booking_date
                    }
                    name="to_booking_date"
                  />
                </FormGroup>
              </Col>
              <Col md="4">
              <FormGroup>
                <Label>Total Days</Label>
                <Input
                  type="text"
                  onChange={handleBookingInputs}
                  value={calculateDays(bookingDetails?.booking_date, bookingDetails?.to_booking_date)}
                  readOnly
                />
              </FormGroup>
            </Col>
              {/* <Col md="4">
                <FormGroup>
                  <Label>Court</Label>
                  <Input
                    value={bookingDetails && bookingDetails.hall}
                    type="select"
                    onChange={handleBookingInputs}
                    name="hall"
                  >
                    <option value="">Please Select</option>
                    <option value="Court 1">Court 1</option>
                    <option value="Court 2">Court 2</option>
                  </Input>
                </FormGroup>
              </Col> */}
                  <Col md="4">
                <FormGroup>
                  <Label>Check In Time</Label>
                  <Input
                    value={bookingDetails && bookingDetails.assign_time}
                    type="select"
                    onChange={handleBookingInputs}
                    name="assign_time"
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
              <Col md="4">
                <FormGroup>
                  <Label>Check Out Time</Label>
                  <Input
                    value={bookingDetails && bookingDetails.to_assign_time}
                    type="select"
                    onChange={handleBookingInputs}
                    name="to_assign_time"
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
                    <option value="12:00 PM">12:00 AM</option>                  </Input>
                </FormGroup>
              </Col>
            
                  {/* <Col md="2" className="addNew">
                    <Label>Add New Customer</Label>
                    <Button color="primary" className="shadow-none" onClick={toggle.bind(null)}>
                      Add New
                    </Button>
                  </Col> */}
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        insertBooking();
                      }}
                      type="button"
                      className="btn mr-2 shadow-none"
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate(-1);
                      }}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
                      Go to List
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </ComponentCard>
        </Col>
      </Row>

      {/* <BookingModal
        toggle={toggle}
        handleInputs={handleInputs}
        insertCompany={insertCompany}
        modal={modal}
      ></BookingModal> */}
    </div>
  );
};
export default BookingDetails;
