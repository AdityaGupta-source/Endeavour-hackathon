import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 2fr;
  }
`;

const FormCard = styled(motion.div)`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Select = styled.select`
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.default};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: bold;
  cursor: pointer;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
`;

const MatchList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MatchCard = styled.div`
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.sm};
  border-left: 4px solid ${({ theme }) => theme.colors.primary.main};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DemandsPage: React.FC = () => {
  const [demands, setDemands] = useState([
    { id: 1, type: 'Plastics', grade: 'HDPE', quantity: '1000 kg', location: 'Germany', price: '$1.00/kg' },
    { id: 2, type: 'Metals', grade: 'Aluminum', quantity: '500 kg', location: 'France', price: '$2.50/kg' },
  ]);

  const [formData, setFormData] = useState({
    type: 'Plastics',
    grade: '',
    quantity: '',
    location: '',
    price: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDemands([...demands, { id: Date.now(), ...formData }]);
    setFormData({ type: 'Plastics', grade: '', quantity: '', location: '', price: '' });
  };

  return (
    <PageContainer>
      <Title>Buyer Demands</Title>
      <Subtitle>Post your material requirements and automatically match with available secondary resources.</Subtitle>
      
      <Grid>
        <FormCard
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <h2 style={{ marginBottom: '1.5rem' }}>Post a New Demand</h2>
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Material Category</Label>
              <Select name="type" value={formData.type} onChange={handleChange}>
                <option value="Plastics">Plastics</option>
                <option value="Metals">Metals</option>
                <option value="Paper">Paper & Pulp</option>
                <option value="Textiles">Textiles</option>
              </Select>
            </FormGroup>
            <FormGroup>
              <Label>Specific Grade</Label>
              <Input name="grade" placeholder="e.g., Clear PET Flakes" value={formData.grade} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Required Quantity</Label>
              <Input name="quantity" placeholder="e.g., 5 Tons per month" value={formData.quantity} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Delivery Location</Label>
              <Input name="location" placeholder="e.g., Berlin, DE" value={formData.location} onChange={handleChange} required />
            </FormGroup>
            <FormGroup>
              <Label>Target Price</Label>
              <Input name="price" placeholder="e.g., $0.80/kg" value={formData.price} onChange={handleChange} required />
            </FormGroup>
            <Button type="submit">Post Demand</Button>
          </form>
        </FormCard>
        
        <div>
          <h2 style={{ marginBottom: '1.5rem' }}>Your Active Demands & AI Matches</h2>
          <MatchList>
            {demands.map(demand => (
              <MatchCard key={demand.id}>
                <div>
                  <h3 style={{ marginBottom: '0.5rem', color: '#00FFA3' }}>{demand.grade} ({demand.type})</h3>
                  <p style={{ color: '#A0AEC0', fontSize: '0.9rem' }}>Quantity: {demand.quantity} | Location: {demand.location} | Target: {demand.price}</p>
                  <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#00F0FF' }}>🤖 2 Potential Matches Found in Marketplace</p>
                </div>
                <Button style={{ width: 'auto', backgroundColor: '#131C28', border: '1px solid #00F0FF' }}>View Matches</Button>
              </MatchCard>
            ))}
          </MatchList>
        </div>
      </Grid>
    </PageContainer>
  );
};

export default DemandsPage;
