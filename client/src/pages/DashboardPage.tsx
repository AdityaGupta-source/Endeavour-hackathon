import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { calculateCarbonOffset, CarbonOffsetData } from '../services/aiService';

const revenueData = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 5890 },
  { name: 'Jun', revenue: 7390 },
];

const wasteData = [
  { name: 'Plastics', value: 400 },
  { name: 'Metals', value: 300 },
  { name: 'Paper', value: 300 },
  { name: 'Textiles', value: 200 },
];
const COLORS = ['#00FFA3', '#00F0FF', '#FFD700', '#FF3366'];

// Mock data - Replace with API calls in production
const mockStats = {
  totalTransactions: 24,
  activeListings: 8,
  pendingOrders: 3,
  carbonSaved: '1,250 kg CO2e',
  wasteRecycled: '3,500 kg',
  revenues: '$12,450'
};

const mockRecentTransactions = [
  {
    id: 'txn-001',
    date: '2023-09-15',
    material: 'Recycled HDPE Pellets',
    amount: '500 kg',
    value: '$600',
    status: 'completed',
    partner: 'EcoPlastics Inc.'
  },
  {
    id: 'txn-002',
    date: '2023-09-12',
    material: 'Wood Offcuts',
    amount: '200 kg',
    value: '$100',
    status: 'completed',
    partner: 'GreenWood Solutions'
  },
  {
    id: 'txn-003',
    date: '2023-09-08',
    material: 'Aluminum Scrap',
    amount: '150 kg',
    value: '$270',
    status: 'processing',
    partner: 'MetalWorks Ltd.'
  },
  {
    id: 'txn-004',
    date: '2023-09-05',
    material: 'Textile Remnants',
    amount: '75 kg',
    value: '$187.50',
    status: 'completed',
    partner: 'FabricCycle'
  }
];

const mockActiveSupplyChains = [
  {
    id: 'chain-001',
    name: 'Plastic Recycling Loop',
    role: 'Supplier',
    materials: ['HDPE', 'PP'],
    partners: 7
  },
  {
    id: 'chain-002',
    name: 'Textile Recovery Network',
    role: 'Processor',
    materials: ['Cotton', 'Polyester'],
    partners: 11
  }
];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin: 0;
`;

const WelcomeMessage = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.5rem;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const OutlineButton = styled(Button)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.main};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.light}20;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 7fr 3fr;
  }
`;

const MainColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const SideColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Card = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const CardHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CardTitle = styled.h2`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const CardContent = styled.div`
  padding: 1.5rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.5rem;
`;

const StatCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  
  &:nth-child(1) {
    border-top: 3px solid ${({ theme }) => theme.colors.primary.main};
  }
  
  &:nth-child(2) {
    border-top: 3px solid ${({ theme }) => theme.colors.secondary.main};
  }
  
  &:nth-child(3) {
    border-top: 3px solid ${({ theme }) => theme.colors.warning};
  }
  
  &:nth-child(4) {
    border-top: 3px solid ${({ theme }) => theme.colors.success};
  }
  
  &:nth-child(5) {
    border-top: 3px solid ${({ theme }) => theme.colors.info};
  }
  
  &:nth-child(6) {
    border-top: 3px solid ${({ theme }) => theme.colors.error};
  }
`;

const StatLabel = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.5rem;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const TableRow = styled.tr`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.default};
  }
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const TableCell = styled.td`
  padding: 1rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: ${({ status, theme }) => 
    status === 'completed' ? `${theme.colors.success}20` : `${theme.colors.warning}20`};
  color: ${({ status, theme }) => 
    status === 'completed' ? theme.colors.success : theme.colors.warning};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-transform: capitalize;
`;

const SupplyChainItem = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SupplyChainName = styled.h3`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.primary.dark};
  margin: 0 0 0.5rem 0;
`;

const SupplyChainDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SupplyChainDetail = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.disabled};
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const MaterialTags = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const MaterialTag = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.primary.light}30;
  color: ${({ theme }) => theme.colors.primary.dark};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
`;

const ViewLink = styled.a`
  color: ${({ theme }) => theme.colors.primary.main};
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  transition: color 0.2s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

// Carbon Offset Widget Styles
const carbonGlow = keyframes`
  0%, 100% { box-shadow: 0 0 15px rgba(0, 255, 163, 0.2); }
  50% { box-shadow: 0 0 30px rgba(0, 255, 163, 0.4); }
`;

const countUp = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const CarbonWidget = styled(motion.div)`
  background: linear-gradient(135deg, #0D1117 0%, #0A1A15 50%, #0D1117 100%);
  border: 1px solid #1E3D2D;
  border-radius: 16px;
  overflow: hidden;
  animation: ${carbonGlow} 3s ease-in-out infinite;
`;

const CarbonHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid #1E3D2D;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const CarbonHeaderIcon = styled.span`
  font-size: 1.5rem;
`;

const CarbonHeaderTitle = styled.h2`
  font-size: 1.25rem;
  color: #00FFA3;
  margin: 0;
`;

const CarbonContent = styled.div`
  padding: 1.5rem;
`;

const CarbonStatsRow = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const CarbonStatBox = styled.div`
  background: rgba(0, 255, 163, 0.05);
  border: 1px solid rgba(0, 255, 163, 0.15);
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  animation: ${countUp} 0.6s ease-out backwards;
`;

const CarbonStatIcon = styled.div`
  font-size: 1.8rem;
  margin-bottom: 0.4rem;
`;

const CarbonStatValue = styled.div`
  font-size: 1.6rem;
  font-weight: 800;
  color: #00FFA3;
  margin-bottom: 2px;
`;

const CarbonStatLabel = styled.div`
  font-size: 0.75rem;
  color: #A0AEC0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const CarbonBreakdown = styled.div`
  margin-top: 1rem;
`;

const BreakdownTitle = styled.h4`
  font-size: 0.9rem;
  color: #A0AEC0;
  margin-bottom: 0.75rem;
`;

const BreakdownBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 0.6rem;
`;

const BreakdownLabel = styled.span`
  font-size: 0.8rem;
  color: #E2E8F0;
  min-width: 80px;
`;

const BreakdownTrack = styled.div`
  flex: 1;
  height: 8px;
  background: #1E2D3D;
  border-radius: 4px;
  overflow: hidden;
`;

const BreakdownFill = styled(motion.div)<{ $color: string }>`
  height: 100%;
  background: ${({ $color }) => $color};
  border-radius: 4px;
`;

const BreakdownValue = styled.span`
  font-size: 0.8rem;
  color: #00FFA3;
  min-width: 60px;
  text-align: right;
`;

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { setPageContext } = useChatContext();

  // Set chat context
  useEffect(() => {
    setPageContext({
      pageName: 'Dashboard',
      pageType: 'dashboard',
      title: 'Your Dashboard',
      details: `The user is viewing their dashboard.\nRole: ${user?.role || 'Seller'}\nStats: ${mockStats.totalTransactions} transactions, ${mockStats.activeListings} active listings, ${mockStats.pendingOrders} pending orders\nCarbon Saved: ${mockStats.carbonSaved}\nWaste Recycled: ${mockStats.wasteRecycled}\nRevenues: ${mockStats.revenues}`,
    });
  }, [user, setPageContext]);
  
  // Handler functions for button clicks
  const handleAddListing = () => {
    navigate('/create-listing');
  };
  
  const handleViewOrders = () => {
    navigate('/transactions');
  };
  
  const handleManageSupplyChains = () => {
    navigate('/supply-chains');
  };
  
  const handleViewTransaction = (transactionId: string) => {
    navigate(`/transactions`);
  };
  
  const handleViewImpactReport = () => {
    navigate('/transactions');
  };

  // Carbon Offset Calculator
  const [carbonData, setCarbonData] = useState<CarbonOffsetData | null>(null);
  
  useEffect(() => {
    // Calculate carbon offset based on mock transaction data
    const tradedMaterials = [
      { category: 'Plastics', quantityKg: 500 },
      { category: 'Wood', quantityKg: 200 },
      { category: 'Metals', quantityKg: 150 },
      { category: 'Textiles', quantityKg: 75 },
      { category: 'Glass', quantityKg: 1000 },
      { category: 'Paper', quantityKg: 750 },
    ];
    setCarbonData(calculateCarbonOffset(tradedMaterials));
  }, []);

  const breakdownColors = ['#00FFA3', '#00F0FF', '#FFD700', '#FF3366', '#A78BFA', '#F97316'];
  return (
    <PageContainer>
      <Header>
        <div>
          <Title>Dashboard</Title>
          <WelcomeMessage>
            Welcome back, {user?.name || 'User'}! You are logged in as a <span style={{ color: '#00FFA3', textTransform: 'capitalize' }}>{user?.role || 'Seller'}</span>.
          </WelcomeMessage>
        </div>
        <ActionButtons>
          <Button onClick={handleAddListing}>Add New Listing</Button>
          <OutlineButton onClick={handleViewOrders}>View Orders</OutlineButton>
        </ActionButtons>
      </Header>
      
      <DashboardGrid>
        <MainColumn>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <StatsGrid>
                <StatCard>
                  <StatLabel>Total Transactions</StatLabel>
                  <StatValue>{mockStats.totalTransactions}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Active Listings</StatLabel>
                  <StatValue>{mockStats.activeListings}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Pending Orders</StatLabel>
                  <StatValue>{mockStats.pendingOrders}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Carbon Saved</StatLabel>
                  <StatValue>{mockStats.carbonSaved}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Waste Recycled</StatLabel>
                  <StatValue>{mockStats.wasteRecycled}</StatValue>
                </StatCard>
                <StatCard>
                  <StatLabel>Revenues</StatLabel>
                  <StatValue>{mockStats.revenues}</StatValue>
                </StatCard>
              </StatsGrid>
            </CardContent>
          </Card>
          
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
          >
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#A0AEC0' }}>Revenue Trend</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#2D3748" />
                        <XAxis dataKey="name" stroke="#A0AEC0" />
                        <YAxis stroke="#A0AEC0" />
                        <Tooltip contentStyle={{ backgroundColor: '#131C28', border: '1px solid #2D3748', color: '#FFF' }} />
                        <Bar dataKey="revenue" fill="#00FFA3" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h3 style={{ marginBottom: '1rem', fontSize: '1rem', color: '#A0AEC0' }}>Waste by Category</h3>
                  <div style={{ height: '300px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={wasteData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          fill="#8884d8"
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {wasteData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: '#131C28', border: '1px solid #2D3748', color: '#FFF' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Carbon Offset Calculator Widget */}
          {carbonData && (
            <CarbonWidget
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.07 }}
            >
              <CarbonHeader>
                <CarbonHeaderIcon>🌍</CarbonHeaderIcon>
                <CarbonHeaderTitle>Your Environmental Impact</CarbonHeaderTitle>
              </CarbonHeader>
              <CarbonContent>
                <CarbonStatsRow>
                  <CarbonStatBox style={{ animationDelay: '0.1s' }}>
                    <CarbonStatIcon>🌱</CarbonStatIcon>
                    <CarbonStatValue>{carbonData.co2SavedKg.toLocaleString()}</CarbonStatValue>
                    <CarbonStatLabel>kg CO₂ Saved</CarbonStatLabel>
                  </CarbonStatBox>
                  <CarbonStatBox style={{ animationDelay: '0.2s' }}>
                    <CarbonStatIcon>💧</CarbonStatIcon>
                    <CarbonStatValue>{carbonData.waterSavedLiters.toLocaleString()}</CarbonStatValue>
                    <CarbonStatLabel>Liters Water Saved</CarbonStatLabel>
                  </CarbonStatBox>
                  <CarbonStatBox style={{ animationDelay: '0.3s' }}>
                    <CarbonStatIcon>⚡</CarbonStatIcon>
                    <CarbonStatValue>{carbonData.energySavedKwh.toLocaleString()}</CarbonStatValue>
                    <CarbonStatLabel>kWh Energy Saved</CarbonStatLabel>
                  </CarbonStatBox>
                  <CarbonStatBox style={{ animationDelay: '0.4s' }}>
                    <CarbonStatIcon>🌳</CarbonStatIcon>
                    <CarbonStatValue>{carbonData.treesEquivalent}</CarbonStatValue>
                    <CarbonStatLabel>Trees Equivalent</CarbonStatLabel>
                  </CarbonStatBox>
                </CarbonStatsRow>

                <CarbonBreakdown>
                  <BreakdownTitle>CO₂ Savings by Material</BreakdownTitle>
                  {carbonData.breakdown.map((item, index) => (
                    <BreakdownBar key={item.material}>
                      <BreakdownLabel>{item.material}</BreakdownLabel>
                      <BreakdownTrack>
                        <BreakdownFill
                          $color={breakdownColors[index % breakdownColors.length]}
                          initial={{ width: 0 }}
                          animate={{ width: `${item.percentage}%` }}
                          transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                        />
                      </BreakdownTrack>
                      <BreakdownValue>{item.co2Saved} kg</BreakdownValue>
                    </BreakdownBar>
                  ))}
                </CarbonBreakdown>

                <div style={{ marginTop: '1.5rem', padding: '12px', background: 'rgba(0,255,163,0.08)', borderRadius: '10px', textAlign: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#A0AEC0' }}>
                    🎯 You've diverted <strong style={{ color: '#00FFA3' }}>{carbonData.landfillDiverted.toLocaleString()} kg</strong> of materials from landfill!
                  </span>
                </div>
              </CarbonContent>
            </CarbonWidget>
          )}
          
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <OutlineButton onClick={() => navigate('/transactions')}>View All</OutlineButton>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Material</TableHeader>
                    <TableHeader>Amount</TableHeader>
                    <TableHeader>Value</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Partner</TableHeader>
                    <TableHeader>Action</TableHeader>
                  </TableRow>
                </TableHead>
                <tbody>
                  {mockRecentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.material}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.value}</TableCell>
                      <TableCell>
                        <StatusBadge status={transaction.status}>
                          {transaction.status}
                        </StatusBadge>
                      </TableCell>
                      <TableCell>{transaction.partner}</TableCell>
                      <TableCell>
                        <ViewLink onClick={() => handleViewTransaction(transaction.id)}>
                          View
                        </ViewLink>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </CardContent>
          </Card>
        </MainColumn>
        
        <SideColumn>
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <CardHeader>
              <CardTitle>Your Supply Chains</CardTitle>
            </CardHeader>
            <CardContent>
              {mockActiveSupplyChains.map((chain) => (
                <SupplyChainItem key={chain.id}>
                  <SupplyChainName>{chain.name}</SupplyChainName>
                  <SupplyChainDetails>
                    <SupplyChainDetail>
                      <DetailLabel>Role</DetailLabel>
                      <DetailValue>{chain.role}</DetailValue>
                    </SupplyChainDetail>
                    <SupplyChainDetail>
                      <DetailLabel>Partners</DetailLabel>
                      <DetailValue>{chain.partners}</DetailValue>
                    </SupplyChainDetail>
                  </SupplyChainDetails>
                  <MaterialTags>
                    {chain.materials.map((material, index) => (
                      <MaterialTag key={index}>{material}</MaterialTag>
                    ))}
                  </MaterialTags>
                </SupplyChainItem>
              ))}
              {mockActiveSupplyChains.length === 0 && (
                <div>You haven't joined any supply chains yet.</div>
              )}
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <OutlineButton onClick={handleManageSupplyChains}>Manage Supply Chains</OutlineButton>
              </div>
            </CardContent>
          </Card>
          
          <Card
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CardHeader>
              <CardTitle>Impact Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <StatCard style={{ marginBottom: '1rem' }}>
                <StatLabel>Carbon Footprint Reduction</StatLabel>
                <StatValue>{mockStats.carbonSaved}</StatValue>
              </StatCard>
              <StatCard>
                <StatLabel>Material Circularity</StatLabel>
                <StatValue>75%</StatValue>
              </StatCard>
              <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                <OutlineButton onClick={handleViewImpactReport}>View Impact Report</OutlineButton>
              </div>
            </CardContent>
          </Card>
        </SideColumn>
      </DashboardGrid>
    </PageContainer>
  );
};

export default DashboardPage; 