import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import { ToastContainer } from 'react-toastify';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';
import BookingMoreDetails from '../../components/BookingTable/BookingMoreDetails';
//import BookingButton from '../../components/BookingTable/BookingButton';
import BookingDetailComp from '../../components/BookingTable/BookingDetailComp';
import ComponentCard from '../../components/ComponentCard';
import BookingEditCustomerModal from '../../components/BookingTable/BookingEditCustomerModal';
import ApiButton from '../../components/ApiButton';


const BookingEdit = () => {
  //state variables
  const [activeTab, setActiveTab] = useState('1');
  const [bookingDetails, setBookingDetails] = useState();
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [servicelinkeddetails, setServiceLinkedDetails] = useState(null);
  const [editcustomermodal, setEditCustomerModal] = useState(false);  
  const [contact, setContact] = useState();

  // TOGGLE Tab
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  //  AttachmentModal UseState
  const [pictureData, setDataForPicture] = useState({
    modelType: '',
  });

  //Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();

  // Button Save Apply Back List
  //const applyChanges = () => {};
  const backToList = () => {
    navigate('/Booking');
  };

  const [addContactModal, setAddContactModal] = useState(false);
  const addContactToggle = () => {
    setAddContactModal(!addContactModal);
  };  

  //Api call for getting contact dropdown
  const getContact = () => {
    api
      .get('/contact/getContact')
      .then((res) => {
        setContact(res.data.data);
      })
      .catch(() => {
        message('contact not found', 'info');
      });
  };

 //setting data in bookingDetails
  const handleInputs = (e) => {
    setBookingDetails({ ...bookingDetails, [e.target.name]: e.target.value });
  };

  // For getting Booking data By Id
  const editBookingById = () => {
    api
      .post('/booking/getBookingById', { booking_id: id })
      .then((res) => {
        setBookingDetails(res.data.data[0]);
      })
      .catch(() => {
        // message('Booking Data Not Found', 'info');
      });
  };
 
  //Logic for edit data in db
  const editBookingData = () => {
    api
      .post('/booking/getBookingValidation', {
        booking_date: bookingDetails.booking_date,
        assign_time: bookingDetails.assign_time,
        to_assign_time: bookingDetails.to_assign_time,
        hall: bookingDetails.hall,
        booking_id:id
      })
      .then((res) => {
        if (res.data.msg === 'Booking already exists for this date, time, and hall') {
          message('Booking already exists for this time slot and date.', 'warning');
        } else if (bookingDetails.company_name !== '' && bookingDetails.booking_date !== '') {
          bookingDetails.modification_date = creationdatetime;
          api
            .post('/booking/edit-Booking', bookingDetails)
            .then(() => {
              message('Record edited successfully', 'success');
              editBookingById();
            })
            .catch(() => {
              message('Unable to edit record.', 'error');
            });
        } else {
          message('Please fill all required fields', 'warning');
        }
      })
      .catch(() => {
        message('Unable to retrieve booking validation data.', 'error');
      });
  };
  
  //delete data in db
  const deleteBookingData = () => {
    api
      .post('/booking/deleteBooking', { booking_id: id })
      .then(() => {
        message('Record deteled successfully', 'success');
      })
      .catch(() => {
        message('Unable to delete record.', 'error');
      });
  };

  const handleserviceInputs = (e) => {
    setServiceLinkedDetails({ ...servicelinkeddetails, [e.target.name]: e.target.value });
  };

  //get booking service data in db
  const getServiceLinked = () => {
    api
      .post('/booking/getTabServiceLinkById', { booking_service_id: id })
      .then((res) => {
        setServiceLinkedDetails(res.data.data[0]);
      })
      .catch(() => {
        // message('service linked not found', 'info');
      });
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
          getContact(newDataWithCompanyId.company_id);
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

  const [contactAddress, setContactAddress] = useState();

  console.log('contactAddress',contactAddress)

 
  const getContactbyid = () => {
    api
      .post('/contact/getContactById',{contact_id:bookingDetails && bookingDetails.contact_id})
      .then((res) => {
        setContactAddress(res.data.data[0]);
      })
      .catch(() => {
       
      });
  };

  useEffect(() => {
 
    getContactbyid();
  }, [bookingDetails && bookingDetails.contact_id]); 


  // Attachment
  const dataForPicture = () => {
    setDataForPicture({
      modelType: 'picture',
    });
  };

  useEffect(() => {
    editBookingById();
    getContact();
    getServiceLinked();
  }, [id]);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer />

      {/* Button */}
      {/* <BookingButton
        editBookingData={editBookingData}
        navigate={navigate}
        applyChanges={applyChanges}
        deleteBookingData={deleteBookingData}
        backToList={backToList}
        id={id}
      ></BookingButton> */}
 <ApiButton
              editData={editBookingData}
              navigate={navigate}
              applyChanges={editBookingData}
              backToList={backToList}
              deleteData={deleteBookingData}
              module="Booking"
            ></ApiButton>
      {/*Main Details*/}
      <ComponentCard title="Booking Details" creationModificationDate={bookingDetails}>
        <BookingDetailComp
          bookingDetails={bookingDetails}
          handleInputs={handleInputs}
          contact={contact}
          toggle={toggle}
          setEditCustomerModal={setEditCustomerModal}
          addContactModal={addContactModal}
          setAddContactModal={setAddContactModal}
          addContactToggle={addContactToggle}
          handleAddNewContact={handleAddNewContact}
          newContactData={newContactData}
          AddNewContact={AddNewContact}
        ></BookingDetailComp>
      </ComponentCard>

      <BookingEditCustomerModal
     editcustomermodal={editcustomermodal}
     setEditCustomerModal={setEditCustomerModal}
      ></BookingEditCustomerModal>

      <BookingMoreDetails
        servicelinkeddetails={servicelinkeddetails}
        activeTab={activeTab}
        bookingDetails={bookingDetails}
        toggle={toggle}
        handleserviceInputs={handleserviceInputs}
        dataForPicture={dataForPicture}
        pictureData={pictureData}
        attachmentModal={attachmentModal}
        id={id}
        setAttachmentModal={setAttachmentModal}
        contactAddress={contactAddress}
      ></BookingMoreDetails>


    </>
  );
};

export default BookingEdit;
