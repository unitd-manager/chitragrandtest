import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import { ToastContainer } from 'react-toastify';
import {
 
  TabContent,
  TabPane,

} from 'reactstrap';
import ComponentCard from '../../components/ComponentCard';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
import api from '../../constants/api';
//import CategoryButton from '../../components/CategoryTable/CategoryButton';
import ContactDetailComp from '../../components/ContactTable/ContactDetailComp';
import creationdatetime from '../../constants/creationdatetime';
import ApiButton from '../../components/ApiButton';
import Tab from '../../components/project/Tab';
import BookingHistory from '../../components/BookingTable/BookingHistory';

const ContactEdit = () => {
  //All state variables
  const [contactDetails, setContactDetails] = useState();
  const [bookingHistory, setBookingHistory] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  //Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();

  const backToList = () => {
    navigate('/Contact');
  };

  const tabs =  [
    {id:'1',name:'Booking History'},
   
  ];
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleInputs = (e) => {
    setContactDetails({ ...contactDetails, [e.target.name]: e.target.value });
  };

  // Get Category By Id
  const ContactById = () => {
    api
      .post('/contact/getContactById', { contact_id: id })
      .then((res) => {
        setContactDetails(res.data.data[0]);
      })
      .catch(() => {
       
      });
  };

  const BookingHistorys = () => {
    api
      .post('/booking/getBookingDataHistory', { contact_id: id })
      .then((res) => {
        setBookingHistory(res.data.data);
      })
      .catch(() => {
       
      });
  };
  console.log('bookingHistory',bookingHistory)
  //Logic for edit data in db
  const editContactData = () => {
    contactDetails.modification_date = creationdatetime;
    if (contactDetails.first_name !== '') {
      api
        .post('/contact/editContact', contactDetails)
        .then(() => {
          message('Record editted successfully', 'success');
        })
        .catch(() => {
          message('Unable to edit record.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  //For delete data in db
  const deleteContactData = () => {
    api
      .post('/contact/deleteContact', { contact_id: id })
      .then(() => {
        message('Record deteled successfully', 'success');
      })
      .catch(() => {
        message('Unable to delete record.', 'error');
      });
  };

  useEffect(() => {
    ContactById();
    BookingHistorys();
  }, [id]);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <ApiButton
              editData={editContactData}
              navigate={navigate}
              applyChanges={editContactData}
              backToList={backToList}
              deleteData={deleteContactData}
              module="Contact"
            ></ApiButton>

      {/* More details*/}
      <ContactDetailComp
        contactDetails={contactDetails}
        handleInputs={handleInputs}
      ></ContactDetailComp>
      <ComponentCard title="More Details">
      <Tab toggle={toggle} tabs={tabs} />
      <TabContent className="p-4" activeTab={activeTab}>
      <TabPane tabId="1">

      </TabPane>
      </TabContent>
       <BookingHistory bookingHistory={bookingHistory}></BookingHistory>
      </ComponentCard>
    </>
  );
};
export default ContactEdit;
