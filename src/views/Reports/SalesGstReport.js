import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Table, FormGroup, Label, Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import { ToastContainer } from 'react-toastify';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ExportReport from '../../components/Report/ExportReport';

const SalesGstReport = () => {
  const [salesReport, setSalesReport] = useState([]);
  const [filteredReport, setFilteredReport] = useState([]);
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const exportValue = "SalesGstReport";

  // Fetch Sales Report Data
  const getSalesReport = () => {
    api.get('/invoice/getSalesInvoice')
      .then((res) => {
        const newData = res.data.data;
        setSalesReport(newData);
        setFilteredReport(newData); // Initially, show all data
      })
      .catch((error) => {
        console.error("API Error:", error);
        message('Sales Data Not Found', 'info');
      });
  };

  // Apply Year & Month Filter
  const filterSalesReport = () => {
    if (!selectedYear && !selectedMonth) {
      setFilteredReport(salesReport);
      return;
    }

    const filtered = salesReport.filter((item) => {
      const invoiceDate = moment(item.invoice_date);
      const year = parseInt(selectedYear, 10);
      const month = parseInt(selectedMonth, 10);

      return (
        (!selectedYear || invoiceDate.year() === year) &&
        (!selectedMonth || invoiceDate.month() + 1 === month) // Months are zero-indexed in Moment.js
      );
    });

    setFilteredReport(filtered);
    setPage(0);
  };

  useEffect(() => {
    getSalesReport();
  }, []);

  // Table Column Structure
  const columns = [
    { name: 'SN', selector: 's_no' },
    { name: 'Invoice No', selector: 'invoice_code' },
    { name: 'Invoice Date', selector: 'invoice_date' },
    { name: 'Customer Name', selector: 'cust_company_name' },
    { name: 'Gst No', selector: 'cust_gst_no' },
    { name: 'Amount', selector: 'amount' },
    { name: 'Sgst %', selector: 'sgst_per' },
    { name: 'Cgst %', selector: 'cgst_per' },
    { name: 'Sgst', selector: 'sgst' },
    { name: 'Cgst', selector: 'cgst' },
    { name: 'Total Gst', selector: 'gst_value' },
    { name: 'Invoice Amount', selector: 'invoice_amount' },
  ];

  useEffect(() => {
    setTimeout(() => {
      $('#example').DataTable({
        pagingType: 'full_numbers',
        pageLength: 20,
        processing: true,
        dom: 'Bfrtip',
        buttons: [
          { extend: 'csv', text: 'CSV', className: 'shadow-none btn btn-primary' },
          { extend: 'print', text: 'Print', className: 'shadow-none btn btn-primary' },
        ],
      });
    }, 1000);
  }, []);

  const totalInvoiceAmount = filteredReport.reduce((sum, item) => sum + Number(item.invoice_amount || 0), 0);
const totalGstAmount = filteredReport.reduce((sum, item) => sum + Number(item.gst_value || 0), 0);



  const pageCount = Math.ceil(filteredReport.length / itemsPerPage);
  const changePage = ({ selected }) => setPage(selected);

  return (
    <>
      <BreadCrumbs />
      <ToastContainer />
      <Card>
        <CardBody>
          <Row>
          <Col md="3">
  <FormGroup>
    <Label htmlFor="yearSelect">Year:</Label>
    <Input
      id="yearSelect"
      type="select"
      value={selectedYear}
      onChange={(e) => setSelectedYear(e.target.value)}
    >
      <option value="">Select Year</option>
      {Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return <option key={year} value={year}>{year}</option>;
      })}
    </Input>
  </FormGroup>
</Col>

<Col md="3">
  <FormGroup>
    <Label htmlFor="monthSelect">Month:</Label>
    <Input
      id="monthSelect"
      type="select"
      value={selectedMonth}
      onChange={(e) => setSelectedMonth(e.target.value)}
    >
      <option value="">Select Month</option>
      {[
        { name: 'January', value: 1 },
        { name: 'February', value: 2 },
        { name: 'March', value: 3 },
        { name: 'April', value: 4 },
        { name: 'May', value: 5 },
        { name: 'June', value: 6 },
        { name: 'July', value: 7 },
        { name: 'August', value: 8 },
        { name: 'September', value: 9 },
        { name: 'October', value: 10 },
        { name: 'November', value: 11 },
        { name: 'December', value: 12 }
      ].map((month) => (
        <option key={month.value} value={month.value}>
          {month.name}
        </option>
      ))}
    </Input>
  </FormGroup>
</Col>


            <Col md="3">
              <Button type="button" color="primary" onClick={filterSalesReport} style={{ marginTop: '16px' }}>
                Apply Filter
              </Button>
            </Col>
            <Col>
              <ExportReport columns={columns} data={filteredReport} exportValue={exportValue} />
            </Col>
          </Row>
        </CardBody>

        <CardBody>
          <Table id="example">
            <thead>
              <tr>
                {columns.map((cell) => (
                  <th key={cell.name}>{cell.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredReport.length > 0 ? (
                filteredReport.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((element, index) => (
                  <tr key={element.invoice_id}>
                    <td>{index + 1}</td>
                    <td>{element.invoice_code}</td>
                    <td>{moment(element.invoice_date).format('DD-MM-YYYY')}</td>
                    <td>{element.cust_company_name}</td>
                    <td>{element.cust_gst_no}</td>
                    <td>{element.amount}</td>
                    <td>{element.sgst_per}</td>
                    <td>{element.cgst_per}</td>
                    <td>{element.sgst}</td>
                    <td>{element.cgst}</td>
                    <td>{element.gst_value}</td>
                    <td>{element.invoice_amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} style={{ textAlign: 'center' }}>
                    No data found
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr>
              <td colSpan="10" style={{ textAlign: "right", fontWeight: "bold" }}>Total:</td>
               <td style={{ fontWeight: "bold" }}>{totalGstAmount.toFixed(2)}</td>
              <td style={{ fontWeight: "bold" }}>{totalInvoiceAmount.toFixed(2)}</td>
            </tr>
           </tfoot>
          </Table>
        </CardBody>
        <CardBody>
         <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName="navigationButtons"
            previousLinkClassName="previousButton"
            nextLinkClassName="nextButton"
            disabledClassName="navigationDisabled"
            activeClassName="navigationActive"
          />
          </CardBody>
      </Card>
    </>
  );
};

export default SalesGstReport;
