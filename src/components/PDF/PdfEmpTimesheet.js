import React from 'react';
import pdfMake from 'pdfmake';
import * as Icon from 'react-feather';
import PropTypes from 'prop-types';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import api from '../../constants/api';
import PdfFooter from './PdfFooter';
import PdfHeader from './PdfHeader';


const PdfEmpTimesheet = ({getSingleEmployeeData}) => {
    PdfEmpTimesheet.propTypes = {
        getSingleEmployeeData:PropTypes.any,
      }

  const [totalEmpTimesheetRecord, setTotalEmpTimesheetRecord] = React.useState();
  const [hfdata, setHeaderFooterData] = React.useState();

  React.useEffect(() => {
    api.get('/setting/getSettingsForCompany').then((res) => {
      setHeaderFooterData(res.data.data);
    });
    api.get('/timesheet/getAllEmpTimesheet').then((res) => {
      setTotalEmpTimesheetRecord(res.data.data);
    });
  
  }, []);

  console.log("getSingleEmployeeData",getSingleEmployeeData)
  console.log("totalEmpTimesheetRecord",totalEmpTimesheetRecord)

 const findCompany = (key) => {
    const filteredResult = hfdata?.find((e) => e.key_text === key);
    return filteredResult.value;
  };


  const GetPdf = () => {
    const TimesheetData = [
      [
        {
          text: 'Date',
          style: 'tableHead',
          border: [true, true, false, true],
        },
        {
          text: 'Day ',
          style: 'tableHead',
          border: [true, true, false, true],
        },
        {
          text: 'NH',
          style: 'tableHead',
          border: [true, true, false, true],
        },
        {
          text: 'OT',
          style: 'tableHead',
          border: [true, true, false, true],
        },
        {
          text: 'PH',
          style: 'tableHead',
          border: [true, true, false, true],
        },
      ],

    ];
    const groupedTimesheetData = {};
    for (let i = 1; i <= 2; i++) {

      totalEmpTimesheetRecord.forEach((element) => {
        const date = element?.day === 1
        const month = element?.month === 7
        const year = element?.year === 2023
        const employeeId = element?.employee_id === getSingleEmployeeData?.employee_id;
        const projectId = element?.project_id === getSingleEmployeeData?.project_id;

        if (date && month && year && employeeId && projectId) {
          const key = `${element.day}-${element.month}-${element.year}-${element.employee_id}-${element.project_id}`;
          if (!groupedTimesheetData[key]) {
            groupedTimesheetData[key] = [];
          }
          groupedTimesheetData[key].push(element);
        }
      });


    Object.values(groupedTimesheetData).forEach((group) => {
      const firstRecord = group[0];
    TimesheetData.push([
      {
        text: `${firstRecord.day ? firstRecord.day : ''}`,
        border: [true, true, true, true],
        style: 'tableBody',
      },
      {
        text: `${firstRecord.month ? firstRecord.month : ''}`,
        border: [true, true, true, true],
        style: 'tableBody',
      },
      {
        text: `${firstRecord.normal_hours ? firstRecord.normal_hours: ''}`,
        style: 'tableBody',
        border: [true, true, true, true],
      },
      {
        text: `${firstRecord.ot_hours ? firstRecord.ot_hours : ''}`,
        style: 'tableBody',
        border: [true, true, true, true],
      },
      {
        text: `${firstRecord.ph_hours ? firstRecord.ph_hours : ''}`,
        style: 'tableBody',
        border: [true, true, true, true],
      },
    ]);
  });
    }

    const dd = {
      pageSize: 'A4',
      header: PdfHeader({ findCompany }),
      pageMargins: [ 40, 150, 40,80 ],
      footer: PdfFooter,
      content: [
	 
        '\n',
           
           {
       canvas: [
           { type: 'line', x1: 0, y1: -35, x2: 510, y2: -35, lineWidth: 1 }, //Bottom line
       ],
   },
   
           {
             layout: {
               defaultBorder: false,
               hLineWidth: () => {
                 return 1;
               },
               hLineColor: (i) => {
                 if (i === 1 || i === 0) {
                   return '#bfdde8';
                 }
                 return '#eaeaea';
               },
               hLineStyle: () => {
                 return null;
                 //}
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
               widths: ['104%', '41%'],
   
               body: [
                 [
                     {
                       text: ` Project Name:  ${getSingleEmployeeData.title?getSingleEmployeeData.title:''}`,
                       style: ['textSize'],
                     },
                 ],
                 [
                   {
                     text: `Direct Workers Timesheet : `,
                     style: ['textSize'],
                   },
                 ],
                 [
                   {
                     text: `Employee Name : ${getSingleEmployeeData?.first_name}`,
                     style: ['textSize'],
                   },
                 ],
               ],
             },
           },
   
           '\n\n',
           {
             style: 'tableExample',
             table: {
               body: [
                TimesheetData
          //      [
          //  {
          //    text: 'Date',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          //   {
          //    text: '1',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '2',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '3',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '4',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '5',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '6',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '7',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '8',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '9',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '10',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '11',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '12',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '13',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '14',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          //  {
          //    text: '15',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '16',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '17',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '18',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          //  {
          //    text: '19',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '20',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '21',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          //  {
          //    text: '22',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '23',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '24',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          //  {
          //    text: '25',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '26',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '27',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '28',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '29',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          // {
          //    text: '30',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          //  {
          //    text: 'TOTAL HRS',
          //    border: [true, true, true, true],
          //    style: 'tableHead',
          //  },
          //     ],
         
        //        [
   
        //        {
        //          text: `Day`,
        //          style: 'tableHead',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nA\nT`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nU\nN`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `M\nO\nN`,
        //          border: [true, true, true, true],
        //          style: 'tableBody1',
        //        },
        //        {
        //          text: `T\nU\nE`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `W\nE\nD`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `T\nH\nU`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `F\nR\nI`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nA\nT`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nU\nN`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `M\nO\nN`,
        //          border: [true, true, true, true],
        //          style: 'tableBody1',
        //        },
        //        {
        //          text: `T\nU\nE`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `W\nE\nD`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `T\nH\nU`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `F\nR\nI`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //                    {
        //          text: `S\nA\nT`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nU\nN`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `M\nO\nN`,
        //          border: [true, true, true, true],
        //          style: 'tableBody1',
        //        },
        //        {
        //          text: `T\nU\nE`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `W\nE\nD`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `T\nH\nU`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `F\nR\nI`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nA\nT`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nU\nN`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `M\nO\nN`,
        //          border: [true, true, true, true],
        //          style: 'tableBody1',
        //        },
        //        {
        //          text: `T\nU\nE`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `W\nE\nD`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `T\nH\nU`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `F\nR\nI`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nA\nT`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `S\nU\nN`,
        //          style: 'tableBody1',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          border: [true, true, true, true],
        //          style: 'tableBody1',
        //        },
   
        //      ],
             
        //        [
        //        {
        //      text: 'NH',
        //      border: [true, true, true, true],
        //      style: 'tableHead',
        //    },
        //        {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //        {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },         {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },         {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },         {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },         {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //             {
        //      text: '9',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //    {
        //      text: '270',
        //      border: [true, true, true, true],
        //      style: 'tableBody',
        //    },
        //  ],
         
        //        [
   
        //        {
        //          text: `OT`,
        //          style: 'tableHead',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `0`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `0`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `0`,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: `0`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `0`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `0`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `2`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `1`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `2`,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `1`,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: `2`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `1`,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `9`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //      ],
             
        //        [
   
        //        {
        //          text: `PH`,
        //          style: 'tableHead',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: `4`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `1`,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          border: [true, true, true, true],
        //          style: 'tableBody',
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: ``,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //        {
        //          text: `5`,
        //          style: 'tableBody',
        //          border: [true, true, true, true],
        //        },
        //      ]
         
         ],
             },
           },
           
       
       '\n\n',
           {
               style: 'tableExample',
               table: {
                   headerRows: 1,
                   widths: [100, '*', 200, '*'],
                   
                   body: [
                       [
                           {text: '', style: 'textSize'}, 
                           {text: '', style: 'textSize'}, 
                           {text: '', style: 'textSize'},
                           {text: 'Total', style: 'textSize'}
                           ],
     
                   [ 
                       {},
                       {},
                       {text: 'NH Total', style: 'textSize', alignment: 'center'}, 
                       {text: '270 * 140', style: 'textSize', alignment: 'center'}, 
                   ],
                                   [ 
                       {},
                       {},
                       {text: 'OT Total', style: 'textSize', alignment: 'center'}, 
                       {text: '9 * 170', style: 'textSize', alignment: 'center'}, 
                   ],
                   [ 
                       {},
                       {},
                       {text: 'PH Total', style: 'textSize', alignment: 'center'}, 
                       {text: '5 * 190', style: 'textSize', alignment: 'center'}, 
                   ],
                   [ 
                       {},
                       {},
                       {text: 'Total Hours', style: 'textSize', alignment: 'center'}, 
                       {text: '284', style: 'textSize', alignment: 'center'}, 
                   ],
                   [ 
                       {},
                       {},
                       {text: 'Salary', style: 'textSize', alignment: 'center'}, 
                       {text: '29,110', style: 'textSize', alignment: 'center'}, 
                   ],
                   ]
               },
               
               layout: 'lightHorizontalLines'
       },
   
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
         notesTitle: {
           bold: true,
           margin: [0, 50, 0, 3],
         },
         tableHead: {
           border: [false, true, false, true],
           fillColor: '#eaf2f5',
           margin: [0, 5, 0, 5],
           fontSize: 7,
           bold: 'true',
            writingMode:'vertical-rl',
         },
         tableHead1: {
           border: [false, true, false, true],
           fillColor: '#eaf2f5',
           margin: [0, 5, 0, 5],
           fontSize: 7,
           bold: 'true',
            writingMode:'vertical-rl',
          
         },
         tableBody: {
           border: [false, false, false, true],
           margin: [0, 5, 0, 5],
           alignment: 'left',
           fontSize: 7,
           bold: 'true',
           writingMode:'vertical-rl',
           width:5,
         },
         tableBody1: {
           border: [false, false, false, true],
           margin: [0, 5, 0, 5],
           alignment: 'left',
           fontSize: 6,
           writingMode: 'vertical-rl',
         },
       },
       defaultStyle: {
         columnGap: 20,
       } 
     
 };
    pdfMake.vfs = pdfFonts.pdfMake.vfs;
    pdfMake.createPdf(dd, null, null, pdfFonts.pdfMake.vfs).open();
  };

  return (
    <>
     <span onClick={GetPdf}><Icon.Printer/></span>
    </>
    
  );
};

export default PdfEmpTimesheet;
