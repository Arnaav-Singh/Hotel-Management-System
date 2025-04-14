import React, { useState, useEffect } from 'react';
 import { Link } from 'react-router-dom';
 import { format } from 'date-fns';
 import { CalendarIcon } from 'lucide-react';
 import axios from 'axios';
 import styled from 'styled-components';

 // --- Reusable Styles ---
 const Container = styled.div`
   max-width: 1200px;
   margin: 0 auto;
   padding: 0 20px;
 `;

 const Header = styled.header`
   background-color: #333;
   color: white;
   padding: 1rem 0;
   position: sticky;
   top: 0;
   z-index: 10;
   box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
 `;

 const Nav = styled.nav`
   display: flex;
   justify-content: space-between;
   align-items: center;
 `;

 const Logo = styled(Link)`
   font-size: 1.8rem;
   font-weight: 700;
   text-decoration: none;
   color: white;
 `;

 const NavLinks = styled.div`
   display: flex;
   gap: 20px;
 `;

 const NavLink = styled(Link)`
   font-size: 1.1rem;
   text-decoration: none;
   color: white;
   &:hover {
     color: #ff6f61;
   }
 `;

 // --- Reservation Management Specific Styles ---
 const ReservationContainer = styled.div`
   min-height: 100vh;
   background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
   font-family: 'Inter', sans-serif;
   padding: 40px 0;
 `;

 const Title = styled.h2`
   font-size: 2.5rem;
   font-weight: 800;
   text-align: center;
   margin-bottom: 40px;
   color: #2c3e50;
   text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
 `;

 const FormContainer = styled.form`
   display: flex;
   flex-direction: column;
   align-items: center;
   padding: 2rem;
   background-color: rgba(255, 255, 255, 0.95);
   border-radius: 16px;
   box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
   backdrop-filter: blur(10px);
   width: 100%;
   max-width: 600px;
   margin: 0 auto;
 `;

 const Select = styled.select`
   width: 100%;
   padding: 0.75rem;
   border: 2px solid #e2e8f0;
   border-radius: 8px;
   margin-bottom: 1.5rem;
   font-size: 1rem;
   transition: all 0.3s ease;
   background-color: white;
   color: #333;
   font-family: 'Inter', sans-serif;

   &:hover {
     border-color: #cbd5e1;
   }
   &:focus {
     outline: none;
     border-color: #b8860b;
     box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.2);
   }
   &::placeholder {
     color: #999;
   }
 `;

 const DateInputContainer = styled.div`
   display: flex;
   flex-direction: column;
   gap: 1.5rem;
   width: 100%;
   margin-bottom: 1.5rem;
 `;

 const DateInputWrapper = styled.div`
   position: relative;
   width: 100%;
 `;

 const DateInput = styled.input`
   width: 100%;
   padding: 0.75rem 2.5rem 0.75rem 0.75rem;
   border: 2px solid #e2e8f0;
   border-radius: 8px;
   font-size: 1rem;
   transition: all 0.3s ease;
   background-color: white;
   color: #333;
   font-family: 'Inter', sans-serif;

   &:hover {
     border-color: #cbd5e1;
   }
   &:focus {
     outline: none;
     border-color: #b8860b;
     box-shadow: 0 0 0 3px rgba(184, 134, 11, 0.2);
   }
   &::placeholder {
     color: #999;
   }
 `;

 const StyledCalendarIcon = styled(CalendarIcon)`
   position: absolute;
   right: 0.75rem;
   top: 50%;
   transform: translateY(-50%);
   width: 1.25rem;
   height: 1.25rem;
   color: #999;
   pointer-events: none;
 `;

 const SubmitButton = styled.button`
   width: 100%;
   padding: 0.75rem;
   background-color: #b8860b;
   color: white;
   font-size: 1.1rem;
   font-weight: 600;
   border: none;
   border-radius: 8px;
   cursor: pointer;
   transition: all 0.3s ease;
   font-family: 'Inter', sans-serif;

   &:hover:not(:disabled) {
     background-color: #916807;
     transform: translateY(-2px);
     box-shadow: 0 5px 15px rgba(184, 134, 11, 0.4);
   }
   &:disabled {
     background-color: #94a3b8;
     cursor: not-allowed;
     transform: none;
   }
 `;

 const ErrorMessage = styled.div`
   background-color: #fee2e2;
   color: #dc2626;
   padding: 1rem;
   margin-top: 1rem;
   border-radius: 6px;
   border: 1px solid #ef4444;
   font-size: 0.9rem;
   text-align: center;
   font-family: 'Inter', sans-serif;
 `;

 // --- Displaying Reservations Styles ---
 const ReservationListSection = styled.div`
   margin-top: 40px;
   padding: 20px;
   background-color: rgba(255, 255, 255, 0.95);
   border-radius: 16px;
   box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
   backdrop-filter: blur(10px);
 `;

 const ReservationListTitle = styled.h3`
   font-size: 1.8rem;
   font-weight: 700;
   color: #2c3e50;
   margin-bottom: 20px;
   text-align: center;
 `;

 const ReservationTable = styled.table`
   width: 100%;
   border-collapse: collapse;
   margin-top: 15px;
 `;

 const TableHead = styled.thead`
   background-color: #f0f0f0;
 `;

 const TableRow = styled.tr`
   &:nth-child(even) {
     background-color: #f9f9f9;
   }
 `;

 const TableHeader = styled.th`
   padding: 10px;
   text-align: left;
   border-bottom: 2px solid #ddd;
   font-weight: 600;
   color: #333;
 `;

 const TableCell = styled.td`
   padding: 10px;
   text-align: left;
 `;

 const NoReservations = styled.p`
   font-style: italic;
   color: #777;
   text-align: center;
 `;

 const ReservationManagement = () => {
   const [customers, setCustomers] = useState([]);
   const [roomTypes, setRoomTypes] = useState([]);
   const [customerId, setCustomerId] = useState('');
   const [roomTypeId, setRoomTypeId] = useState('');
   const [startDate, setStartDate] = useState(undefined);
   const [endDate, setEndDate] = useState(undefined);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);
   const [reservations, setReservations] = useState([]);

   useEffect(() => {
     const fetchCustomers = async () => {
       try {
         const response = await axios.get('http://localhost:5050/api/customers');
         setCustomers(response.data);
       } catch (error) {
         setError(error.message);
       }
     };
     const fetchRoomTypes = async () => {
       try {
         const response = await axios.get('http://localhost:5050/api/room-types');
         setRoomTypes(response.data);
       } catch (error) {
         setError(error.message);
       }
     };
     const fetchReservations = async () => {
       try {
         const response = await axios.get('http://localhost:5050/api/reservations');
         setReservations(response.data);
       } catch (error) {
         setError(error.message);
         console.error("Error fetching reservations:", error);
       }
     };
     fetchCustomers();
     fetchRoomTypes();
     fetchReservations();
   }, []);

   const handleSubmit = async (e) => {
     e.preventDefault();
     setLoading(true);
     setError(null);
     try {
       if (!startDate || !endDate) {
         setError("Please select both start and end dates.");
         setLoading(false);
         return;
       }
       const formattedStartDate = format(startDate, "yyyy-MM-dd");
       const formattedEndDate = format(endDate, "yyyy-MM-dd");

       const response = await axios.post('http://localhost:5050/api/reservations', {
         customerId,
         roomTypeId,
         startDate: formattedStartDate,
         endDate: formattedEndDate
       });
       alert('Reservation made successfully!');
       setCustomerId('');
       setRoomTypeId('');
       setStartDate(undefined);
       setEndDate(undefined);
       // After successful reservation, refresh the list of reservations
       const fetchReservations = async () => {
         try {
           const response = await axios.get('http://localhost:5050/api/reservations');
           setReservations(response.data);
         } catch (error) {
           setError(error.message);
           console.error("Error fetching reservations:", error);
         }
       };
       fetchReservations();
     } catch (error) {
       setError(error.response?.data?.error || error.message);
       console.error("Reservation Error:", error);
     } finally {
       setLoading(false);
     }
   };

   const handleStartDateChange = (e) => {
     const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
     setStartDate(selectedDate);
   };

   const handleEndDateChange = (e) => {
     const selectedDate = e.target.value ? new Date(e.target.value) : undefined;
     setEndDate(selectedDate);
   };

   // Helper function to find customer name by ID
   const getCustomerName = (customerId) => {
     const customer = customers.find(cust => cust.id === customerId);
     return customer ? customer.name : 'Unknown Customer';
   };

   // Helper function to find room type by ID
   const getRoomTypeName = (roomTypeId) => {
     const room = roomTypes.find(rt => rt.id === roomTypeId);
     return room ? room.type : 'Unknown Room Type';
   };

   return (
     <ReservationContainer>
       <Header>
         <Container>
           <Nav>
             <Logo to="/">My Hotel Admin</Logo>
             <NavLinks>
               <NavLink to="/room-types">Room Management</NavLink>
               <NavLink to="/customer-management">Customer Management</NavLink>
               <NavLink to="/reservation-management">Reservation Management</NavLink>
               <NavLink to="/complaint-redressal">Complaint Redressal</NavLink>
             </NavLinks>
           </Nav>
         </Container>
       </Header>
       <Container>
         <Title>Book a Stay</Title>
         <FormContainer onSubmit={handleSubmit}>
           <Select
             value={customerId}
             onChange={(e) => setCustomerId(e.target.value)}
           >
             <option value="">Select Customer</option>
             {customers.map(customer => (
               <option key={customer.id} value={customer.id}>
                 {customer.name}
               </option>
             ))}
           </Select>

           <Select
             value={roomTypeId}
             onChange={(e) => setRoomTypeId(e.target.value)}
           >
             <option value="">Select Room Type</option>
             {roomTypes.map(room => (
               <option key={room.id} value={room.id}>
                 {room.type}
               </option>
             ))}
           </Select>

           <DateInputContainer>
             <DateInputWrapper>
               <DateInput
                 type="date"
                 id="start-date"
                 onChange={handleStartDateChange}
                 value={startDate ? format(startDate, "yyyy-MM-dd") : ''}
                 required
               />
               <StyledCalendarIcon />
             </DateInputWrapper>

             <DateInputWrapper>
               <DateInput
                 type="date"
                 id="end-date"
                 onChange={handleEndDateChange}
                 value={endDate ? format(endDate, "yyyy-MM-dd") : ''}
                 required
               />
               <StyledCalendarIcon />
             </DateInputWrapper>
           </DateInputContainer>

           <SubmitButton type="submit" disabled={loading}>
             {loading ? 'Making Reservation...' : 'BOOK'}
           </SubmitButton>
           {error && <ErrorMessage>{error}</ErrorMessage>}
         </FormContainer>

         {/* Section to display existing reservations */}
         <ReservationListSection>
           <ReservationListTitle>Current Reservations</ReservationListTitle>
           {reservations.length > 0 ? (
             <ReservationTable>
               <TableHead>
                 <TableRow>
                   <TableHeader>Reservation ID</TableHeader>
                   <TableHeader>Customer Name</TableHeader>
                   <TableHeader>Room Type</TableHeader>
                   <TableHeader>Start Date</TableHeader>
                   <TableHeader>End Date</TableHeader>
                 </TableRow>
               </TableHead>
               <tbody>
                 {reservations.map(reservation => (
                   <TableRow key={reservation.id}>
                     <TableCell>{reservation.id}</TableCell>
                     <TableCell>{getCustomerName(reservation.customer_id)}</TableCell>
                     <TableCell>{getRoomTypeName(reservation.room_type_id)}</TableCell>
                     <TableCell>{reservation.start_date}</TableCell>
                     <TableCell>{reservation.end_date}</TableCell>
                   </TableRow>
                 ))}
               </tbody>
             </ReservationTable>
           ) : (
             <NoReservations>No reservations have been made yet.</NoReservations>
           )}
         </ReservationListSection>
       </Container>
     </ReservationContainer>
   );
 };

 export default ReservationManagement;