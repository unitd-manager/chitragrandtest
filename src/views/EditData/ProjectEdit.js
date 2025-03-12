import React, { useState, useEffect } from 'react';
import { CardTitle, Row, Col, TabContent, TabPane, Button } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import * as Icon from 'react-feather';
import Swal from 'sweetalert2';
import moment from 'moment';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import DuctingCostModal from '../../components/ProjectModal/DuctingCostModal';
import QuotationMoreDetails from '../../components/ProjectModal/QuotationMoreDetails';
import CreateFinance from '../../components/ProjectModal/CreateFinance';
import AddPurchaseOrderModal from '../../components/ProjectModal/AddPurchaseOrderModal';
import MaterialsusedTab from '../../components/ProjectModal/MaterialsusedTab';
import EditDeliveryOrder from '../../components/ProjectModal/EditDeliveryOrder';
import EditPoModal from '../../components/ProjectModal/EditPoModal';
import EditPOLineItemsModal from '../../components/ProjectModal/EditPOLineItemsModal';
import SubConWorkOrderPortal from '../../components/ProjectModal/SubConWorkOrderPortal';
import MaterialsTransferred from '../../components/ProjectModal/MaterialsTransferred';
import FinanceTab from '../../components/ProjectModal/FinanceTab';
import message from '../../components/Message';
import api from '../../constants/api';
//import ProjectButton from '../../components/ProjectTable/ProjectButton';
import ViewFileComponentV2 from '../../components/ProjectModal/ViewFileComponentV2';
import AttachmentModalV2 from '../../components/Tender/AttachmentModalV2';
import CostingSummary from '../../components/ProjectTabContent/CostingSummary';
import TransferModal from '../../components/ProjectModal/TransferModal';
import AddEmployee from '../../components/ProjectTabContent/AddEmployee';
import Tab from '../../components/project/Tab';
import MaterialPurchased from '../../components/project/TabContent/MaterialPurchased';
import DeliveryOrder from '../../components/project/TabContent/DeliveryOrder';
import Claim from '../../components/project/TabContent/Claim';
import ProjectEditForm from '../../components/project/ProjectEditForm';
import JobMoreDetails from '../../components/JobOrderTable.js/JobMoreDetails';
import ApiButton from '../../components/ApiButton';

const ProjectEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
 // const applyChanges = () => {};
  const backToList = () => {
    navigate('/Project');
  };
  const [projectDetail, setProjectDetail] = useState();
  const [activeTab, setActiveTab] = useState('1');
  const [addDuctingCostModal, setAddDuctingCostModal] = useState(false);
  const [viewLineModal, setViewLineModal] = useState(false);
  const [viewjobLineModal, setViewJobLineModal] = useState(false);
  const [addPurchaseOrderModal, setAddPurchaseOrderModal] = useState(false);
  const [attachmentModal, setAttachmentModal] = useState(false);
  const [update, setUpdate] = useState(false);
  const [tabdeliveryorder, setTabdeliveryorder] = useState();
  const [tabPurchaseOrderLineItemTable, setTabPurchaseOrderLineItemTable] = useState();
  const [checkId, setCheckId] = useState([]);
  const [subConWorkOrdeData, setSubConWorkOrdeData] = useState([]);
  const [editDeliveryOrder, setEditDeliveryOrder] = useState(false);
  const [editPo, setEditPo] = useState(false);
  const [editPOLineItemsModal, setEditPOLineItemsModal] = useState(false);
  const [deliveryData, setDeliveryData] = useState('');
  const [POId, setPOId] = useState('');
  const [testJsonData, setTestJsonData] = useState(null);
  const [addLineItemModal, setAddLineItemModal] = useState(false);
  const [addJobLineItemModal, setAddJobLineItemModal] = useState(false);
  const [quotation, setQuotation] = useState({});
  const [lineItem, setLineItem] = useState([]);
  const [jobOrder, setJobOrder] = useState({});
  const [joblineItem, setJobLineItem] = useState([]);
  const [quotationsModal, setquotationsModal] = useState(false);
  const [JobModal, setJobModal] = useState(false);
  const [incharge, setIncharge] = useState();
  const [costingsummary, setCostingSummary] = useState();

  const [workOrderForm, setWorkOrderForm] = useState({
    work_order_date: '',
    status: '',
    sub_con_worker_code: '',
  });

  const viewLineToggle = () => {
    setViewLineModal(!viewLineModal);
  };
  const viewLineToggle1 = () => {
    setViewJobLineModal(!viewjobLineModal);
  };
  useEffect(() => {
    api
      .post('/purchaseorder/testAPIendpoint', { project_id: id })
      .then((res) => {
        setTestJsonData(res?.data?.data);
        console.log("test",res.data.data)
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const handleClientForms = (e) => {
    setWorkOrderForm({ ...workOrderForm, [e.target.name]: e.target.value });
  };

  const [selectedPoProducts, setSelectedPoProducts] = useState([]);
  const [transferModal, setTransferModal] = useState(false);
  const [transferItem, setTransferItem] = useState({});
  const [financeModal, setFinanceModal] = useState(false);
  const [attachmentData, setDataForAttachment] = useState({
    modelType: '',
  });
  const [RoomName, setRoomName] = useState('');
  const [fileTypes, setFileTypes] = useState('');
  const [contact, setContact] = useState();

  // Start for tab refresh navigation #Renuka 31-05-23
  const tabs = [
    { id: '1', name: 'Costing Summary' },
    { id: '2', name: 'Quotations' },
    { id: '3', name: 'PO' },
    { id: '4', name: 'Job Order' },
    { id: '5', name: 'Materials Purchased' },
    { id: '6', name: 'Materials used' },
    { id: '7', name: 'Materials Transferred' },
    { id: '8', name: 'Delivery Order' },
    { id: '9', name: 'Subcon Work Order' },
    { id: '10', name: 'Claim' },
    { id: '11', name: 'Finance' },
    { id: '12', name: 'Attachment' },
  ];
  const toggle = (tab) => {
    setActiveTab(tab);
  };
  // End for tab refresh navigation #Renuka 31-05-23

  // Get Project By Id
  const getProjectById = () => {
    api
      .post('/project/getProjectById', { project_id: id })
      .then((res) => {
        setProjectDetail(res.data.data[0]);
      })
      .catch(() => {});
  };

  const getContact = () => {
    api
      .post('/project/getContactLinkedByProjectId', { project_id: id })
      .then((res) => {
        setContact(res.data.data);
      })
      .catch(() => {});
  };
  const getIncharge = () => {
    api
      .get('/tender/projectIncharge')
      .then((res) => {
        setIncharge(res.data.data);
      })
      .catch(() => {});
  };
  const SubConWorkOrder = () => {
    api.post('/projecttabsubconworkorder/SubConWorkOrderPortal', { project_id: id }).then((res) => {
      setSubConWorkOrdeData(res.data.data);
    });
  };
  useEffect(() => {
    SubConWorkOrder();
  }, [id]);

  const UpdateData = () => {
    api.post('/project/edit-Project', projectDetail).then(() => {
      message('Record editted successfully', 'success');
      setTimeout(() => {
        window.location.reload();
      }, 300);
    });
  };
  const getQuotations = () => {
    api.post('/project/getTabQuoteById', { project_id: id }).then((res) => {
      setQuotation(res.data.data);
    });
  };

  const getCostingSummaryById = () => {
    api.post('/project/getProjectCostingSummaryById', { project_id: id }).then((res) => {
      setCostingSummary(res.data.data[0]);
    });
  };
  // Get Line Item
  const getLineItem = (quotationId) => {
    api.post('/project/getQuoteLineItemsById', { quote_id: quotationId }).then((res) => {
      setLineItem(res.data.data);
      console.log('lineItem', res.data.data);

      //setViewLineModal(true);
    });
  };

  const getJobOrder = () => {
    api.post('/project/getTabQuoteById', { project_id: id }).then((res) => {
      setJobOrder(res.data.data);
    });
  };
  // Get Job Line Item
  const getJobLineItem = (quotationId) => {
    api.post('/project/getQuoteLineItemsById', { quote_id: quotationId }).then((res) => {
      setJobLineItem(res.data.data);
      console.log('JoblineItem', res.data.data);

      //setViewLineModal(true);
    });
  };

  // Tab PurchaseOrder LineItem Table
  const TabPurchaseOrderLineItemTable = () => {
    api.post('/purchaseorder/testAPIendpoint', { project_id: id }).then((res) => {
      let arrayOfObj = Object.entries(res.data.data).map((e) => ({ id: e[0], data: e[1] }));
      arrayOfObj = arrayOfObj.reverse();
      setTabPurchaseOrderLineItemTable(arrayOfObj);
    });
  };

  // Tab Delivery Order
  const TabDeliveryOrder = () => {
    api
      .post('/projecttabdeliveryorder/TabDeliveryOrder', { project_id: id })
      .then((res) => {
        setTabdeliveryorder(res.data.data);
      })
      .catch(() => {});
  };

  // handleCheck
  const handleCheck = (e, item) => {
    let updatedList = [...checkId];
    if (e.target.checked) {
      updatedList = [...checkId, { item }];
    } else {
      const indexOfObject = updatedList.findIndex((object) => {
        return object.id === item.po_product_id;
      });

      updatedList.splice(indexOfObject, 1);
    }
    setCheckId(updatedList);
    setSelectedPoProducts(selectedPoProducts);
  };

  //Add to stocks
  const addQtytoStocks = () => {
    const isEmpty = Object.keys(checkId).length === 0;

    if (isEmpty) {
      Swal.fire('Please select atleast one product!');
    } else {
      const selectedProducts = checkId;
      setCheckId([]);
      selectedProducts.forEach((elem) => {
        console.log('elem', elem);
        if (elem.item.status !== 'Closed') {
          elem.item.status = 'Closed';
          elem.item.qty_updated = elem.item.qty_delivered;
          elem.item.qty_in_stock += parseFloat(elem.item.qty_delivered);

          api
            .post('/purchaseorder/editTabPurchaseOrderLineItem', elem.item)
            .then(() => {
              api
                .post('/product/edit-ProductQty', elem.item)
                .then(() => {
                  message('Quantity updated in product successfully.', 'success');
                  api
                    .post('/inventory/editInventoryStock', elem.item)
                    .then(() => {
                      message('Quantity updated in inventory successfully.', 'success');
                    })
                    .catch(() => {
                      message('unable to update quantity in inventory.', 'danger');
                    });
                })
                .catch(() => {
                  message('unable to update quantity in inventory.', 'danger');
                });
            })
            .catch(() => {
              message('unable to add quantity.', 'danger');
            });
        } else {
          message('This product is already added', 'danger');
        }
      });
    }
  };

  const insertDeliveryHistoryOrder = (proId, deliveryOrderId) => {
    api
      .post('/projecttabdeliveryorder/insertDeliveryHistoryOrder', {
        product_id: proId.product_id,
        purchase_order_id: proId.purchase_order_id,
        delivery_order_id: deliveryOrderId,
        status: '1',
        quantity: proId.qty,
        item_title: proId.item_title,
        creation_date: moment(),
        modification_date: moment(),
        remarks: proId.description,
      })
      .then(() => {
        message('Delivery Order Item Inserted', 'success');
      })
      .catch(() => {
        message('Unable to add Delivery Order Item', 'error');
      });
  };

  const insertDelivery = () => {
    const isEmpty = Object.keys(checkId).length === 0;

    if (isEmpty) {
      Swal.fire('Please select atleast one product!');
    } else {
      api
        .post('/projecttabdeliveryorder/insertdelivery_order', {
          project_id: id,
          company_id: projectDetail.company_id,
          purchase_order_id: '',
          date: new Date(),
          created_by: '1',
          creation_date: new Date(),
          modified_by: '1',
          modification_date: new Date(),
        })
        .then((res) => {
          const selectedProducts = checkId;
          setCheckId([]);
          selectedProducts.forEach((element) => {
            insertDeliveryHistoryOrder(element.item, res.data.data.insertId);
          });
        })
        .catch(() => {
          message('Unable to add delivery order.', 'error');
        });
    }
  };

  // deleteDeliveryOrder
  const deleteDeliveryOrder = (deliveryOrderId) => {
    Swal.fire({
      title: `Are you sure?`,
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        api
          .post('/projecttabdeliveryorder/deletedelivery_order', {
            delivery_order_id: deliveryOrderId,
          })
          .then(() => {
            Swal.fire('Deleted!', 'Delivery Order has been deleted.', 'success');
            window.location.reload();
          })
          .catch(() => {
            message('Unable to Delete Delivery Order', 'info');
          });
      }
    });
  };

  //Attachments
  const dataForAttachment = () => {
    setDataForAttachment({
      modelType: 'attachment',
    });
  };

  // Work Insert
  const insertWorkOrder = async (code) => {
    const newWorkOrderId = workOrderForm;
    newWorkOrderId.project_id = id;
    newWorkOrderId.sub_con_worker_code = code;
    api
      .post('/projecttabsubconworkorder/insertsub_con_work_order', newWorkOrderId)
      .then(() => {
        message('WorkOrder inserted successfully.', 'success');
        window.location.reload();
      })
      .catch(() => {
        message('Network connection error.', 'error');
      });
  };

  //QUTO GENERATED CODE

  //generateCode
  const generateCode = () => {
    api
      .post('/tender/getCodeValue', { type: 'subConworkOrder' })
      .then((res) => {
        insertWorkOrder(res.data.data);
      })
      .catch(() => {
        insertWorkOrder('');
      });
  };
  useEffect(() => {
    getProjectById();
    getCostingSummaryById();
    getQuotations();
    getLineItem();
    getJobLineItem();
    getJobOrder();
    TabDeliveryOrder();
    TabPurchaseOrderLineItemTable();
    getContact();
    getIncharge();
  }, [id]);

  useEffect(() => {
    setTimeout(() => {
      TabPurchaseOrderLineItemTable();
    }, 2000);
  }, [addPurchaseOrderModal]);

  const getTotalOfPurchase = (pItems) => {
    let total = 0;
    pItems.forEach((a) => {
      total += parseInt(a.amount, 10);
    });
    return total;
  };

  return (
    <>
      <BreadCrumbs />
      {/* <ProjectButton
        UpdateData={UpdateData}
        navigate={navigate}
        applyChanges={applyChanges}
        backToList={backToList}
      ></ProjectButton> */}
 <ApiButton
              editData={UpdateData}
              navigate={navigate}
              applyChanges={UpdateData}
              backToList={backToList}
              module="Project"
            ></ApiButton>
      <ProjectEditForm
        projectDetail={projectDetail}
        setProjectDetail={setProjectDetail}
        contact={contact}
        incharge={incharge}
      />

      <ComponentCard title="More Details">
        <ToastContainer></ToastContainer>

        {/* Call Modal's */}

        <DuctingCostModal
          addDuctingCostModal={addDuctingCostModal}
          setAddDuctingCostModal={setAddDuctingCostModal}
        />
        <AddPurchaseOrderModal
          projectId={id}
          addPurchaseOrderModal={addPurchaseOrderModal}
          setAddPurchaseOrderModal={setAddPurchaseOrderModal}
        />

        <EditDeliveryOrder
          editDeliveryOrder={editDeliveryOrder}
          setEditDeliveryOrder={setEditDeliveryOrder}
          data={deliveryData}
        />
        {editPo && <EditPoModal editPo={editPo} setEditPo={setEditPo} data={POId} />}
        {editPOLineItemsModal && (
          <EditPOLineItemsModal
            editPOLineItemsModal={editPOLineItemsModal}
            setEditPOLineItemsModal={setEditPOLineItemsModal}
            data={POId}
            projectId={id}
          />
        )}
        <CreateFinance financeModal={financeModal} setFinanceModal={setFinanceModal} />
        <Tab toggle={toggle} tabs={tabs} />
        {/* Tab 1 */}
        <TabContent className="p-4" activeTab={activeTab}>
          <TabPane tabId="1" eventkey="costingSummary">
            <CostingSummary costingsummary={costingsummary}></CostingSummary>
          </TabPane>
          {/* Tab 2 */}
          <TabPane tabId="2" eventkey="quotationMoreDetails">
            <QuotationMoreDetails
              id={id}
              addLineItemModal={addLineItemModal}
              setAddLineItemModal={setAddLineItemModal}
              viewLineModal={viewLineModal}
              viewLineToggle={viewLineToggle}
              lineItem={lineItem}
              getLineItem={getLineItem}
              quotationsModal={quotationsModal}
              setquotationsModal={setquotationsModal}
              quotation={quotation}
              setViewLineModal={setViewLineModal}
            ></QuotationMoreDetails>
          </TabPane>
          {/* Tab 3 */}
          <TabPane tabId="3" eventkey="PO">
            <Col xs="12" md="3" className="mb-3">
              <Button
                className="shadow-none"
                color="primary"
                onClick={() => {
                  setRoomName('Tender');
                  setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                  dataForAttachment();
                  setAttachmentModal(true);
                }}
              >
                <Icon.File className="rounded-circle" width="20" />
              </Button>
            </Col>
            <AttachmentModalV2
              moduleId={id}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              roomName={RoomName}
              fileTypes={fileTypes}
              altTagData="TenderRelated Data"
              desc="TenderRelated Data"
              recordType="RelatedPicture"
              mediaType={attachmentData.modelType}
              update={update}
              setUpdate={setUpdate}
            />
            <ViewFileComponentV2
              moduleId={id}
              roomName="Tender"
              recordType="RelatedPicture"
              update={update}
              setUpdate={setUpdate}
            />
          </TabPane>

          {/* Tab 4 */}
          <TabPane tabId="4" eventkey="JobMoreDetails">
            <JobMoreDetails
              id={id}
              addJobLineItemModal={addJobLineItemModal}
              setAddJobLineItemModal={setAddJobLineItemModal}
              viewjobLineModal={viewjobLineModal}
              viewLineToggle1={viewLineToggle1}
              joblineItem={joblineItem}
              getJobLineItem={getJobLineItem}
              JobModal={JobModal}
              setJobModal={setJobModal}
              jobOrder={jobOrder}
              setViewJobLineModal={setViewJobLineModal}
            ></JobMoreDetails>
          </TabPane>

          {/* </TabPane> */}
          {/* Tab 5 Materials Purchased */}
          <TabPane tabId="5" eventkey="materialPurchased">
            <MaterialPurchased
              addPurchaseOrderModal={addPurchaseOrderModal}
              setAddPurchaseOrderModal={setAddPurchaseOrderModal}
              insertDelivery={insertDelivery}
              addQtytoStocks={addQtytoStocks}
              tabPurchaseOrderLineItemTable={tabPurchaseOrderLineItemTable}
              setTabPurchaseOrderLineItemTable={setTabPurchaseOrderLineItemTable}
              testJsonData={testJsonData}
              setEditPo={setEditPo}
              setPOId={setPOId}
              setEditPOLineItemsModal={setEditPOLineItemsModal}
              getTotalOfPurchase={getTotalOfPurchase}
              handleCheck={handleCheck}
              setTransferModal={setTransferModal}
              setTransferItem={setTransferItem}
              projectId={id}
              // getCheckedPoProducts={getCheckedPoProducts}
              setViewLineModal={setViewLineModal}
            />
            {transferModal && (
              <TransferModal
                transferModal={transferModal}
                setTransferModal={setTransferModal}
                transferItem={transferItem}
              />
            )}
          </TabPane>

          {/* Tab 6 */}
          <TabPane tabId="6" eventkey="materialsusedTab">
            <MaterialsusedTab projectId={id} />
          </TabPane>

          {/* Tab 7 */}
          <TabPane tabId="7" eventkey="materialsTransferred">
            <MaterialsTransferred projectId={id} />
          </TabPane>

          {/* Start Tab Content 8  Delivery Order */}
          <TabPane tabId="8">
            <DeliveryOrder
              deleteDeliveryOrder={deleteDeliveryOrder}
              tabdeliveryorder={tabdeliveryorder}
              setTabdeliveryorder={setTabdeliveryorder}
              setDeliveryData={setDeliveryData}
              setEditDeliveryOrder={setEditDeliveryOrder}
              deliveryData={deliveryData}
              editDeliveryOrder={editDeliveryOrder}
            />
          </TabPane>

          {/* Start Tab Content 9  Subcon Work Order */}
          <TabPane tabId="9" eventkey="subConWorkOrderPortal">
            <Row className="mb-4">
              <Col md="2">
                <Button
                  color="primary"
                  className="shadow-none"
                  onClick={(e) => {
                    handleClientForms(e);
                    generateCode(e);
                  }}
                >
                  Add Work Order
                </Button>
              </Col>
            </Row>

            <Row>
              <CardTitle tag="h4" className="border-bottom bg-dark p-2 mb-0 text-white">
                {' '}
                Work Orders{' '}
              </CardTitle>
            </Row>

            <SubConWorkOrderPortal projectId={id} subConWorkOrdeData={subConWorkOrdeData} />
            {/* <SubconWorkPaymentHistory projectId={id} /> */}
          </TabPane>

          {/* Start Tab Content 10 */}
          <TabPane tabId="10" eventkey="claim">
            <Claim
              projectDetail={projectDetail}
              projectId={id}
              checkId={checkId}
              deliveryData={deliveryData}
              editPo={editPo}
              POId={POId}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              RoomName={RoomName}
              setRoomName={setRoomName}
              fileTypes={fileTypes}
              setFileTypes={setFileTypes}
              attachmentData={attachmentData}
              dataForAttachment={dataForAttachment}
            />
          </TabPane>

          {/* Start Tab Content 11 */}
          <TabPane tabId="11" eventkey="financeTab">
            <FinanceTab projectId={id} projectDetail={projectDetail}></FinanceTab>
          </TabPane>

          {/* Start Tab Content 12 */}
          <TabPane tabId="12" eventkey="addEmployee">
            <Row>
              <AddEmployee />
              <Col xs="12" md="3" className="mb-3">
                <Button
                  className="shadow-none"
                  color="primary"
                  onClick={() => {
                    setRoomName('Tender');
                    setFileTypes(['JPG', 'JPEG', 'PNG', 'GIF', 'PDF']);
                    dataForAttachment();
                    setAttachmentModal(true);
                  }}
                >
                  <Icon.File className="rounded-circle" width="20" />
                </Button>
              </Col>
            </Row>
            <AttachmentModalV2
              moduleId={id}
              attachmentModal={attachmentModal}
              setAttachmentModal={setAttachmentModal}
              roomName={RoomName}
              fileTypes={fileTypes}
              altTagData="TenderRelated Data"
              desc="TenderRelated Data"
              recordType="RelatedPicture"
              mediaType={attachmentData.modelType}
              update={update}
              setUpdate={setUpdate}
            />
            <ViewFileComponentV2
              moduleId={id}
              roomName="Tender"
              recordType="RelatedPicture"
              update={update}
              setUpdate={setUpdate}
            />
          </TabPane>

          {/* End Tab Content 12 */}
        </TabContent>
      </ComponentCard>
    </>
  );
};

export default ProjectEdit;
