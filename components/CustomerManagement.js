import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';

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

// --- Customer Management Specific Styles ---
const CustomerContainer = styled.div`
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

const Card = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Form = styled.form`
  display: grid;
  gap: 20px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #fff;
  &:hover {
    border-color: #cbd5e1;
  }
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
`;

const Button = styled.button`
  padding: 14px;
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
  }
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  &:disabled {
    background: #94a3b8;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const LoadingText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

const Dots = styled.span`
  display: inline-flex;
  animation: dotFlashing 1s infinite linear alternate;
  span:nth-child(2) { animation-delay: 0.2s; }
  span:nth-child(3) { animation-delay: 0.4s; }
`;

const Error = styled.p`
  color: #ef4444;
  text-align: center;
  margin-top: 15px;
  font-size: 0.9rem;
  background: #fee2e2;
  padding: 8px;
  border-radius: 6px;
`;

const CustomerList = styled.div`
  margin-top: 40px;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
`;

const Subtitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #2c3e50;
`;

const NoCustomers = styled.p`
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  padding: 20px;
  background: #f1f5f9;
  border-radius: 8px;
`;

const CustomerGrid = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
`;

const CustomerCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const CustomerAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 600;
  flex-shrink: 0;
`;

const CustomerDetails = styled.div`
  flex: 1;
`;

const CustomerName = styled.p`
  font-size: 1.2rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
`;

const CustomerInfo = styled.p`
  margin: 4px 0;
  color: #475569;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const Icon = styled.span`
  font-size: 1rem;
`;

const CustomerManagement = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/customers');
      setCustomers(response.data);
    } catch (error) {
      setError('Failed to fetch customers');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5050/api/customers', { name, email, phone });
      alert('Customer added successfully!');
      setName('');
      setEmail('');
      setPhone('');
      fetchCustomers();
    } catch (error) {
      setError('Failed to add customer. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerContainer>
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
        <Title>Customer Management</Title>
        
        {/* Form Section */}
        <Card>
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </InputWrapper>
            <InputWrapper>
              <Input
                type="text"
                placeholder="Phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </InputWrapper>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoadingText>
                  Adding
                  <Dots>
                    <span>.</span><span>.</span><span>.</span>
                  </Dots>
                </LoadingText>
              ) : 'Add Customer'}
            </Button>
          </Form>
          {error && <Error>{error}</Error>}
        </Card>

        {/* Customer List Section */}
        <CustomerList>
          <Subtitle>Customer Directory</Subtitle>
          {customers.length === 0 ? (
            <NoCustomers>No customers yet - add some above!</NoCustomers>
          ) : (
            <CustomerGrid>
              {customers.map((customer) => (
                <CustomerCard key={customer.id}>
                  <CustomerAvatar>
                    {customer.name.charAt(0).toUpperCase()}
                  </CustomerAvatar>
                  <CustomerDetails>
                    <CustomerName>{customer.name}</CustomerName>
                    <CustomerInfo>
                      <Icon>✉️</Icon> {customer.email}
                    </CustomerInfo>
                    <CustomerInfo>
                      <Icon>📞</Icon> {customer.phone}
                    </CustomerInfo>
                  </CustomerDetails>
                </CustomerCard>
              ))}
            </CustomerGrid>
          )}
        </CustomerList>
      </Container>
    </CustomerContainer>
  );
};

// Add this CSS animation globally (e.g., in index.css)
const globalStyles = `
  @keyframes dotFlashing {
    0% { opacity: 1; }
    50%, 100% { opacity: 0.2; }
  }
`;

export default CustomerManagement;