import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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

// --- Room Types Specific Styles ---
const RoomContainer = styled.div`
  min-height: 100vh;
  background-color: #f5f5f5;
  padding-bottom: 40px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  padding: 16px 0;
`;

const Card = styled.div`
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #fff;
  transition: transform 0.3s ease;
  &:hover {
    transform: translateY(-5px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
`;

const Image = styled.img`
  width: 100%;
  height: 150px;
  object-fit: cover;
`;

const HeaderText = styled.div`
  padding: 8px;
  background-color: #e5e7eb;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1f2937;
`;

const Content = styled.div`
  padding: 16px;
`;

const Badge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
  font-size: 0.875rem;
`;

const Rate = styled.p`
  font-size: 1rem;
  font-weight: 500;
  color: #1f2937;
  margin: 0;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin: 32px 0;
  background: linear-gradient(to right, #9333ea, #a855f7);
  -webkit-background-clip: text;
  color: transparent;
`;

const Loading = styled.div`
  text-align: center;
  font-size: 1.25rem;
  padding: 40px;
`;

const Error = styled.div`
  text-align: center;
  font-size: 1.25rem;
  color: #dc2626;
  padding: 40px;
`;

// Map room types to image URL
const roomTypeImages = {
  'Single Room': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Double Room': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Deluxe Room': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Suite': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Family Room': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Budget Single Room': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Budget Double Room': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Luxury Suite': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Connecting Rooms': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
  'Presidential Suite': 'https://images.unsplash.com/photo-1621293954908-907159247fc8?q=80&w=2070&auto=format&fit=crop',
};

const RoomTypes = () => {
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const response = await new Promise((resolve) => {
          setTimeout(() => {
            const mockData = [
              { id: 1, type: 'Single Room', availability: 10, rate: 50.00 },
              { id: 2, type: 'Double Room', availability: 15, rate: 75.00 },
              { id: 3, type: 'Deluxe Room', availability: 5, rate: 100.00 },
              { id: 4, type: 'Suite', availability: 2, rate: 150.00 },
              { id: 5, type: 'Family Room', availability: 8, rate: 120.00 },
            ];
            resolve(mockData);
          }, 1000);
        });

        setRoomTypes(response);
      } catch (err) {
        setError(err.message || 'Failed to fetch room types');
      } finally {
        setLoading(false);
      }
    };
    fetchRoomTypes();
  }, []);

  if (loading) return (
    <RoomContainer>
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
        <Loading>Loading...</Loading>
      </Container>
    </RoomContainer>
  );

  if (error) return (
    <RoomContainer>
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
        <Error>Error: {error}</Error>
      </Container>
    </RoomContainer>
  );

  return (
    <RoomContainer>
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
        <Title>Our Room Types</Title>
        <Grid>
          {roomTypes.map((room) => {
            const imageUrl = roomTypeImages[room.type] || 'https://placehold.co/400x300/EEE/31343C?text=Room&font=Montserrat';
            const isHighAvailability = room.availability > 5;
            return (
              <Card key={room.id}>
                <ImageContainer>
                  <Image src={imageUrl} alt={room.type} />
                </ImageContainer>
                <HeaderText>{room.type}</HeaderText>
                <Content>
                  <Badge
                    style={{
                      backgroundColor: isHighAvailability ? '#d1fae5' : '#fee2e2',
                      color: isHighAvailability ? '#10b981' : '#dc2626',
                    }}
                  >
                    Availability: {room.availability}
                  </Badge>
                  <Rate>Rate: ${room.rate.toFixed(2)}</Rate>
                </Content>
              </Card>
            );
          })}
        </Grid>
      </Container>
    </RoomContainer>
  );
};

export default RoomTypes;