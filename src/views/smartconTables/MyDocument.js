import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import PropTypes from 'prop-types';

// PDF document styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 10,
  },
  section: {
    margin: 10,
    padding: 10,
    fontSize: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    marginTop: 10,
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCellHeader: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
    fontWeight: 'bold',
    width: '50%',
    textAlign: 'center',
  },
  tableCell: {
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 5,
    width: '50%',
    textAlign: 'center',
  },
});

// PDF document definition
const MyDocument = ({ contactinsert }) => (
  <Document>
    <Page size="A4" style={styles.page}>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Booking Summary</Text>
      </View>

      {/* Booking Details Section */}
      {/* <View style={styles.section}>
        <Text>Room Type: {contactinsert?.room_type || 'N/A'}</Text>
        <Text>Room Number: {contactinsert?.room_number || 'N/A'}</Text>
        <Text>Days: {contactinsert?.qty || 0}</Text>
        <Text>Room Price: {contactinsert?.amount || 0}</Text>
        <Text>Room Amount: {parseFloat(contactinsert?.qty || 0) * parseFloat(contactinsert?.amount || 0)}</Text>
        <Text>Extra Person: {contactinsert?.extra_person || 0}</Text>
        <Text>Per Person Price: {contactinsert?.extra_person_amount || 0}</Text>
        <Text>Extra Person Amount: {parseFloat(contactinsert?.extra_person || 0) * parseFloat(contactinsert?.extra_person_amount || 0)}</Text>
        <Text>Water Qty: {contactinsert?.water_qty || 0}</Text>
        <Text>Per Water: {contactinsert?.water_amount || 0}</Text>
        <Text>Water Amount: {parseFloat(contactinsert?.water_qty || 0) * parseFloat(contactinsert?.water_amount || 0)}</Text>
        <Text>Total Person: {contactinsert?.capacity || 0}</Text>
        <Text>Food Service Amount: {contactinsert?.restaurant_service_amount || 0}</Text>
        <Text>Grand Total: {contactinsert?.grand_total || 0}</Text>
      </View> */}

      {/* Table for Summary */}
      <View style={styles.table}>
        {/* Table Header */}
        <View style={styles.tableRow}>
          <Text style={styles.tableCellHeader}>Item</Text>
          <Text style={styles.tableCellHeader}>Value</Text>
        </View>

        {/* Table Rows */}
        {[
  ['Room Type', contactinsert?.room_type || 'N/A'],
  ['Room Number', contactinsert?.room_number || 'N/A'],
  ['Days', contactinsert?.qty || 0],
  ['Room Price', `Rs : ${contactinsert?.amount || 0}`],
  ['Room Amount', `Rs : ${parseFloat(contactinsert?.qty || 0) * parseFloat(contactinsert?.amount || 0)}`],
  ['Extra Person', contactinsert?.extra_person || 0],
  ['Per Person Price', `Rs : ${contactinsert?.extra_person_amount || 0}`],
  ['Extra Person Amount', `Rs : ${parseFloat(contactinsert?.extra_person || 0) * parseFloat(contactinsert?.extra_person_amount || 0)}`],
  ['Water Qty', contactinsert?.water_qty || 0],
  ['Per Water', `Rs : ${contactinsert?.water_amount || 0}`],
  ['Water Amount', `Rs : ${parseFloat(contactinsert?.water_qty || 0) * parseFloat(contactinsert?.water_amount || 0)}`],
  ['Total Person', contactinsert?.capacity || 0],
  ['Food Service Amount', `Rs : ${contactinsert?.restaurant_service_amount || 0}`],
  ['Grand Total', `Rs : ${contactinsert?.grand_total || 0}`],
].map(([label, value]) => (
  <View style={styles.tableRow} key={value.booking_service_id}>
    <Text style={styles.tableCell}>{label}</Text>
    <Text style={styles.tableCell}>{value}</Text>
  </View>
))}

      </View>

    </Page>
  </Document>
);

// Define PropTypes for the component
MyDocument.propTypes = {
  contactinsert: PropTypes.shape({
    room_type: PropTypes.string,
    room_number: PropTypes.string,
    qty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    extra_person: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    extra_person_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    water_qty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    water_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    restaurant_service_amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    grand_total: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
};

export default MyDocument;
