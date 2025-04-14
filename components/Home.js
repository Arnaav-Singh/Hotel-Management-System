import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

// --- Reusable Styles ---
const Container = styled.div`
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
`;

const Button = styled(Link)`
    display: inline-block;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.3s ease;
    cursor: pointer;
    text-align: center;
`;

// --- Component-Specific Styles ---

const HomeContainer = styled.div`
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    background-color: #f5f5f5;
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

const HeroSection = styled.section`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 60vh;
    overflow: hidden;
    color: white;
    text-align: center;
    background-color: #b0c4de;
`;

const HeroContent = styled.div`
    position: relative;
    z-index: 2;
    padding: 20px;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
`;

const HeroTitle = styled.h1`
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: white;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.5);
    text-align: center;
`;

const HeroSubtitle = styled.p`
    font-size: 1.2rem;
    margin-bottom: 30px;
    color: white;
    text-shadow: 1px 1px 4px rgba(0, 0, 0, 0.5);
    text-align: center;
`;

const DashboardContent = styled.section`
    padding: 60px 0;
    text-align: center;
    background-color: white;
`;

const DashboardTitle = styled.h2`
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 40px;
    color: #333;
    text-align: left;
`;

const DashboardSummary = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 40px;
    margin-top: 40px;
`;

const SummaryCard = styled.div`
    background-color: #fff;
    border-radius: 10px;
    padding: 30px;
    text-align: left;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    border: 1px solid #eee;
    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    }
`;

const SummaryTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 15px;
    color: #333;
`;

const SummaryValue = styled.p`
    font-size: 2rem;
    font-weight: 700;
    color: #ff6f61;
`;

const RecentActivity = styled.div`
    margin-top: 60px;
    text-align: left;
`;

const ActivityTitle = styled.h3`
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: #333;
`;

const ActivityList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
`;

const ActivityItem = styled.li`
    padding: 15px;
    border-bottom: 1px solid #eee;
    font-size: 1rem;
    color: #555;
    &:last-child {
        border-bottom: none;
    }
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const DataTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
`;

const TableHeader = styled.thead`
    background-color: #f0f0f0;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f8f8f8;
    }
`;

const TableHead = styled.th`
    padding: 12px;
    text-align: left;
    border-bottom: 2px solid #ddd;
    font-weight: 600;
    color: #333;
`;

const TableCell = styled.td`
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    color: #555;
`;

const SiteFooter = styled.footer`
    padding: 30px 0;
    text-align: center;
    background-color: #333;
    color: #eee;
    font-size: 0.9rem;
    margin-top: auto;
`;

const Home = () => {
    const [dashboardData, setDashboardData] = useState({
        totalRevenue: 0,
        occupancyRate: 0,
        availableRooms: 0,
        totalReservations: 0,
        recentActivity: [],
        dashboardTable: [] // Renamed and will hold data for the new table
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                //  Replace '/api/dashboard' with your actual API endpoint
                const response = await fetch('http://localhost:5050/api/dashboard');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDashboardData(data);
            } catch (error) {
                setError(error instanceof Error ? error.message : "An unexpected error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <HomeContainer>
                <Header>
                    <Container>
                        <Nav>
                            <Logo to="/">My Hotel Admin</Logo>
                            <NavLinks>
                                <NavLink to="/room-types">Room Management</NavLink>
                                <NavLink to="/customer-management">Customer Management</NavLink>
                                <NavLink to="/reservation-management">Reservation Management</NavLink>
                                <NavLink to="/complaint-redressal">complaint-redressal</NavLink>
                            </NavLinks>
                        </Nav>
                    </Container>
                </Header>
                <DashboardContent>
                    <Container>
                        <p>Loading dashboard data...</p>
                    </Container>
                </DashboardContent>
            </HomeContainer>
        );
    }

    if (error) {
        return (
            <HomeContainer>
                <Header>
                    <Container>
                        <Nav>
                            <Logo to="/">My Hotel Admin</Logo>
                            <NavLinks>
                                <NavLink to="/room-types">Room Management</NavLink>
                                <NavLink to="/customer-management">Customer Management</NavLink>
                                <NavLink to="/reservation-management">Reservation Management</NavLink>
                                <NavLink to="/complaint-redressal">complaint-redressal</NavLink>
                            </NavLinks>
                        </Nav>
                    </Container>
                </Header>
                <DashboardContent>
                    <Container>
                        <p>Error: {error}</p>
                    </Container>
                </DashboardContent>
            </HomeContainer>
        );
    }
    const { totalRevenue, occupancyRate, availableRooms, totalReservations, recentActivity, dashboardTable } = dashboardData;

    return (
        <HomeContainer>
            <Header>
                <Container>
                    <Nav>
                        <Logo to="/">My Hotel Admin</Logo>
                        <NavLinks>
                            <NavLink to="/room-types">Room Management</NavLink>
                            <NavLink to="/customer-management">Customer Management</NavLink>
                            <NavLink to="/reservation-management">Reservation Management</NavLink>
                            <NavLink to="/complaint-redressal">complaint-redressal</NavLink>
                        </NavLinks>
                    </Nav>
                </Container>
            </Header>

            <HeroSection>
                <HeroContent>
                    <HeroTitle>Welcome to the Admin Dashboard</HeroTitle>
                    <HeroSubtitle>
                        Manage your hotel operations efficiently.
                    </HeroSubtitle>
                </HeroContent>
            </HeroSection>

            <DashboardContent>
                <Container>
                    <DashboardTitle>Dashboard Overview</DashboardTitle>
                    <DashboardSummary>
                        <SummaryCard>
                            <SummaryTitle>Total Revenue</SummaryTitle>
                            <SummaryValue>${totalRevenue}</SummaryValue>
                        </SummaryCard>
                        <SummaryCard>
                            <SummaryTitle>Occupancy Rate</SummaryTitle>
                            <SummaryValue>{occupancyRate}%</SummaryValue>
                        </SummaryCard>
                        <SummaryCard>
                            <SummaryTitle>Available Rooms</SummaryTitle>
                            <SummaryValue>{availableRooms}</SummaryValue>
                        </SummaryCard>
                        <SummaryCard>
                            <SummaryTitle>Total Reservations</SummaryTitle>
                            <SummaryValue>{totalReservations}</SummaryValue>
                        </SummaryCard>
                    </DashboardSummary>

                    <RecentActivity>
                        <ActivityTitle>Recent Activity</ActivityTitle>
                        <ActivityList>
                            {recentActivity.map((activity, index) => (
                                <ActivityItem key={index}>
                                    <span>{activity.description}</span>
                                    <span>{activity.time}</span>
                                </ActivityItem>
                            ))}
                        </ActivityList>
                    </RecentActivity>

                    <h2 style={{ textAlign: 'left' }}>Dashboard Table</h2>
                    {dashboardTable && dashboardTable.length > 0 ? (
                        <DataTable>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Reservation ID</TableHead>
                                    <TableHead>Customer Name</TableHead>
                                    <TableHead>Room Type</TableHead>
                                    <TableHead>Start Date</TableHead>
                                    <TableHead>End Date</TableHead>
                                    <TableHead>Complaint</TableHead>
                                    <TableHead>Complaint Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <tbody>
                                {dashboardTable.map((row) => (
                                    <TableRow key={row.reservation_id}>
                                        <TableCell>{row.reservation_id}</TableCell>
                                        <TableCell>{row.customer_name}</TableCell>
                                        <TableCell>{row.room_type}</TableCell>
                                        <TableCell>{row.start_date}</TableCell>
                                        <TableCell>{row.end_date}</TableCell>
                                         <TableCell>{row.complaint}</TableCell>
                                        <TableCell>{row.complaint_status}</TableCell>
                                    </TableRow>
                                ))}
                            </tbody>
                        </DataTable>
                    ) : (
                        <p>No data available for the dashboard table.</p>
                    )}
                </Container>
            </DashboardContent>

            <SiteFooter>
                <p>&copy; {new Date().getFullYear()} My Hotel Admin. All rights reserved.</p>
            </SiteFooter>
        </HomeContainer>
    );
};

export default Home;

