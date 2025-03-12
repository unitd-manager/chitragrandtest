import React from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import BookingInvoicePDF from "./MyDocument"; // Import PDF component

const BookingDetails = () => {
  const bookingData = {
    customer: {
      name: "John Doe",
      phone: "9876543210",
      email: "john@example.com",
      address: "123, Street Name, City",
    },
    invoice: {
      invoiceCode: "INV-001",
      date: "25-Feb-2025",
      status: "Due",
      subtotal: 8000,
      gst: 12, // GST percentage
      gstValue: 960, // 12% of 8000
      total: 8960, // subtotal + GST
    },
    rooms: [{ type: "Deluxe Room", qty: 2, price: 3500 }],
    foodServices: [{ name: "Breakfast", qty: 2, price: 500 }],
    extraPersons: [{ name: "Extra Bed", nights: 2, rate: 1000 }],
  };

  return (
    <div>
      <h2>Hotel Booking Details</h2>
      <PDFDownloadLink
        document={<BookingInvoicePDF booking={bookingData} />}
        fileName="Hotel_Booking_Invoice.pdf"
      >
        {({ loading }) => (loading ? "Generating PDF..." : "Download Invoice PDF")}
      </PDFDownloadLink>
    </div>
  );
};

export default BookingDetails;
