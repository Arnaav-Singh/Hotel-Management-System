import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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

// --- Complaint Redressal Specific Styles ---
const ComplaintContainer = styled.div`
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
  width: 100%;
  max-width: 500px;
  margin: 0 auto 40px;
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
  &:hover:not(:disabled) {
    border-color: #cbd5e1;
  }
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
  &:disabled {
    background-color: #f1f5f9;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  font-size: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  outline: none;
  transition: all 0.3s ease;
  background-color: #fff;
  resize: vertical;
  min-height: 120px;
  font-family: 'Inter', sans-serif;
  &:hover:not(:disabled) {
    border-color: #cbd5e1;
  }
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
  }
  &:disabled {
    background-color: #f1f5f9;
    opacity: 0.7;
    cursor: not-allowed;
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
    boxShadow: none;
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

const ComplaintList = styled.div`
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const Subtitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 25px;
  color: #2c3e50;
`;

const ComplaintGrid = styled.div`
  display: grid;
  gap: 20px;
`;

const ComplaintCard = styled.div`
  padding: 20px;
  border-radius: 12px;
  background-color: #fff;
  border: 1px solid #e2e8f0;
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    boxShadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ComplaintText = styled.p`
  font-size: 1rem;
  color: #475569;
  margin-bottom: 10px;
`;

const StatusSelect = styled.select`
  padding: 8px 12px;
  font-size: 0.95rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  background-color: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    border-color: #cbd5e1;
  }
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
    outline: none;
  }
`;

const ComplaintRedressal = () => {
  const [customerId, setCustomerId] = useState('');
  const [complaint, setComplaint] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await axios.get('http://localhost:5050/api/complaints');
      setComplaints(response.data);
    } catch (err) {
      setError('Failed to fetch complaints');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post('http://localhost:5050/api/complaints', { 
        customer_id: customerId, 
        complaint 
      });
      alert('Complaint submitted successfully!');
      setCustomerId('');
      setComplaint('');
      fetchComplaints(); // Refresh complaint list
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (complaintId, newStatus) => {
    try {
      await axios.put(`http://localhost:5050/api/complaints/${complaintId}`, { 
        status: newStatus 
      });
      setComplaints(complaints.map(comp => 
        comp.id === complaintId ? { ...comp, status: newStatus } : comp
      ));
    } catch (err) {
      setError('Failed to update complaint status');
    }
  };

  return (
    <ComplaintContainer>
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
        <Title>Complaint Redressal</Title>
        
        {/* Complaint Submission Form */}
        <Card>
          <Form onSubmit={handleSubmit}>
            <InputWrapper>
              <Input
                type="number"
                placeholder="Customer ID"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                disabled={loading}
              />
            </InputWrapper>
            <InputWrapper>
              <Textarea
                placeholder="Describe your complaint..."
                value={complaint}
                onChange={(e) => setComplaint(e.target.value)}
                required
                disabled={loading}
                rows="5"
              />
            </InputWrapper>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <LoadingText>
                  Submitting
                  <Dots>
                    <span>.</span><span>.</span><span>.</span>
                  </Dots>
                </LoadingText>
              ) : 'Submit Complaint'}
            </Button>
          </Form>
          {error && <Error>{error}</Error>}
        </Card>

        {/* Complaint List */}
        <ComplaintList>
          <Subtitle>Registered Complaints</Subtitle>
          {complaints.length === 0 ? (
            <ComplaintText>No complaints registered yet</ComplaintText>
          ) : (
            <ComplaintGrid>
              {complaints.map((comp) => (
                <ComplaintCard key={comp.id}>
                  <ComplaintText><strong>Customer ID:</strong> {comp.customer_id}</ComplaintText>
                  <ComplaintText>{comp.complaint}</ComplaintText>
                  <StatusSelect
                    value={comp.status}
                    onChange={(e) => handleStatusChange(comp.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Resolved">Resolved</option>
                  </StatusSelect>
                </ComplaintCard>
              ))}
            </ComplaintGrid>
          )}
        </ComplaintList>
      </Container>
    </ComplaintContainer>
  );
};

// Add this CSS animation globally (e.g., in index.css)
const globalStyles = `
  @keyframes dotFlashing {
    0% { opacity: 1; }
    50%, 100% { opacity: 0.2; }
  }
`;

export default ComplaintRedressal;