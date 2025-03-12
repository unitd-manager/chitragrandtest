import React, { useEffect, useState } from 'react';
import * as Icon from 'react-feather';
import { Button } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'datatables.net-dt/js/dataTables.dataTables';
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import 'datatables.net-buttons/js/buttons.colVis';
import 'datatables.net-buttons/js/buttons.flash';
// import 'datatables.net-buttons/js/buttons.html5';
// import 'datatables.net-buttons/js/buttons.print';
import { Link } from 'react-router-dom';
import api from '../../constants/api';
import BreadCrumbs from '../../layouts/breadcrumbs/BreadCrumbs';
import CommonTable from '../../components/CommonTable';


const Room = () => {
  //state variable
  const [room, setRoom] = useState();
  const [loading, setLoading] = useState(false);

  //get category data
  const getContact = () => {
    api
      .get('/Booking/getRoom')
      .then((res) => {
        setRoom(res.data.data);
        $('#example').DataTable({
          // pagingType: 'full_numbers',
          // pageLength: 20,
          // processing: true,
          // dom: 'Bfrtip',
          // buttons: [
          //   {
          //     extend: 'print',
          //     text: 'Print',
          //     className: 'shadow-none btn btn-primary',
          //   },
          // ],
        });
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    getContact();
  }, []);

  //  stucture of Category list view
  const columns = [
    {
      name: '#',
      selector: '',
      grow: 0,
      wrap: true,
      width: '4%',
    },
    {
      name: 'Edit',
      selector: 'edit',
      cell: () => <Icon.Edit2 />,
      grow: 0,
      width: 'auto',
      button: true,
      sortable: false,
    },
    {
      name: ' Room Type',
      selector: 'room_type',
      sortable: true,
      grow: 0,
      wrap: true,
    },
    {
      name: 'Available',
      selector: 'capacity',
      sortable: true,
      width: 'auto',
      grow: 2,
    },
   
   
  ];

  return (
    <div className="MainDiv">
      <div className=" pt-xs-25">
        <BreadCrumbs />

        <CommonTable
          loading={loading}
          title="Room List"
          Button={
            <Link to="/RoomDetails">
              <Button color="primary" className="shadow-none">
                Add New
              </Button>
            </Link>
          }
        >
          <thead>
            <tr>
              {columns.map((cell) => {
                return <td key={cell.name}>{cell.name}</td>;
              })}
            </tr>
          </thead>
          <tbody>
            {room &&
              room.map((element, index) => {
                return (
                  <tr key={element.room_id}>
                    <td>{index + 1}</td>
                    <td>
                      <Link to={`/RoomEdit/${element.room_id}`}>
                        <Icon.Edit2 />
                      </Link>
                    </td>
                    <td>{element.room_type}</td>
                    {/* <td>{element.room_number}</td> */}
                    <td>{element.room_count}</td>
                    {/* <td>{element.floor_number}</td>
                    <td>{element.room_status}</td> */}
                  </tr>
                );
              })}
          </tbody>
        </CommonTable>
      </div>
    </div>
  );
};
export default Room;
