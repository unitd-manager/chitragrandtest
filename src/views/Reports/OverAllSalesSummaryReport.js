import React, { useEffect,useState } from 'react';
import { Row, Col, Card, CardBody, CardHeader, Button, Input, FormGroup, Label, Table } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
import $ from 'jquery';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ExportReport from '../../components/Report/ExportReport';

const OverAllReport = () => {
  //All state variable
  const [salesReport, setSalesReport] = useState(null);
  const [searchData, setSearchData] = useState({
    startDate: null,
    endDate: null,
    companyName:null,
    company_id:''
  });
  const [totalinvoiceAmount, setInvoiceAmount] = useState();
  const [totalgsts, setGst] = useState();
  const [totaltotals, setTotal] = useState();
  const [company, setCompany] = useState();
  const exportValue="EmployeeSalaryReport"
  
  //Handle input function for searchdata
  const handleInputs = (e) => {
  setSearchData({ ...searchData, [e.target.name]: e.target.value });
};
  //Get data from Reports table
  const getProject = () => {
    api
      .post('/reports/getSalesReport', searchData)
      .then((res) => {
        console.log("API Response:", res.data); // Log the entire response
        const newData = res.data.data; // Extract the data array
        setSalesReport(newData); // Set the entire data array
        let invoiceAmount = 0;
        let gst = 0;
        let total = 0;
        newData.forEach((el) => {
          invoiceAmount += el.invoiceAmount;
          gst += el.gst;
          total += el.total;
        });
        setInvoiceAmount(invoiceAmount.toFixed(2));  
        setGst(gst.toFixed(2));  
        setTotal(total.toFixed(2));  
      })
      .catch((error) => {
        console.error("API Error:", error);
        message('Over all sales Data Not Found', 'info');
      });
  };

  const getCompany = () => {
    api.get('/company/getCompany').then((res) => {
      setCompany(res.data.data);
    });
  };

  useEffect(() => {
    // getProject();
    getCompany();
  }, []);
  

  //structure of Training list view
  const columns = [
    {
      name: 'SN',
      selector: 's_no',
    },

    {
      name: 'Invoice Date',
      selector: 'invoice_date',
    },
    {
      name: 'Invoice No',
      selector: 'invoice_code',
    },
    {
      name: 'Company Name',
      selector: 'company_name',
    },
    {
      name: 'Invoice Amount',
      selector: 'invoiceAmount',
    },

    {
      name: 'GST',
      selector: 'gst',
    },
    {
      name: 'Total',
      selector: 'total',
    },
    {
      name: 'Received',
      selector: 'received',
    },
    {
      name: 'Balance',
      selector: 'balance',
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      $('#example').DataTable({
        pagingType: 'full_numbers',
        pageLength: 20,
        processing: true,
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'csv',
            text: 'CSV',
            className: 'shadow-none btn btn-primary',
          },
          {
            extend: 'print',
            text: 'Print',
            className: 'shadow-none btn btn-primary',
          },
        ],
      });
    }, 1000);
  }, []);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Card>
        <CardBody>
          <Row>
            <Col>
              <FormGroup>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  name="startDate"
                  onChange={handleInputs}
                />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>End Date</Label>
                <Input type="date" name="endDate"  onChange={handleInputs} />
              </FormGroup>
            </Col>
            <Col>
              <FormGroup>
                <Label>Select Company Name</Label>
                <Input
                  type="select"
                  name="companyName"
                  onChange={handleInputs}
                >
                  <option value="">Please Select</option>
                  {company &&
                    company.map((ele) => {
                      return (
                        <option key={ele.company_id} value={ele.company_name}>
                          {ele.company_name}
                        </option>
                      );
                    })}
                </Input>
              </FormGroup>
            </Col>
            <Col md="1" className="mt-3">
              <Button color="primary" className="shadow-none" onClick={() => getProject()}>Go</Button>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
      <CardHeader className="card p-2 text-center">
        <b>Overall Sales Summary Report</b>
      </CardHeader>
        <CardBody>
          <Row>
            <Col md="4">
              <Label>
                <b>Company:</b> {searchData.companyName}
              </Label>
            </Col>
            <Col md="4">
              <Label>
                <b>Start Date:</b> {searchData.startDate}
              </Label>
            </Col>
            <Col md="4">
              <Label>
                <b> End Date:</b> {searchData.endDate}
              </Label>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col>
              <ExportReport columns={columns} data={salesReport} exportValue={exportValue} />
            </Col>
          </Row>
        </CardBody>

        <CardBody>
          <Table>
            <thead>
              <tr>
                {columns.map((cell) => {
                  return <td key={cell.name}>{cell.name}</td>;
                })}
              </tr>
            </thead>
            <tbody>
              {salesReport &&
                salesReport.map((element, index) => {
                  return (
                    <tr key={element.invoice_id}>
                      <td>{index + 1}</td>
                      <td>{moment(element.invoice_date).format('YYYY-MM-DD')}</td>
                      <td>{element.invoice_code}</td>
                      <td>{element.company_name}</td>
                      <td>{element.invoiceAmount}</td>
                      <td>{element.gst}</td>
                      <td>{element.total}</td>
                      <td>{element.received}</td>
                      <td>{element.balance}</td>
                    </tr>
                  );
                })}
            </tbody>
            <tr>
              <td><b>Total:</b></td>
              <td></td>
              <td></td>
              <td></td>
               <td><b>{totalinvoiceAmount}</b></td>
               <td><b>{totalgsts}</b></td>
               <td><b>{totaltotals}</b></td>
               <td></td>
               <td></td>
              </tr>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};
export default OverAllReport;
