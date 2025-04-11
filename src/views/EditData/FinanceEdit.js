import React, { useEffect, useState } from 'react';
import { Button, Col, Row, TabContent, TabPane } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import '../form-editor/editor.scss';
import InvoiceData from '../../components/Finance/InvoiceData';
import InvoiceModal from '../../components/Finance/InvoiceModal';
import ReceiptModal from '../../components/Finance/ReceiptModal';
import CreateReceipt from '../../components/Finance/CreateReceipt';
// import CreateNote from '../../components/Finance/CreateNote';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import message from '../../components/Message';
import api from '../../constants/api';
import CustomerDetail from '../../components/Finance/CustomerDetail';
import FinanceInvoiceModal from '../../components/Finance/FinanceInvoiceModal';
import CustomerFinanceReceipt from '../../components/Finance/CustomerFinanceReceipt';
// import CustomerFinanceCreditNote from '../../components/Finance/CustomerFinanceCreditNote';
import FinanceSummary from '../../components/Finance/FinanceSummary';
//import FinanceButton from '../../components/Finance/FinanceButton';
import FinanceDeliveryAddress from '../../components/Finance/FinanceDeliveryAddress';
import FinanceMainDetails from '../../components/Finance/FinanceMainDetails';
import creationdatetime from '../../constants/creationdatetime';
import Tab from '../../components/project/Tab';
import ApiButton from '../../components/ApiButton';

const FinanceEdit = () => {
  // All state variables
  const [editInvoiceData, setEditInvoiceData] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  const [editCreateReceipt, setEditCreateReceipt] = useState(false);
  // const [editCreateNote, setEditCreateNote] = useState(false);
  const [editInvoiceModal, setEditInvoiceModal] = useState(false);
  const [editReceiptModal, setEditReceiptModal] = useState(false);
  const [editReceiptDataModal, setReceiptDataModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [financeDetails, setFinanceDetails] = useState();
  const [createInvoice, setCreateInvoice] = useState(null);
  const [cancelInvoice, setCancelInvoice] = useState(null);
  const [cancelReceipt, setCancelReceipt] = useState(null);

  const [receipt, setReceipt] = useState(null);
  // const [note, setNote] = useState([]);
  const [invoicesummary, setInvoiceSummary] = useState(null);
  const [receiptsummary, setReceiptSummary] = useState(null);
  const [invoiceitemsummary, setInvoiceItemSummary] = useState(null);
  const [invoiceDatas, setInvoiceDatas] = useState({});
  // Navigation and Parameter Constants
  const { id } = useParams();
  const navigate = useNavigate();
  //Button fuctions
  //const applyChanges = () => {};
  const backToList = () => {
    navigate('/Finance');
  };
  //Setting Data in Finance Details
  const handleInputs = (e) => {
    setFinanceDetails({ ...financeDetails, [e.target.name]: e.target.value });
  };
  // Start for tab refresh navigation #Renuka 1-06-23
  const tabs = [
    { id: '1', name: 'Address' },
    { id: '2', name: 'Customer Details' },
    { id: '3', name: 'Summary' },
    { id: '4', name: 'Invoice(s)' },
    { id: '5', name: 'Receipt(s)' },
    // { id: '6', name: 'CreditNote(s)' },
  ];
  const toggle = (tab) => {
    setActiveTab(tab);
  };
console.log('ids',id)
  // Method for getting Invoice By Order Id
  const getInvoiceById = () => {
    api
      .post('/invoice/getInvoiceById', { order_id: id })
      .then((res) => {
        setCreateInvoice(res.data.data);
      })
      .catch(() => {
        message('Cannot get Invoice Data', 'error');
      });
  };

  //receipt Cancel
  const receiptCancel = (obj) => {
    obj.receipt_status = 'cancelled';
    api
      .post('/Finance/editTabReceiptPortalDisplay', obj)
      .then(() => {
        message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  const invoiceCancel = (obj) => {
    obj.status = 'cancelled';
    api
      .post('/Finance/editInvoicePortalDisplay', obj)
      .then(() => {
        message('Record editted successfully', 'success');
        window.location.reload();
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };
  const [OrdersDetails ,setOrdersDetails] = useState ('')
  const [orderId, setOrderId] = useState(null);
  console.log('ordersssss',orderId)
  

  const getOrdersById = () => {
    api
      .post('/booking/getOrdersbooking',{ booking_id: id })
      .then((res) => {
        setOrderId(res.data.data[0].order_id);
        console.log('order', res.data.data);
        setOrdersDetails(res.data.data[0])
        api
      .post('/invoice/getProjectReceiptById', { order_id:res.data.data[0].order_id })
      .then((resp) => {
        setReceipt(resp.data.data);
      })
      .catch(() => {
       
      });
      })
      .catch(() => {
        
      });
  };

  //get Invoice Cancel
  const getInvoiceCancel = () => {
    api
      .post('/invoice/getInvoiceCancel', { order_id: id })
      .then((res) => {
        setCancelInvoice(res.data.data);
      })
      .catch(() => {
        message('Cannot get Invoice Data', 'error');
      });
  };
  //get receipt
  const getReceiptCancel = () => {
    api
      .post('/invoice/getReceiptCancel', { order_id: id })
      .then((res) => {
        setCancelReceipt(res.data.data);
      })
      .catch(() => {
        message('Cannot get Invoice Data', 'error');
      });
  };
  //For getting Receipy By Order Id
  const getReceiptById = () => {
    api
      .post('/invoice/getReceiptById', { order_id: id })
      .then((res) => {
        setReceipt(res.data.data);
      })
      .catch(() => {
        message('Cannot get Receipt Data', 'error');
      });
  };

  //For getting Credit By Order Id
  // const getCreditById = () => {
  //   api
  //     .post('/invoice/getNoteById', { order_id: id })
  //     .then((res) => {
  //       setNote(res.data.data);
  //     })
  //     .catch(() => {
  //       message('Cannot get Invoice Data', 'error');
  //     });
  // };

  //For getting Summary By Order Id
  const getInvoiceSummaryById = () => {
    api
      .post('/Finance/getInvoiceSummary', { order_id: id })
      .then((res) => {
        setInvoiceSummary(res.data.data);
      })
      .catch(() => {
        message('Cannot get Invoice Data', 'error');
      });
  };

  const getInvoiceReceiptSummaryById = () => {
    api
      .post('/Finance/getInvoiceReceiptSummary', { order_id: id })
      .then((res) => {
        setReceiptSummary(res.data.data);
      })
      .catch(() => {
        message('Cannot get Invoice Data', 'error');
      });
  };

  const getInvoiceItemSummaryById = () => {
    api
      .post('/Finance/getInvoiceItemSummary', { order_id: id })
      .then((res) => {
        setInvoiceItemSummary(res.data.data);
      })
      .catch(() => {
        message('Cannot get Invoice Data', 'error');
      });
  };

  //For getting Finance By Order Id
  const getFinancesById = () => {
    api
      .post('/Finance/getFinancesById', { order_id: id })
      .then((res) => {
        setFinanceDetails(res.data.data);
      })
      .catch(() => {
        message('Fianance Data Not Found', 'info');
      });
  };

  //For editting Finace Record
  const editFinanceData = () => {
    financeDetails.modification_date = creationdatetime;
    api
      .post('/Finance/editFinancesCus', financeDetails)
      .then(() => {
        message('Record editted successfully', 'success');
      })
      .catch(() => {
        message('Unable to edit record.', 'error');
      });
  };

  const [details ,setBookingServiceAmount] = useState ('')
  const [totalAmount ,setBookingServiceAmountm] = useState ('')
  const [bookingServicename ,setBookingServiceName] = useState ('')
  const [isLoading, setIsLoading] = useState(false);
  console.log(details)
  const getServiceAmountSSS = () => {
    api
      .post('/booking/getBookingAmount', { booking_id: id })
      .then((res) => {
        setBookingServiceAmountm(res.data.data[0]);
      })
      .catch(() => {
       
      });
  };


  const getServiceAmount = () => {
    api
      .post('/finance/getBookingOrderAmount', { order_id: id })
      .then((res) => {
        setBookingServiceAmount(res.data.data[0]);
      })
      .catch(() => {
       
      });
  };

  const getServiceLinked = () => {
    api
      .post('/finance/getBookingOrderItem', { order_id: id })
      .then((res) => {
        setBookingServiceName(res.data.data);
      })
      .catch(() => {
       
      });
  };

  const placeOrder = async () => {
    try {

      const isConfirmed = window.confirm("Are you sure you want to Create Invoice?");
      
          if (!isConfirmed) {
            return; // Stop execution if the user cancels
          }

      if (!totalAmount || !totalAmount.total_amount) {
        console.error("Total amount is missing!");
        return;
      }

      setIsLoading(true);

      const invoiceCodeResponse = await api.post('/commonApi/getCodeValue', { type: "invoice",});
      const invoiceCode = invoiceCodeResponse.data.data;

        // Fetch GST value
    const getgst = await api.get('/finance/getGst');
    const gstData = getgst.data.data;  // This is likely an object { value: '12' }
    
    // Extract GST percentage safely
    const gstPercentage = parseFloat(gstData.value);  // Convert '12' (string) to 12 (number)
    
    const getIgst = await api.get('/finance/getIGst');
    const gstDataIgst = getIgst.data.data;  // This is likely an object { value: '12' }
    
    // Extract GST percentage safely
    const gstPercentagesgst = parseFloat(gstDataIgst.value);

    const getcgst = await api.get('/finance/getSGst');
    const gstDatacgst = getcgst.data.data;  // This is likely an object { value: '12' }
    
    // Extract GST percentage safely
    const gstPercentagecgst = parseFloat(gstDatacgst.value);
    

    console.log('GST Percentage:', gstPercentage);

    // ✅ Correct GST Calculation
    const totalAmountValue = parseFloat(totalAmount.total_amount); // Ensure it's a number
    const gstValue = totalAmountValue * (gstPercentage / 100); 
    const sgstValue = totalAmountValue * (gstPercentagesgst / 100); 
    const cgstValue = totalAmountValue * (gstPercentagecgst / 100);
    const invoiceAmount = totalAmountValue + gstValue; 

    console.log('GST Value:', gstValue);
    console.log('Invoice Amount:', invoiceAmount);

    // Prepare updated order details
    const updatedBookingService = { 
      ...OrdersDetails, 
      invoice_amount: invoiceAmount, 
      gst_value: gstValue,
      sgst:sgstValue,
      cgst:cgstValue,
      status: 'Due',
      invoice_code: invoiceCode
    };
      // Insert invoice
      const res = await api.post("/finance/insertInvoice", updatedBookingService);
      
      if (!res.data.data.insertId) {
        throw new Error("Invoice insertion failed!");
      }
      
      const insertedId = res.data.data.insertId;
  
      // Prepare order items for insertion
      const orderItemPromises = bookingServicename.map((item) => {
        const orderItem = {
          contact_id: item.contact_id,
          invoice_id: insertedId,
          unit_price: item.unit_price,
          total_cost: item.unit_price * item.qty,
          item_title: item.item_title,
          qty: item.qty,
          booking_id: item.booking_id,
          status: 'Due'
        };
  
        console.log("Order item:", orderItem);
  
        return api.post("/finance/insertInvoiceItem", orderItem);
      });
  
      // Wait for all order items to be inserted
      await Promise.all(orderItemPromises);
  
      // Update booking status
      const bookingStatus = { 
        status: "Completed", 
        booking_id: id
      };
  
      await api.post("/booking/edit-Booking_status", bookingStatus);
  
      console.log("All order items inserted successfully.");
      
      // Reload page after everything is completed
      window.location.reload();
  
    } catch (err) {
      console.error("Error placing order:", err);
    }
    finally {
      setIsLoading(false); // Hide loader after API call (success or failure)
    }
  };

  // const placeOrder = () => {
  //   if (!details || !details.total_amount) {
  //     console.error("Total amount is missing!");
  //     return;
  //   }
  
  //   // Ensure bookingService is an object before modifying
  //   const updatedBookingService = { ...details, invoice_amount: details.total_amount,status: 'Due' };
  
  //   api
  //     .post("/finance/insertInvoice", updatedBookingService)
  //     .then((res) => {
  //       if (!res.data.data.insertId) {
  //         throw new Error("Invoice insertion failed!");
  //       }
        
  //       const insertedId = res.data.data.insertId;
  
  //       const orderItemPromises = bookingServicename.map((item) => {
  //         const orderItem = {
  //           contact_id: item.contact_id,
  //           invoice_id: insertedId,
  //           unit_price: item.amount,
  //           total_cost: item.amount* item.qty,
  //           item_title: item.room_type,
  //           qty: item.qty,
  //           booking_id: item.booking_id,
  //           status: 'Due'
  //         };
  
  //         console.log("Order item:", orderItem);
  
  //         return api.post("/finance/insertInvoiceItem", orderItem);
  //       });
  
  //       return Promise.all(orderItemPromises);
  //     })
  //     .then(() => {
  //       window.location.reload();
  //       console.log("All order items inserted successfully.");
  //     })
  //     .catch((err) => {
  //       console.error("Error placing order:", err);
  //     });
  // };

  useEffect(() => {
    getInvoiceById();
    getFinancesById();
    getReceiptById();
    // getCreditById();
    getServiceAmount();
    getServiceLinked();
    getInvoiceCancel();
    getReceiptCancel();
    getInvoiceSummaryById();
    getInvoiceReceiptSummaryById();
    getInvoiceItemSummaryById();
    getOrdersById();
    getServiceAmountSSS();
  }, [id]);
  return (
    <>
     {isLoading && (
  <div className="loader-overlay">
    <div className="spinner"></div>
    <p>Processing your Invoice...</p>
  </div>
)}
      <BreadCrumbs heading={financeDetails && financeDetails.order_id} />
      {/* Save,Apply Buttons */}
      {/* <FinanceButton
        navigate={navigate}
        editFinanceData={editFinanceData}
        applyChanges={applyChanges}
        backToList={backToList}
      ></FinanceButton> */}
<ApiButton
              editData={editFinanceData}
              navigate={navigate}
              applyChanges={editFinanceData}
              backToList={backToList}
              module="Finance"
            ></ApiButton>
      {/* Main Details */}
      <FinanceMainDetails
        financeDetails={financeDetails}
        creationModificationDate={financeDetails}
        handleInputs={handleInputs}
      ></FinanceMainDetails>

      <ComponentCard title="More Details">
        <Tab toggle={toggle} tabs={tabs} />
        <TabContent className="p-4" activeTab={activeTab}>
          {/* Delivery address Form */}
          <TabPane tabId="1">
            <FinanceDeliveryAddress
              financeDetails={financeDetails}
              handleInputs={handleInputs}
            ></FinanceDeliveryAddress>
          </TabPane>

          {/* Customer Details Form */}
          <TabPane tabId="2">
            <CustomerDetail financeDetails={financeDetails}></CustomerDetail>
          </TabPane>
          {/* Summary */}
          <TabPane tabId="3">
            <FinanceSummary
              invoicesummary={invoicesummary}
              receiptsummary={receiptsummary}
              invoiceitemsummary={invoiceitemsummary}
            ></FinanceSummary>
          </TabPane>
          <TabPane tabId="4">
            <FinanceInvoiceModal
              createInvoice={createInvoice}
              cancelInvoice={cancelInvoice}
              invoiceCancel={invoiceCancel}
              setEditModal={setEditModal}
              setEditInvoiceModal={setEditInvoiceModal}
              setInvoiceDatas={setInvoiceDatas}
            ></FinanceInvoiceModal>
          </TabPane>
          <TabPane tabId="5">
            <CustomerFinanceReceipt
              receiptCancel={receiptCancel}
              cancelReceipt={cancelReceipt}
              receipt={receipt}
              setEditReceiptModal={setEditReceiptModal}
              setReceiptDataModal={setReceiptDataModal}
            ></CustomerFinanceReceipt>
          </TabPane>
          {/* <TabPane tabId="6">
            <CustomerFinanceCreditNote note={note}></CustomerFinanceCreditNote>
          </TabPane> */}

          <ComponentCard title="Add More">
            <ToastContainer></ToastContainer>

            {/* Modal for invoice,receipt and credit note */}

            <InvoiceData
              editInvoiceData={editInvoiceData}
              setEditInvoiceData={setEditInvoiceData}
              projectInfo={InvoiceData}
              orderId={id}
            />

            <CreateReceipt
              editCreateReceipt={editCreateReceipt}
              setEditCreateReceipt={setEditCreateReceipt}
              orderId={id}
            />

            {/* <CreateNote editCreateNote={editCreateNote} setEditCreateNote={setEditCreateNote} /> */}

            <InvoiceModal
              editModal={editModal}
              setEditModal={setEditModal}
              editInvoiceModal={editInvoiceModal}
              setInvoiceDatas={setInvoiceDatas}
        invoiceDatas={invoiceDatas}
            />
            <ReceiptModal
              editReceiptModal={editReceiptModal}
              setReceiptDataModal={setReceiptDataModal}
              editReceiptDataModal={editReceiptDataModal}
            />

            {/* Invoice,Receipt and Note tab button */}
            <Row>

              {!invoicesummary?.invoice_id &&
              <Col>
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    placeOrder();
                  }}
                >
                  Create Invoice
                </Button>
              </Col>
              }
              <Col>
                <Button
                  className="buttons"
                  color="primary"
                  onClick={() => {
                    setEditCreateReceipt(true);
                  }}
                >
                  Create Receipt
                </Button>
              </Col>
              {/* <Col>
                <Button
                  className="buttons"
                  color="primary"
                  onClick={() => {
                    setEditCreateNote(true);
                  }}
                >
                  Credit Notes
                </Button>
              </Col> */}
            </Row>
          </ComponentCard>
        </TabContent>
      </ComponentCard>
    </>
  );
};
export default FinanceEdit;
