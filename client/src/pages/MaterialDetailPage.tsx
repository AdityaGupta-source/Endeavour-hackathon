import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

// Mock data for a single material - Replace with API call in production
const getMockMaterial = (id: number) => ({
  id,
  name: 'Recycled Plastic Pellets',
  category: 'Plastics',
  subcategory: 'HDPE',
  quantity: '500 kg',
  minOrderQuantity: '50 kg',
  location: 'San Francisco, CA',
  price: '₹100/kg',
  image: 'https://images.pexels.com/photos/4596401/pexels-photo-4596401.jpeg?auto=compress&cs=tinysrgb&w=1200',
  description: 'High-quality recycled HDPE pellets suitable for injection molding. These pellets are processed from post-consumer waste and have been cleaned, sorted, and processed to meet industry standards.',
  specifications: [
    { name: 'Material', value: 'High-Density Polyethylene (HDPE)' },
    { name: 'Color', value: 'Mixed (primarily white/natural)' },
    { name: 'Melt Flow Index', value: '0.8 g/10min' },
    { name: 'Density', value: '0.95 g/cm³' },
    { name: 'Processing Method', value: 'Injection Molding, Extrusion' }
  ],
  seller: {
    id: 101,
    name: 'EcoPlastics Inc.',
    location: 'San Francisco, CA',
    rating: 4.8,
    verified: true
  },
  sustainability: {
    carbonFootprint: '70% reduction compared to virgin material',
    certifications: ['GRS Certified', 'ISO 14001'],
    recycledContent: '100%'
  },
  availableFrom: '2023-09-01',
  availableUntil: '2023-12-31'
});

// Fallback images if the real images don't load - using Pexels for more reliable loading
const materialFallbackImages = {
  'Plastics': 'https://images.pexels.com/photos/4596401/pexels-photo-4596401.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Wood': 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Metals': 'https://images.pexels.com/photos/2881224/pexels-photo-2881224.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Textiles': 'https://images.pexels.com/photos/6869030/pexels-photo-6869030.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Glass': 'https://images.pexels.com/photos/4255811/pexels-photo-4255811.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Paper': 'https://images.pexels.com/photos/5864250/pexels-photo-5864250.jpeg?auto=compress&cs=tinysrgb&w=600',
  'Default': 'https://images.pexels.com/photos/802221/pexels-photo-802221.jpeg?auto=compress&cs=tinysrgb&w=600'
};

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Breadcrumbs = styled.div`
  margin-bottom: 2rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  
  a {
    text-decoration: none;
    color: ${({ theme }) => theme.colors.primary.main};
    
    &:hover {
      text-decoration: underline;
    }
  }
  
  span {
    margin: 0 0.5rem;
  }
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ImageSection = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const MaterialImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  min-height: 300px;
  max-height: 500px;
  object-fit: cover;
  background-color: #f0f0f0; /* Light gray background for image placeholders */
  border-radius: ${({ theme }) => theme.borderRadius.lg};
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MaterialName = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary.dark};
  margin-bottom: 0.5rem;
`;

const CategoryBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary.light}30;
  color: ${({ theme }) => theme.colors.primary.dark};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const PriceSection = styled.div`
  background-color: ${({ theme }) => theme.colors.background.paper};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const Price = styled.div`
  font-size: 1.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.bold};
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 0.5rem;
`;

const AvailabilityInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const ActionButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary.main};
  color: white;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.dark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.disabled};
    cursor: not-allowed;
  }
`;

const ContactButton = styled(ActionButton)`
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.primary.main};
  color: ${({ theme }) => theme.colors.primary.main};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primary.light}20;
  }
`;

const DescriptionSection = styled.div`
  margin-top: 1rem;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Description = styled.p`
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const SpecificationsSection = styled.div`
  margin-top: 2rem;
`;

const SpecificationsList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const SpecificationItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const SpecificationName = styled.span`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const SpecificationValue = styled.span`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const SellerSection = styled.div`
  margin-top: 2rem;
  background-color: ${({ theme }) => theme.colors.background.paper};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const SellerHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
`;

const SellerName = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-right: 0.5rem;
`;

const VerifiedBadge = styled.span`
  display: inline-flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.info}20;
  color: ${({ theme }) => theme.colors.info};
  padding: 0.25rem 0.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const SellerInfo = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 1rem;
`;

const SustainabilitySection = styled.div`
  margin-top: 2rem;
`;

const SustainabilityGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
`;

const SustainabilityCard = styled.div`
  background-color: ${({ theme }) => theme.colors.success}10;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: 1rem;
`;

const SustainabilityTitle = styled.h4`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 0.5rem;
`;

const SustainabilityValue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CertificationsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const CertificationBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.success}20;
  color: ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.75rem;
`;

const AiRecommendationsSection = styled.div`
  margin-top: 2rem;
  background: linear-gradient(145deg, ${({ theme }) => theme.colors.background.paper}, #1a2636);
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 4px 15px rgba(0, 240, 255, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.secondary.dark};
`;

const AiHeader = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.secondary.main};
`;

const ComplianceAlert = styled.div<{ $level: 'warning' | 'danger' }>`
  background-color: ${({ $level, theme }) => $level === 'danger' ? theme.colors.error + '20' : theme.colors.warning + '20'};
  color: ${({ $level, theme }) => $level === 'danger' ? theme.colors.error : theme.colors.warning};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ $level, theme }) => $level === 'danger' ? theme.colors.error : theme.colors.warning};
  margin-bottom: 1.5rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
`;

const PathwayGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PathwayCard = styled.div<{ $feasibility: 'High' | 'Medium' | 'Experimental' | 'Not Recommended' }>`
  background-color: ${({ theme }) => theme.colors.background.default};
  padding: 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border-left: 4px solid ${({ $feasibility, theme }) => {
    switch($feasibility) {
      case 'High': return theme.colors.success;
      case 'Medium': return theme.colors.warning;
      case 'Experimental': return theme.colors.info;
      case 'Not Recommended': return theme.colors.error;
      default: return theme.colors.border;
    }
  }};
`;

const PathwayTitle = styled.h4`
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const PathwayFeasibility = styled.span<{ $feasibility: 'High' | 'Medium' | 'Experimental' | 'Not Recommended' }>`
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  background-color: ${({ $feasibility, theme }) => {
    switch($feasibility) {
      case 'High': return theme.colors.success + '30';
      case 'Medium': return theme.colors.warning + '30';
      case 'Experimental': return theme.colors.info + '30';
      case 'Not Recommended': return theme.colors.error + '30';
      default: return theme.colors.border;
    }
  }};
  color: ${({ $feasibility, theme }) => {
    switch($feasibility) {
      case 'High': return theme.colors.success;
      case 'Medium': return theme.colors.warning;
      case 'Experimental': return theme.colors.info;
      case 'Not Recommended': return theme.colors.error;
      default: return theme.colors.text.primary;
    }
  }};
`;

const LogisticsSection = styled.div`
  margin-top: 2rem;
  background-color: ${({ theme }) => theme.colors.background.paper};
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const LogisticsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-top: 1rem;
`;

const StatBox = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background.default};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-align: center;
`;

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const StatValue = styled.div<{ $highlight?: boolean }>`
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ $highlight, theme }) => $highlight ? theme.colors.success : theme.colors.text.primary};
`;

const AuditSection = styled.div`
  margin-top: 2rem;
  background: linear-gradient(145deg, #1a2235, #0a0f16);
  padding: 1.5rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.3);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
`;

const AuditInfo = styled.div`
  flex: 1;
`;

const AuditTitle = styled.h3`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  color: #FFD700;
  margin-bottom: 0.5rem;
`;

const AuditDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  line-height: 1.5;
`;

const AuditButton = styled.button<{ $requested?: boolean }>`
  padding: 0.75rem 1.5rem;
  background: ${({ $requested }) => $requested ? 'rgba(255, 215, 0, 0.1)' : 'linear-gradient(135deg, #FFD700, #F5A623)'};
  color: ${({ $requested }) => $requested ? '#FFD700' : '#0A0F16'};
  border: ${({ $requested }) => $requested ? '1px solid #FFD700' : 'none'};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: bold;
  font-size: 0.95rem;
  cursor: ${({ $requested }) => $requested ? 'default' : 'pointer'};
  transition: all 0.2s ease;
  white-space: nowrap;
  
  &:hover {
    transform: ${({ $requested }) => $requested ? 'none' : 'translateY(-2px)'};
    box-shadow: ${({ $requested }) => $requested ? 'none' : '0 4px 12px rgba(255, 215, 0, 0.3)'};
  }
  
  &:disabled {
    opacity: ${({ $requested }) => $requested ? 1 : 0.7};
    cursor: ${({ $requested }) => $requested ? 'default' : 'not-allowed'};
    transform: none;
  }
`;

const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const materialId = parseInt(id || '1');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [material, setMaterial] = useState(getMockMaterial(materialId));
  const [isOrdering, setIsOrdering] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const [auditRequested, setAuditRequested] = useState(false);
  const [isProcessingAudit, setIsProcessingAudit] = useState(false);
  
  // In a real application, you would fetch the material data from an API
  // useEffect(() => {
  //   const fetchMaterial = async () => {
  //     try {
  //       const response = await fetch(`/api/materials/${materialId}`);
  //       const data = await response.json();
  //       setMaterial(data);
  //     } catch (error) {
  //       console.error('Error fetching material:', error);
  //     }
  //   };
  //   
  //   fetchMaterial();
  // }, [materialId]);
  
  const handleOrder = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setIsOrdering(true);
    // In a real application, you would handle the order process here
    setTimeout(() => {
      alert('Order placed successfully!');
      setIsOrdering(false);
    }, 1000);
  };
  
  const handleContact = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    // In a real application, you would handle the contact process here
    alert(`Contact ${material.seller.name} for more information`);
  };

  const handleRequestAudit = () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }
    
    setIsProcessingAudit(true);
    // Simulate payment and processing
    setTimeout(() => {
      setAuditRequested(true);
      setIsProcessingAudit(false);
      alert('Physical Audit requested! A ReValue certified expert will be dispatched within 48 hours to verify this material.');
    }, 1500);
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Get correct image source
  const getImageSource = () => {
    if (imageError) {
      return materialFallbackImages[material.category as keyof typeof materialFallbackImages] || 
             materialFallbackImages.Default;
    }
    return material.image;
  };
  
  const mockComplianceWarnings = [
    { id: 1, level: 'danger' as const, message: '⚠️ Compliance Alert: Unsafe for food packaging due to post-consumer chemical exposure.' },
    { id: 2, level: 'warning' as const, message: '⚠️ Regulatory Note: Requires additional decontamination step for children\'s products.' }
  ];

  const mockPathways = [
    { id: 1, name: 'Non-food Storage', feasibility: 'High' as const, description: 'Excellent structural integrity suitable for robust storage.' },
    { id: 2, name: 'Construction Piping', feasibility: 'Medium' as const, description: 'Requires blending with virgin material for optimal pressure rating.' },
    { id: 3, name: '3D Print Filament', feasibility: 'Experimental' as const, description: 'Currently testing melt-flow consistency for consumer 3D printers.' },
    { id: 4, name: 'Food Grade Packaging', feasibility: 'Not Recommended' as const, description: 'Fails safety standards for direct food contact.' },
  ];
  
  return (
    <PageContainer>
      <Breadcrumbs>
        <Link to="/marketplace">Marketplace</Link> <span>›</span> {material.name}
      </Breadcrumbs>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ContentGrid>
          <ImageSection>
            <MaterialImage 
              src={getImageSource()} 
              alt={material.name} 
              onError={handleImageError}
            />
          </ImageSection>
          
          <InfoSection>
            <div>
              <CategoryBadge>{material.category}</CategoryBadge>
              <MaterialName>{material.name}</MaterialName>
            </div>
            
            <PriceSection>
              <Price>{material.price}</Price>
              <AvailabilityInfo>
                <div>Available Quantity: {material.quantity}</div>
                <div>Min. Order: {material.minOrderQuantity}</div>
              </AvailabilityInfo>
              <ActionButton 
                onClick={handleOrder}
                disabled={isOrdering}
              >
                {isOrdering ? 'Processing...' : 'Request to Order'}
              </ActionButton>
              <div style={{ marginTop: '1rem' }}>
                <ContactButton onClick={handleContact}>
                  Contact Seller
                </ContactButton>
              </div>
            </PriceSection>
            
            <DescriptionSection>
              <SectionTitle>Description</SectionTitle>
              <Description>{material.description}</Description>
            </DescriptionSection>
          </InfoSection>
        </ContentGrid>
        
        <SpecificationsSection>
          <SectionTitle>Specifications</SectionTitle>
          <SpecificationsList>
            {material.specifications.map((spec, index) => (
              <SpecificationItem key={index}>
                <SpecificationName>{spec.name}</SpecificationName>
                <SpecificationValue>{spec.value}</SpecificationValue>
              </SpecificationItem>
            ))}
          </SpecificationsList>
        </SpecificationsSection>
        
        <SustainabilitySection>
          <SectionTitle>Sustainability Information</SectionTitle>
          <SustainabilityGrid>
            <SustainabilityCard>
              <SustainabilityTitle>Carbon Footprint</SustainabilityTitle>
              <SustainabilityValue>{material.sustainability.carbonFootprint}</SustainabilityValue>
            </SustainabilityCard>
            
            <SustainabilityCard>
              <SustainabilityTitle>Recycled Content</SustainabilityTitle>
              <SustainabilityValue>{material.sustainability.recycledContent}</SustainabilityValue>
            </SustainabilityCard>
            
            <SustainabilityCard>
              <SustainabilityTitle>Certifications</SustainabilityTitle>
              <CertificationsList>
                {material.sustainability.certifications.map((cert, index) => (
                  <CertificationBadge key={index}>{cert}</CertificationBadge>
                ))}
              </CertificationsList>
            </SustainabilityCard>
          </SustainabilityGrid>
        </SustainabilitySection>

        <AiRecommendationsSection>
          <AiHeader>🧠 ReValue AI Recommendations</AiHeader>
          
          {mockComplianceWarnings.map(warning => (
            <ComplianceAlert key={warning.id} $level={warning.level}>
              {warning.message}
            </ComplianceAlert>
          ))}
          
          <SectionTitle style={{ borderBottom: 'none' }}>Suggested Reuse Pathways</SectionTitle>
          <PathwayGrid>
            {mockPathways.map(pathway => (
              <PathwayCard key={pathway.id} $feasibility={pathway.feasibility}>
                <PathwayTitle>
                  {pathway.name}
                  <PathwayFeasibility $feasibility={pathway.feasibility}>
                    {pathway.feasibility}
                  </PathwayFeasibility>
                </PathwayTitle>
                <p style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>{pathway.description}</p>
              </PathwayCard>
            ))}
          </PathwayGrid>
        </AiRecommendationsSection>

        <LogisticsSection>
          <SectionTitle>🚛 Logistics Feasibility Calculator</SectionTitle>
          <p style={{ fontSize: '0.875rem', color: '#A0AEC0' }}>Based on your location and material quantity (Mock Calculation)</p>
          <LogisticsGrid>
            <StatBox>
              <StatLabel>Estimated Transport Cost</StatLabel>
              <StatValue>₹12,500</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Material Value ({material.quantity})</StatLabel>
              <StatValue>₹50,000</StatValue>
            </StatBox>
            <StatBox style={{ gridColumn: '1 / -1', background: 'rgba(0, 255, 163, 0.1)' }}>
              <StatLabel>Expected Net Value</StatLabel>
              <StatValue $highlight>₹37,500</StatValue>
            </StatBox>
          </LogisticsGrid>
        </LogisticsSection>
        
        <AuditSection>
          <AuditInfo>
            <AuditTitle>🛡️ ReValue Certified Physical Audit</AuditTitle>
            <AuditDescription>
              Doubting the AI verification or need absolute certainty before making a bulk purchase? 
              Request a physical inspection. A certified local expert will physically inspect, swab, and verify this exact material batch.
            </AuditDescription>
          </AuditInfo>
          <AuditButton 
            onClick={handleRequestAudit} 
            disabled={auditRequested || isProcessingAudit}
            $requested={auditRequested}
          >
            {isProcessingAudit ? 'Processing Payment...' : 
             auditRequested ? '✓ Audit Requested' : 
             'Request Audit (₹4,500)'}
          </AuditButton>
        </AuditSection>
        
        <SellerSection>
          <SellerHeader>
            <SellerName>{material.seller.name}</SellerName>
            {material.seller.verified && (
              <VerifiedBadge>Verified Seller</VerifiedBadge>
            )}
          </SellerHeader>
          <SellerInfo>
            <div>Location: {material.seller.location}</div>
            <div>Rating: {material.seller.rating}/5</div>
          </SellerInfo>
          <ContactButton onClick={handleContact}>
            Contact Seller
          </ContactButton>
        </SellerSection>
      </motion.div>
    </PageContainer>
  );
};

export default MaterialDetailPage; 