import React, { useState } from 'react';
import {
  CardBody,
  CardTitle,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import api from '../../constants/api';

const EditCostingSummaryModal = ({
  editCostingSummaryModel,
  setEditCostingSummaryModel,
  costingsummary,
}) => {
  EditCostingSummaryModal.propTypes = {
    editCostingSummaryModel: PropTypes.bool,
    setEditCostingSummaryModel: PropTypes.func,
    costingsummary: PropTypes.object,
  };

  const [editCostingSummaryData, seteditCostingSummaryData] = useState(null);
  const { id } = useParams();
  const [totalLabour, setTotalLabour] = useState();
  //edit Tab Costing Summary Form
  const handleCostingSummeryInputs = (e) => {
    seteditCostingSummaryData({ ...editCostingSummaryData, [e.target.name]: e.target.value });
  };

  const handleCalc = (noofworkerused, noofdaysworked, labourratesperday, totallabourcharges) => {
    if (!noofworkerused) noofworkerused = 0;
    if (!noofdaysworked) noofdaysworked = 0;
    if (!labourratesperday) labourratesperday = 0;
    if (!totallabourcharges) totallabourcharges = 0;

    setTotalLabour(
      parseFloat(noofworkerused) * parseFloat(noofdaysworked) * parseFloat(labourratesperday),
    );
  };
  const EditCostingSummary = () => {
    editCostingSummaryData.opportunity_id = id;
    editCostingSummaryData.total_labour_charges = totalLabour;
    api.post('/tender/edit-TabCostingSummaryForm', editCostingSummaryData).then(() => {
      setEditCostingSummaryModel(false);
      window.location.reload();
    });
  };

  React.useEffect(() => {
    seteditCostingSummaryData(costingsummary);
  }, [costingsummary]);

  return (
    <>
      <Modal size="lg" isOpen={editCostingSummaryModel}>
        <ModalHeader>
          Edit Costing Summary
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditCostingSummaryModel(false);
            }}
          >
            X
          </Button>
        </ModalHeader>

        <ModalBody>
          <Row>
            <Col md="12">
              <CardBody>
                <Form>
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>No. of Worker Used</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              e.target.value,
                              costingsummary.no_of_days_worked,
                              costingsummary.labour_rates_per_day,
                              costingsummary.total_labour_charges,
                            );
                          }}
                          defaultValue={costingsummary && costingsummary.no_of_worker_used}
                          name="no_of_worker_used"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>No. of Days Worked</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              costingsummary.no_of_worker_used,
                              e.target.value,
                              costingsummary.labour_rates_per_day,
                              costingsummary.total_labour_charges,
                            );
                          }}
                          defaultValue={costingsummary && costingsummary.no_of_days_worked}
                          name="no_of_days_worked"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Labout Rates Per Day</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                            handleCalc(
                              costingsummary.no_of_worker_used,
                              costingsummary.no_of_days_worked,
                              e.target.value,
                              costingsummary.total_labour_charges,
                            );
                          }}
                          defaultValue={costingsummary && costingsummary.labour_rates_per_day}
                          name="labour_rates_per_day"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Total Price (S$ W/o VAT)</Label>
                        <Input
                          type="number"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                          }}
                          defaultValue={costingsummary && costingsummary.po_price}
                          name="po_price"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Profit Margin %</Label>
                        <Input
                          type="number"
                          disabled
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                          }}
                          defaultValue={costingsummary && costingsummary.profit_percentage}
                          name="profit_percentage"
                        />
                      </FormGroup>
                    </Col>

                    <Col md="4">
                      <FormGroup>
                        <Label>Profit Margin</Label>
                        <Input
                          type="number"
                          disabled
                          name="profit"
                          onChange={(e) => {
                            handleCostingSummeryInputs(e);
                          }}
                          defaultValue={costingsummary && costingsummary.profit}
                          tabindex="-1"
                        />
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </CardBody>

              <CardBody className="bg-light">
                <CardTitle tag="h4" className="mb-0"></CardTitle>
              </CardBody>

              <CardBody>
                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Total Material</Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                        }}
                        defaultValue={costingsummary && costingsummary.total_material_price}
                        name="total_material_price"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Transport Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                        }}
                        defaultValue={costingsummary && costingsummary.transport_charges}
                        name="transport_charges"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Total Labour Charges</Label>
                      <Input
                        type="number"
                        disabled
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                          handleCalc(
                            costingsummary.no_of_worker_used,
                            costingsummary.no_of_days_worked,
                            costingsummary.labour_rates_per_day,
                            e.target.value,
                          );
                        }}
                        value={totalLabour || costingsummary.total_labour_charges}
                        name="total_labour_charges"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Salesman Commission </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                        }}
                        defaultValue={costingsummary && costingsummary.salesman_commission}
                        name="salesman_commission"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Finance Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                        }}
                        defaultValue={costingsummary && costingsummary.finance_charges}
                        name="finance_charges"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>Office Overheads </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                        }}
                        defaultValue={costingsummary && costingsummary.office_overheads}
                        name="office_overheads"
                      />
                    </FormGroup>
                  </Col>
                </Row>

                <Row>
                  <Col md="4">
                    <FormGroup>
                      <Label>Other Charges </Label>
                      <Input
                        type="number"
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                        }}
                        defaultValue={costingsummary && costingsummary.other_charges}
                        name="other_charges"
                      />
                    </FormGroup>
                  </Col>

                  <Col md="4">
                    <FormGroup>
                      <Label>TOTAL COST</Label>
                      <Input
                        type="number"
                        name="total_cost"
                        disabled
                        onChange={(e) => {
                          handleCostingSummeryInputs(e);
                        }}
                        value={costingsummary && costingsummary.total_cost}
                      />
                    </FormGroup>
                  </Col>
                </Row>
              </CardBody>
              <CardBody>
                <CardTitle className="mb-0 bg-light"></CardTitle>
              </CardBody>
            </Col>
          </Row>
        </ModalBody>
        <ModalFooter>
          <Button
            color="primary"
            className="shadow-none"
            onClick={() => {
              EditCostingSummary();
            }}
          >
            {' '}
            Submit{' '}
          </Button>
          <Button
            color="secondary"
            className="shadow-none"
            onClick={() => {
              setEditCostingSummaryModel(false);
            }}
          >
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default EditCostingSummaryModal;
