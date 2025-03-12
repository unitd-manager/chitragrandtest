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

const EmployeeSalary = () => {
  //All state variable
  const [report, setReport] = useState('');
  const [employeestatus, setEmployeeStatus] = useState({statusforemployee: 'Current'});
  const handleInputs = (e) => {
    setEmployeeStatus({ ...employeestatus, [e.target.name]: e.target.value });
  };
  const exportValue="EmployeeSalaryReport"

  //Get data from Reports table
  const getEmployeeSalary = () => {
    api
      .post('/reports/getEmployeeSalaryReport', employeestatus)
      .then((res) => {
        setReport(res.data.data);
      })

      .catch(() => {
        message('Employee Details not found', 'error');
      });
  };
  

  //structure of Training list view
  const columns = [
    {
      name: '#',
      selector: 's_no',
    },

    {
      name: 'Employee Name',
      selector: 'employee_name',
      grow: 0,
      wrap: true,
      width: '4%',
    },

    {
      name: 'NRIC',
      selector: 'nric_no',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Date Of Birth',
      selector: 'date_of_birth',
      sortable: true,
      grow: 10,
      wrap: true,
    },
    {
      name: ' Age ',
      selector: 'age',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Designation',
      selector: 'designation',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Department',
      selector: 'department',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Basic Pay ',
      selector: 'basic_pay',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Total Allowance',
      selector: 'total_allowance',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Total Deduction',
      selector: 'total_deductions',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Net Pay',
      selector: 'net_total',
      sortable: true,
      grow: 0,
      wrap: true,
    },
  ];

  useEffect(() => {
    setTimeout(() => {
      $('#example').DataTable({
        pagingType: 'full_numbers',
        pageLength: 20,
        processing: true,
        dom: 'Bfrtip',
        // buttons: [
        //   {
        //     extend: 'csv',
        //     text: 'CSV',
        //     className: 'shadow-none btn btn-primary',
        //   },
        //   {
        //     extend: 'print',
        //     text: 'Print',
        //     className: 'shadow-none btn btn-primary',
        //   },
        // ],
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
            <Col></Col>
            <Col>
              <FormGroup>
                <Label>Select Status</Label>
                <Input type="select" name="statusforemployee" onChange={handleInputs}>
                  <option value="Current">Current</option>
                  <option value="Archive">Archive</option>
                  <option value="Cancel">Cancel</option>
                </Input>
              </FormGroup>
            </Col>
            <Col md="1" className="mt-3">
              <Button color="primary" className="shadow-none" onClick={() =>{ getEmployeeSalary();}}>
                Go
              </Button>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <Card>
      <CardHeader className="card p-2 text-center">
        <b>Employee Salary Report</b>
      </CardHeader>
        <CardBody>
          <Row>
            <Col md="6">
              <Label>
              <b>Status:</b> &nbsp; <span>{employeestatus.statusforemployee}</span>
              </Label>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <Row>
            <Col>
            <ExportReport columns={columns} data={report} exportValue={exportValue} />

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
              {report &&
                report.map((element, index) => {
                  return (
                    <tr key={element.employee_id}>
                      <td>{index + 1}</td>
                      <td>{element.employee_name}</td>
                      <td>{element.nric_no}</td>
                      <td>
                        {element.date_of_birth
                          ? moment(element.date_of_birth).format('DD-MM-YYYY')
                          : ''}
                      </td>
                      <td>{element.age}</td>
                      <td>{element.designation}</td>
                      <td>{element.department}</td>
                      <td>{element.basic_pay}</td>
                      <td>{element.total_allowance}</td>
                      <td>{element.total_deductions}</td>
                      <td>{element.net_total}</td>
                    </tr>
                  );
                })}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </>
  );
};
export default EmployeeSalary;
