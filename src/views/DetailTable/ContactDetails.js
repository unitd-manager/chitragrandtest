import React, { useState } from 'react';
import { Row, Col, Form, FormGroup, Label, Input, Button } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import message from '../../components/Message';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import ComponentCard from '../../components/ComponentCard';
import api from '../../constants/api';
import creationdatetime from '../../constants/creationdatetime';

const CategoryDetails = () => {
  //Navigation and Parameter Constants
  const navigate = useNavigate();

  //Logic for adding category in db
  const [contactForms, setContactForms] = useState({
    first_name: '',
  });

  //setting data in contactForms
  const handleContactForms = (e) => {
    setContactForms({ ...contactForms, [e.target.name]: e.target.value });
  };

  //Api for insertContact
  const insertContact = () => {
    if (contactForms.first_name !== '') {
      contactForms.creation_date = creationdatetime;
      api
        .post('/contact/insertContact', contactForms)
        .then((res) => {
          const insertedDataId = res.data.data.insertId;
          message('Category inserted successfully.', 'success');
          setTimeout(() => {
            navigate(`/ContactEdit/${insertedDataId}`);
          }, 300);
        })
        .catch(() => {
          message('Network connection error.', 'error');
        });
    } else {
      message('Please fill all required fields', 'warning');
    }
  };

  return (
    <div>
      <BreadCrumbs />
      <ToastContainer></ToastContainer>
      <Row>
        <Col md="6">
          <ComponentCard title="Key Details">
            <Form>
              <FormGroup>
                <Row>
                  <Col md="12">
                    <Label>
                      Customer Name<span className="required"> *</span>
                    </Label>
                    <Input
                      type="text"
                      name="first_name"
                      onChange={handleContactForms}
                      value={contactForms && contactForms.first_name}
                    ></Input>
                  </Col>
                </Row>
              </FormGroup>
              <FormGroup>
                <Row>
                  <div className="pt-3 mt-3 d-flex align-items-center gap-2">
                    <Button
                      color="primary"
                      onClick={() => {
                        insertContact();
                      }}
                      type="button"
                      className="btn mr-2 shadow-none"
                    >
                      Save & Continue
                    </Button>
                    <Button
                      onClick={() => {
                        navigate(-1);
                      }}
                      type="button"
                      className="btn btn-dark shadow-none"
                    >
                      Go to List
                    </Button>
                  </div>
                </Row>
              </FormGroup>
            </Form>
          </ComponentCard>
        </Col>
      </Row>
    </div>
  );
};
export default CategoryDetails;
