import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Table, FormGroup, Label, Input, Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import ReactPaginate from 'react-paginate';
import api from '../../constants/api';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ExportReport from '../../components/Report/ExportReport';

const CheckInOutReport = () => {
  const [reportData, setReportData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;
  const exportValue = "CheckInOutReport";


  const fetchReportData = () => {
    api.get('/booking/getBookingService')
      .then((res) => {
        setReportData(res.data.data);
        setFilteredData(res.data.data);
      })
      .catch((error) => {
        console.error("API Error:", error);
        message('Data Not Found', 'info');
      });
  };
  useEffect(() => {
    fetchReportData();
  }, []);


  const filterReportData = () => {
    const today = moment().format('YYYY-MM-DD');
    const filtered = reportData.filter((element) => {
      const bookingDate = element.check_in_date ? moment(element.check_in_date).format('YYYY-MM-DD') : null;
      return (
        (!checkInDate || (bookingDate && bookingDate >= checkInDate)) &&
        (!checkOutDate || (bookingDate && bookingDate <= checkOutDate)) &&
        (!status || element.checkStatus === status)
      );
    }).sort((a, b) => {
      const bookingDateA = moment(a.check_in_date).format('YYYY-MM-DD');
      const bookingDateB = moment(b.check_in_date).format('YYYY-MM-DD');
      
      if (bookingDateA === today) return -1;
      if (bookingDateB === today) return 1;
      return moment(bookingDateB).diff(moment(bookingDateA));
    });

    setFilteredData(filtered);
    setPage(0);
  };

  const columns = [
    { name: 'SN' },
    { name: 'Customer Name' },
    { name: 'Room Type' },
    { name: 'Room Number' },
    { name: 'Check-in Date' },
    { name: 'Check-in Time' },
    { name: 'Check-out Date' },
    { name: 'Check-Out Time' },
    { name: 'Mobile' },
    { name: 'Status' },
  ];

  const pageCount = Math.ceil(filteredData.length / itemsPerPage);
  const changePage = ({ selected }) => setPage(selected);

  return (
    <>
      <BreadCrumbs />
      <Card>
        <CardBody>
          <Row>
            <Col md="3">
              <FormGroup>
                <Label>Check-in Date:</Label>
                <Input type="date" value={checkInDate} onChange={(e) => setCheckInDate(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Check-out Date:</Label>
                <Input type="date" value={checkOutDate} onChange={(e) => setCheckOutDate(e.target.value)} />
              </FormGroup>
            </Col>
            <Col md="3">
              <FormGroup>
                <Label>Status:</Label>
                <Input type="select" value={status} onChange={(e) => setStatus(e.target.value)}>
                  <option value="">Select Status</option>
                  <option value="Confirmed">Check In</option>
                  <option value="Pending">Check out</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="3">
              <Button color="primary" onClick={filterReportData} style={{ marginTop: '30px' }}>Apply Filter</Button>
            </Col>
            <Col>
              <ExportReport columns={columns} data={filteredData} exportValue={exportValue} />
            </Col>
          </Row>
        </CardBody>

        <CardBody>
          <Table>
            <thead>
              <tr>
                {columns.map((col) => <th key={col.name}>{col.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {filteredData.slice(page * itemsPerPage, (page + 1) * itemsPerPage).map((item, index) => (
                <tr key={item.invoice_id}>
                  <td>{index + 1}</td>
                  <td>{item.first_name}</td>
                  <td>{item.room_type}</td>
                  <td>{item.room_number}</td>
                  <td>{item.check_in_date ? moment(item.check_in_date).format('DD-MM-YYYY') : ''}</td>
                  <td>{item.check_in_time}</td>
                  <td>{item.check_out_date ? moment(item.check_out_date).format('DD-MM-YYYY') : ''}</td>
                  <td>{item.check_out_time}</td>
                  <td>{item.mobile}</td>
                  <td>{item.checkStatus}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>

        <CardBody>
          <ReactPaginate
            previousLabel="Previous"
            nextLabel="Next"
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName="pagination"
            activeClassName="active"
          />
        </CardBody>
      </Card>
    </>
  );
};

export default CheckInOutReport;