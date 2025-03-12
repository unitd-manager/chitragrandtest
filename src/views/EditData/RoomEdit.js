import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import { ToastContainer } from 'react-toastify';
import {
 
  TabContent,
  TabPane,

} from 'reactstrap';
import Swal from 'sweetalert2';
import ComponentCard from '../../components/ComponentCard';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import message from '../../components/Message';
import api from '../../constants/api';
//import CategoryButton from '../../components/CategoryTable/CategoryButton';
import RoomDetailComp from '../../components/BookingTable/RoomDetailComp';
import creationdatetime from '../../constants/creationdatetime';
import ApiButton from '../../components/ApiButton';
import Tab from '../../components/project/Tab';
import RoomHistoryInsert from '../../components/BookingTable/RoomHistoryInsert';
import RoomEditModal from '../../components/BookingTable/RoomEditModal';

const ContactEdit = () => {
  //All state variables
  const [roomDetails, setContactDetails] = useState();
  const [bookingHistory, setBookingHistory] = useState(null);
  const [activeTab, setActiveTab] = useState('1');
  const [editContactEditModal, setEditContactEditModal] = useState(false);
  const [addContactModal, setAddContactModal] = useState(false);
  const [contactsDetails, setContactsDetails] = useState(null);
  const [contactData, setContactData] = useState();
  const [roomType, setroomType] = useState();
  const [roomStatus, setroomStatus] = useState();

  const getValuelist = () => {
    api
      .get('/booking/get-ValueListRoom')
      .then((res) => {
        setroomType(res.data.data);
      })
      .catch(() => {
        message('valuelist not found', 'info');
      });
  };

  const getValuelistStatus = () => {
    api
      .get('/booking/get-ValueListRoomStatus')
      .then((res) => {
        setroomStatus(res.data.data);
      })
      .catch(() => {
        message('valuelist not found', 'info');
      });
  };


  const addContactToggle = () => {
    setAddContactModal(!addContactModal);
  };

  //Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();

  const backToList = () => {
    navigate('/room');
  };

  const tabs =  [
    {id:'1',name:'Rooms Number And Details'},
   
  ];
  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleInputs = (e) => {
    setContactDetails({ ...roomDetails, [e.target.name]: e.target.value });
  };

  // Get Category By Id
  const RoomsById = () => {
    api
      .post('/booking/getRoomById', { room_id: id })
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

  const getContactLinked = () => {
    api
      .post('/booking/getRoomHistoryById', { room_id: id })
      .then((res) => {
        setContactsDetails(res.data.data);
      })
      .catch(() => {
        message('Room Data Not Found', 'info');
      });
  };

  const deleteRecord = (staffId) => {
    Swal.fire({
      title: `Are you sure? `,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/booking/deleteRoomsHistory', { room_history_id: staffId })
          .then(() => {
            Swal.fire('Deleted!', 'Room has been deleted.', 'success');
            message('Record deleted successfully', 'success');
            window.location.reload();
          })
          .catch(() => {
            message('Unable to delete record.', 'error');
          });
      }
    });
  };

    // insert Contact
    const [newContactData, setNewContactData] = useState({
      room_number: '',
      is_available: '',
      room_status: '',
      floor_number: '',
    });
  
    const AddNewContact = () => {
    
          const newContactWithCompanyId = newContactData;
      newContactWithCompanyId.room_id = id;
      newContactWithCompanyId.amount = roomDetails?.price_per_night ;
      if (
        newContactWithCompanyId.room_number !== '' 
       
      
      ) {
      api
        .post('/booking/insertRoomsHistory', newContactWithCompanyId)
        .then(() => {
          message('Room inserted successfully.', 'success');
          window.location.reload();
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    }else {
      message('Please fill all required fields', 'warning');
    }
  };
  
    //Contact Functions/Methods
    const handleAddNewContact = (e) => {
      setNewContactData({ ...newContactData, [e.target.name]: e.target.value });
    };
  console.log('bookingHistory',bookingHistory)

  
  //Logic for edit data in db
  const editRoomData = () => {
    roomDetails.modification_date = creationdatetime;
    if (roomDetails.room_type !== '') {
      api
        .post('/booking/edit-Rooms', roomDetails)
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
  const deleteRoomData = () => {
    api
      .post('/booking/deleteRooms', { room_id: id })
      .then(() => {
        message('Record deteled successfully', 'success');
      })
      .catch(() => {
        message('Unable to delete record.', 'error');
      });
  };

  useEffect(() => {
    RoomsById();
    BookingHistorys();
    getContactLinked();
    getValuelist();
    getValuelistStatus();
  }, [id]);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <ApiButton
              editData={editRoomData}
              navigate={navigate}
              applyChanges={editRoomData}
              backToList={backToList}
              deleteData={deleteRoomData}
              module="Room"
            ></ApiButton>

      {/* More details*/}
      <RoomDetailComp
        roomType={roomType}
        roomDetails={roomDetails}
        handleInputs={handleInputs}
      ></RoomDetailComp>

      <ComponentCard title="More Details">
      <Tab toggle={toggle} tabs={tabs} />
      <TabContent className="p-4" activeTab={activeTab}>
      <TabPane tabId="1">
      <RoomHistoryInsert
              setContactData={setContactData}
              setEditContactEditModal={setEditContactEditModal}
              deleteRecord={deleteRecord}
              contactsDetails={contactsDetails}
              addContactToggle={addContactToggle}
              addContactModal={addContactModal}
              handleAddNewContact={handleAddNewContact}
              newContactData={newContactData}
              AddNewContact={AddNewContact}
              roomStatus={roomStatus}
            ></RoomHistoryInsert>
              <RoomEditModal
              editContactEditModal={editContactEditModal}
              setEditContactEditModal={setEditContactEditModal}
              contactData={contactData}
              roomStatus={roomStatus}
            />
      </TabPane>

      </TabContent>
       {/* <BookingHistory bookingHistory={bookingHistory}></BookingHistory> */}
      </ComponentCard>
    </>
  );
};
export default ContactEdit;
