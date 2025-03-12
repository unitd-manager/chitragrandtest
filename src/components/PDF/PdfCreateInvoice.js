import React from 'react';
import PropTypes from 'prop-types';
import pdfMake from 'pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Button } from 'reactstrap';
import moment from 'moment';
//import Converter from 'number-to-words';
import api from '../../constants/api';
import message from '../Message';
// import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';
//import PdfHeader2 from './PdfHeader2';

const PdfCreateInvoice = ({ invoiceId, projectDetail }) => {
  PdfCreateInvoice.propTypes = {
    invoiceId: PropTypes.any,
    projectDetail: PropTypes.any,
  };
  const [hfdata, setHeaderFooterData] = React.useState();
  // const [hfdata1, setHeaderFooterData1] = React.useState();
  const [cancelInvoice, setCancelInvoice] = React.useState([]);
  const [createInvoice, setCreateInvoice] = React.useState();
  const [gTotal, setGtotal] = React.useState(0);

  //const [gstTotal, setGstTotal] = React.useState(0);
  //const [Total, setTotal] = React.useState(0);

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
  }, []);
  // React.useEffect(() => {
  //   api.get('/setting/getSettingsForCompany1').then((res) => {
  //     setHeaderFooterData1(res.data.data);
  //   });
  // }, []);

  console.log('companyInvoice', projectDetail);
  const findCompany = (key) => {
    console.log('key', key);
  
      if (hfdata && hfdata.length > 0) {
        const filteredResult = hfdata.find((e) => e.key_text === key);
        return filteredResult ? filteredResult.value : '';
      }
 
    return '';
  };

  // Gettind data from Job By Id
  const getInvoiceById = () => {
    api
      .post('/invoice/getInvoiceByInvoiceId', { invoice_id: invoiceId })
      .then((res) => {
        setCreateInvoice(res.data.data);
      })
      .catch(() => {
        message('Invoice Data Not Found', 'info');
      });
  };
  const calculateTotal = () => {
    const grandTotal = cancelInvoice.reduce((acc, element) => acc + element.amount, 0);
    const gstValue = createInvoice.gst_value || 0;
    const total = grandTotal + gstValue;
    return total;
  };
  //console.log('2', gstTotal);
  const getInvoiceItemById = () => {
    api
      .post('/invoice/getInvoiceItemByInvoiceId', { invoice_id: invoiceId })
      .then((res) => {
        setCancelInvoice(res.data.data);
        let grandTotal = 0;
        res.data.data.forEach((elem) => {
          grandTotal += elem.amount;
        });

        setGtotal(grandTotal);
         })
      .catch(() => {
        message('Invoice Data Not Found', 'info');
      });
  };
  React.useEffect(() => {
    getInvoiceItemById();
    getInvoiceById();
  }, []);

  const GetPdf = () => {
    const productItems = [
      [
        {
          text: 'Sn',
          style: 'tableHead',
        },
        {
          text: 'Room Type',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: 'No Of Days',
          style: 'tableHead',
          alignment: 'center',
        },
        {
          text: 'Price',
          style: 'tableHead',
          alignment: 'right',
        },
        {
          text: 'Total Amount',
          style: 'tableHead',
          alignment: 'right',
        },
      ],
    ];
    cancelInvoice.forEach((element, index) => {
      productItems.push([
        {
          text: `${index + 1}`,
          style: 'tableBody',
          border: [false, false, false, true],
        },
        {
          text: `${element.item_title ? element.item_title : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
        {
          text: `${element.qty ? element.qty : ''}`,
          border: [false, false, false, true],
          style: 'tableBody',
          alignment: 'center',
        },
        {
          text: `${element.unit_price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          style: 'tableBody1',
        },
        {
          text: `${element.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          style: 'tableBody1',
        },
      ]);
    });

    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [40, 150, 40, 80],
      // footer: PdfFooter,
      content: [
        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: ['101%'],
            body: [
              [
                {
                  text: `INVOICE`,
                  alignment: 'center',
                  style: 'tableHead',
                },
              ],
            ],
          },
        },
        '\n',

        {
          columns: [
            {
              stack: [
                {
                  text: `To : ${createInvoice.cust_company_name ? createInvoice.cust_company_name : ''}\n${
                    createInvoice.cust_address1 ? createInvoice.cust_address1 : ''
                  }\n ${createInvoice.cust_address2 ? createInvoice.cust_address2 : ''}\n${
                    createInvoice.cust_address_country ? createInvoice.cust_address_country : ''
                  }\n${
                    createInvoice.cust_address_po_code ? createInvoice.cust_address_po_code : ''
                  }\n
                  \n GST NO:${
                    createInvoice.cust_gst_no ? createInvoice.cust_gst_no : ''
                  } `,
                  style: ['textSize'],
                  margin: [0, 0, 0, 0],
                },
                '\n',
              ],
            },
            {
              stack: [
                {
                  text: ` Invoice No:${
                    createInvoice.invoice_code ? createInvoice.invoice_code : ''
                  } `,
                  style: ['textSize'],
                  margin: [100, 0, 0, 0],
                },
                {
                  text: ` Date :${moment(
                    createInvoice.invoice_date ? createInvoice.invoice_date : '',
                  ).format('DD-MM-YYYY')}  `,
                  style: ['textSize'],
                  margin: [100, 0, 0, 0],
                },
              
                '\n',
              ],
            },
          ],
        },
        '\n',
        '\n',

        {
          layout: {
            defaultBorder: false,
            hLineWidth: () => {
              return 1;
            },
            vLineWidth: () => {
              return 1;
            },
            hLineColor: (i) => {
              if (i === 1 || i === 0) {
                return '#bfdde8';
              }
              return '#eaeaea';
            },
            vLineColor: () => {
              return '#eaeaea';
            },
            hLineStyle: () => {
              return null;
            },
            paddingLeft: () => {
              return 10;
            },
            paddingRight: () => {
              return 10;
            },
            paddingTop: () => {
              return 2;
            },
            paddingBottom: () => {
              return 2;
            },
            fillColor: () => {
              return '#fff';
            },
          },
          table: {
            headerRows: 1,
            widths: [20, 90, '*', 50, 70],

            body: productItems,
          },
        },
        '\n\n',
        {
          columns: [
            {
              text: ``,
              alignment: 'left',
              style: ['invoiceAdd', 'textSize'],
            },
            {
              stack: [
                {
                  text: `SubTotal :${gTotal.toLocaleString('en-IN', {
                    minimumFractionDigits: 2,
                  })}`,
                  style: ['textSize1'],
                  margin: [145, 0, 0, 0],
                },
                '\n',
                // {
                //   text: `Discount : ${createInvoice.discount ? createInvoice.discount : ''}`,
                //   style: ['textSize'],
                //   margin: [145, 0, 0, 0],
                // },
                // '\n',
                {
                  text: `SGST :${(createInvoice.sgst ? createInvoice.sgst : '').toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                  style: ['textSize1'],
                  margin: [145, 0, 0, 0],
                },
                '\n',
                {
                  text: `CGST :${(createInvoice.cgst ? createInvoice.cgst : '').toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                  style: ['textSize1'],
                  margin: [145, 0, 0, 0],
                },
                '\n',
                {
                  text: `Total :${calculateTotal().toLocaleString('en-IN', { minimumFractionDigits: 2 })}`,
                  style: ['textSize1'],
                  margin: [145, 0, 0, 0],
                },
              ],
            },
          ],
        },
        '\n',
        //{ text: `Total $ :${Converter.toWords(Total)}` },
        '\n',
        '\n',
        '\n',
        '\n',
        '\n',
        '\n',
        '\n',
        {
          columns: [
            {
              stack: [
                {
                  text: `Guest Signature`,
                  style: ['textSize'],
                  margin: [20, 0, 0, 0],
                },
              ],
            },
            {
              stack: [
                {
                  text: ` Staff Signature `,
                  style: ['textSize'],
                  margin: [150, 0, 0, 0],
                },
                '\n',
                
              
              
                '\n',
              ],
            },
          ],
        },
        '\n',
        '\n',
        
      ],
      margin: [0, 50, 50, 50],

      styles: {
        logo: {
          margin: [-20, 20, 0, 0],
        },
        address: {
          margin: [-10, 20, 0, 0],
        },
        invoice: {
          margin: [0, 30, 0, 10],
          alignment: 'right',
        },
        invoiceAdd: {
          alignment: 'right',
        },
        textSize: {
          fontSize: 10,
        
        },
        textSize1: {
          fontSize: 10,
          alignment: 'right',
        },
        notesTitle: {
          bold: true,
          margin: [0, 50, 0, 3],
        },
        tableHead: {
          border: [false, true, false, true],
          fillColor: '#eaf2f5',
          margin: [0, 5, 0, 5],
          fontSize: 10,
          bold: 'true',
        },
        tableBody: {
          border: [false, false, false, true],
          margin: [0, 5, 0, 5],
          alignment: 'left',
          fontSize: 10,
        },
        tableBody1: {
          border: [false, false, false, true],
          margin: [10, 5, 0, 5],
          alignment: 'right',
          fontSize: 10,
        },
        tableBody2: {
          border: [false, false, false, true],
          margin: [15, 5, 0, 5],
          alignment: 'center',
          fontSize: 10,
        },
      },
      defaultStyle: {
        columnGap: 20,
      },
    };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
      <Button type="button" className="btn btn-dark mr-2" onClick={GetPdf}>
        Print Invoice
      </Button>
    </>
  );
};

export default PdfCreateInvoice;
