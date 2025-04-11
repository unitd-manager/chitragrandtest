import React, { useState,useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import {
  Row,
  Col,
  TabContent,
  TabPane,
  Button,
} from 'reactstrap';
import * as Icon from 'react-feather';
import PropTypes from 'prop-types';
// import Swal from 'sweetalert2';
import ComponentCard from '../ComponentCard';
import AttachmentModalV2 from '../Tender/AttachmentModalV2';
import ViewFileComponentV2 from '../ProjectModal/ViewFileComponentV2';
import AddNote from '../Tender/AddNote';
import ViewNote from '../Tender/ViewNote';
import Tab from '../project/Tab';
// import FinanceTab from '../ProjectModal/FinanceTab';
// import BookingRoomLinked from './BookingRoomLinked';
// import BookingRoomEditModal from './BookingRoomEditModal'
// import BookingRoomViewModal from './BookingRoomViewModal'
// import api from '../../constants/api';
// import message from '../Message';
import '../../assets/css/Loader.css'


export default function BookingMoreDetails({
  dataForPicture,
  attachmentModal,
  setAttachmentModal,
  id,
  pictureData,
  // servicelinkeddetails,
  // bookingDetails,
  // contactAddress,
}) {
  BookingMoreDetails.propTypes = {
    dataForPicture: PropTypes.func,
    attachmentModal: PropTypes.bool,
    setAttachmentModal: PropTypes.func,
    id: PropTypes.any,
    pictureData: PropTypes.any,
    // servicelinkeddetails: PropTypes.any,
    // bookingDetails: PropTypes.any,
    // contactAddress: PropTypes.any,
  };

  const [roomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState();
  const [activeTab, setActiveTab] = useState('1');
  // const [roomType, setRoomType] = useState();
  // const [editContactEditModal, setEditContactEditModal] = useState(false);
  // const [editContactViewModal, setEditContactViewModal] = useState(false);
  // const [addContactModal, setAddContactModal] = useState(false);
  // const [contactsDetails, setContactsDetails] = useState(null);
  // const [contactData, setContactData] = useState();
  // const [bookingHistory, setBookingHistory] = useState();
  // const [BookingroomStatus, setBookingroomStatus] = useState();
  // const [orderId, setOrderId] = useState(null);
  // const [isLoading, setIsLoading] = useState(false);
  // const [isLoadingout, setIsLoadingout] = useState(false);


  // const getOrdersById = () => {
  //   api
  //     .post('/booking/getOrdersbooking',{ booking_id: id })
  //     .then((res) => {
  //       setOrderId(res.data.data[0].order_id);
  //     })
  //     .catch(() => {
        
  //     });
  // };

  // const getRoomType = () => {
  //   api
  //     .get('/booking/getRoom')
  //     .then((res) => {
  //       setRoomType(res.data.data);
  //     })
  //     .catch(() => {
     
  //     });
  // };

  // const getContactLinked = () => {
  //   api
  //     .post('/booking/getBookingServiceById', { booking_id: id })
  //     .then((res) => {
  //       setContactsDetails(res.data.data);
  //     })
  //     .catch(() => {
  //       // message('Room Data Not Found', 'info');
  //     });
  // };


  // const getValuelistStatus = () => {
  //   api
  //     .get('/booking/get-ValueListRoomStatus')
  //     .then((res) => {
  //       setBookingroomStatus(res.data.data);
  //     })
  //     .catch(() => {
  //       message('valuelist not found', 'info');
  //     });
  // };
  // const addContactToggle = () => {
  //   setAddContactModal(!addContactModal);
  // };

  // const [newContactData, setNewContactData] = useState({
  //   room_type: '',
  //   room_number: '',
  // });

//   const AddNewContact = () => {
  
//         const newContactWithCompanyId = newContactData;
//     newContactWithCompanyId.booking_id = id;
//     newContactWithCompanyId.is_available = "No";
//     if (
//       newContactWithCompanyId.room_type !== '' 
     
    
//     ) {

//       api
//       .post('/booking/BookingHistoryRoomNumber', { room_number:newContactData && newContactData.room_number})
//       .then((res1) => {
//         newContactWithCompanyId.amount = res1.data.data[0].amount;
//         newContactWithCompanyId.qty = 1;
//         console.log('amount',res1.data.data)
//     api
//       .post('/booking/insertBookingHistory', newContactWithCompanyId)
//       .then(() => {
//         message('Room inserted successfully.', 'success');
       

//         api
//         .post('/booking/BookingHistoryRoomNumber', { room_number:newContactData && newContactData.room_number})
//         .then((res) => {
//          const statusinsert = {
//           room_history_id: res.data.data[0].room_history_id, 
//           is_available: "No"
//         };
//         api
//         .post('/booking/edit-Rooms-History-Edit', statusinsert)
//         .then(() => {
//           message('Record editted successfully', 'success');
//           window.location.reload();
//         })
//       })
//       })
//       .catch(() => {
//         message('Network connection error.', 'error');
//       });
//     })
//   }else {
//     message('Please fill all required fields', 'warning');
//   }
// };


  // const handleAddNewContact = (e) => {
  //   setNewContactData({ ...newContactData, [e.target.name]: e.target.value });
  // };

    // Start for tab refresh navigation #Renuka 1-06-23
    const tabs =  [
    // {id:'1',name:'Rooms Linked'},
    // {id:'2',name:'Invoice'},
    {id:'1',name:'Attachment'},
    {id:'2',name:'Add Note'},
    ];
    const toggle = (tab) => {
      setActiveTab(tab);
    };
    
    // const deleteRecord = (staffId) => {
    //   Swal.fire({
    //     title: `Are you sure? `,
    //     text: "You won't be able to revert this!",
    //     icon: 'warning',
    //     showCancelButton: true,
    //     confirmButtonColor: '#3085d6',
    //     cancelButtonColor: '#d33',
    //     confirmButtonText: 'Yes, delete it!',
    //   }).then((result) => {
    //     if (result.isConfirmed) {
    //       api
    //         .post('/booking/deleteBookingHistory', { booking_service_id: staffId })
    //         .then(() => {
    //           Swal.fire('Deleted!', 'Room has been deleted.', 'success');
    //           message('Record deleted successfully', 'success');
    //           window.location.reload();
    //         })
    //         .catch(() => {
    //           message('Unable to delete record.', 'error');
    //         });
    //     }
    //   });
    // };

    // const editOrderItemUpdate = async () => {
    //   try {
    //     const isConfirmed = window.confirm("Are you sure you want to update this Booking?");
    
    //     if (!isConfirmed) {
    //       return; // Stop execution if the user cancels
    //     }
    //     setIsLoading(true);
    //     const res = await api.post('/booking/getBookingServiceById', { booking_id: id });
    
    //     if (!res.data.data || res.data.data.length === 0) {
    //       console.error("No room order data found");
    //       alert("No room order data found");
    //       return;
    //     }
    
    //     // Create an array of promises
    //     const orderItemPromises = res.data.data.map((item) => {
    //       const orderItem = {
    //         booking_service_id: item.booking_service_id,
    //         order_id: item.order_id, 
    //         unit_price: item.amount,
    //         cost_price: item.amount * item.qty,
    //         item_title: item.room_type,
    //         qty: item.qty,
           
    //       };
    
    //       console.log("Updating order item:", orderItem);
    
    //       return api.post('/finance/editorderItem', orderItem);
    //     });
    
    //     // Wait for all API calls to complete
    //     await Promise.all(orderItemPromises);
    
    //     alert("Order has been updated successfully.");
    //     window.location.reload();
    //   } catch (error) {
    //     console.error("Error updating booking:", error);
    //     alert("Failed to update booking.");
    //   }
    //   finally {
    //     setIsLoading(false); // Hide loader after API call (success or failure)
    //   }
    // };

    // const RoomVacate = async () => {
    //   try {
    //     const isConfirmed = window.confirm("Are you sure you want to Check Out?");
    //     if (!isConfirmed) return; // Stop execution if user cancels
    
    //     setIsLoadingout(true);
    
    //     // Fetch booking service details
    //     const res = await api.post('/booking/getBookingServiceById', { booking_id: id });
    
    //     if (!res.data.data || res.data.data.length === 0) {
    //       alert("No room history data found");
    //       return;
    //     }
    
    //     const roomNumbers = res.data.data.map((item) => item.room_number); // Extract room numbers
    
    //     // Fetch room history for each room number
    //     const roomHistoryPromises = roomNumbers.map(async (roomNumber) => {
    //       const res1 = await api.post('/booking/BookingHistoryRoomNumber', { room_number: roomNumber });
    
    //       if (!res1.data.data || res1.data.data.length === 0) {
    //         console.warn(`No room history found for room number: ${roomNumber}`);
    //         return null;
    //       }
    
    //       return {
    //         room_history_id: res1.data.data[0].room_history_id, // Use first result
    //         is_available: "yes",
    //       };
    //     });
    
    //     // Resolve all room history fetch requests
    //     const roomHistories = await Promise.all(roomHistoryPromises);
    
    //     // Filter out null values (in case no history was found for some rooms)
    //     const validRoomUpdates = roomHistories.filter(Boolean);
    
    //     // Update room availability in parallel
    //     const roomUpdatePromises = validRoomUpdates.map((statusInsert) =>
    //       api.post('/booking/edit-Rooms-History-Edit', statusInsert)
    //     );
    
    //     await Promise.all(roomUpdatePromises);
    
    //     // Update booking status to "Completed"
    //     await api.post("/booking/edit-Booking_status", { status: "Completed", booking_id: id });
    
    //     alert("Check Out Successfully!");
    //     window.location.reload();
    //   } catch (error) {
    //     console.error("Error updating booking:", error);
    //     alert("Failed to update booking.");
    //   } finally {
    //     setIsLoadingout(false); // Hide loader after API call (success or failure)
    //   }
    // };
    
    

    // const BookingHistory = (roomTyp) => {
    //   api
    //     .post('/booking/BookingHistoryById', { room_type:roomTyp})
    //     .then((res) => {
    //       setBookingHistory(res.data.data);
    //     })
    //     .catch(() => {
    //     });
    // };

    // console.log('test',bookingHistory)
    useEffect(() => {
      // getRoomType()
      // getContactLinked()
      // getValuelistStatus()
      // getOrdersById();
    }, [id]);

    // useEffect(() => {
    //   BookingHistory(newContactData && newContactData.room_type)
    // }, [newContactData && newContactData.room_type]);
  return (
    <ComponentCard title="More Details">
       {/* {isLoading && (
  <div className="loader-overlay">
    <div className="spinner"></div>
    <p>Processing Update Booking...</p>
  </div>
)}
   {isLoadingout && (
  <div className="loader-overlay">
    <div className="spinner"></div>
    <p>Processing Check Out...</p>
  </div>
)} */}
      <ToastContainer></ToastContainer>
      <Tab toggle={toggle} tabs={tabs} />
      <TabContent className="p-4" activeTab={activeTab}>
         {/* <TabPane tabId="1">
         <BookingRoomLinked
          roomStatus ={roomType}
          orderId={orderId}
          id={id}
          RoomVacate={RoomVacate}
          editOrderItemUpdate={editOrderItemUpdate}
          setContactData={setContactData}
          setEditContactEditModal={setEditContactEditModal}
          setEditContactViewModal={setEditContactViewModal}
          deleteRecord={deleteRecord}
          editContactEditModal={editContactEditModal}
          editContactViewModal={editContactViewModal}
          addContactToggle={addContactToggle}
          addContactModal={addContactModal}
          newContactData={newContactData}
          contactsDetails={contactsDetails}
          handleAddNewContact={handleAddNewContact}
          AddNewContact={AddNewContact}
          bookingHistory={bookingHistory}
          bookingDetails={bookingDetails}
          getOrdersById={getOrdersById}
          contactAddress={contactAddress}
         >
         </BookingRoomLinked>
         <BookingRoomEditModal
              editContactEditModal={editContactEditModal}
              setEditContactEditModal={setEditContactEditModal}
              contactData={contactData}
              roomStatus={roomType}
              BookingroomStatus={BookingroomStatus}
            />
            <BookingRoomViewModal
             editContactViewModal={editContactViewModal}
             setEditContactViewModal={setEditContactViewModal}
             contactData={contactData}
             roomStatus={roomType}
             BookingroomStatus={BookingroomStatus}
            />
         </TabPane> */}
         {/* <TabPane tabId="2">

         <FinanceTab projectId={id} projectDetail={bookingHistory} servicelinkeddetails={servicelinkeddetails}></FinanceTab>
         </TabPane> */}
         <TabPane tabId="1">
          <ComponentCard title="Picture">
            <Row>
              <Col xs="12" md="3" className="mb-3">
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    setRoomName('ReservationPicture');
                    setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF']);
                    dataForPicture();
                    setAttachmentModal(true);
                  }}
                >
                  <Icon.Image className="rounded-circle" width="20" />
                </Button>
              </Col>
            </Row>
            <AttachmentModalV2
              moduleId={id}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              roomName={roomName}
              fileTypes={fileTypes}
              altTagData="Reservation Data"
              desc="Reservation Data"
              recordType="ReservationPicture"
              mediaType={pictureData.modelType}
            />
            <ViewFileComponentV2
              moduleId={id}
              roomName="ReservationPicture"
              recordType="ReservationPicture"
            />
          </ComponentCard>  
        </TabPane>
        <TabPane tabId="2">
        <Row>
            <ComponentCard title="Add a note">
              <AddNote recordId={id} roomName="ReservationEdit" />
              <ViewNote recordId={id} roomName="ReservationEdit" />
            </ComponentCard>
          </Row>
        </TabPane>
      </TabContent>
    </ComponentCard>
  );
}
