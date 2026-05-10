import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { evaluateListing, ListingEvaluation } from '../services/aiService';

// Mock data - Replace with API call in production
const mockListings = [
  {
    id: 101,
    title: 'Recycled PET Flakes',
    description: 'High-quality recycled PET flakes, sorted and cleaned, suitable for food packaging.',
    category: 'Plastics',
    subcategory: 'PET',
    quantity: '5000 kg',
    price: '₹105 per kg',
    location: 'Mumbai, Maharashtra',
    createdAt: '2025-11-15',
    status: 'active',
    views: 142,
    inquiries: 7,
    image: 'https://images.pexels.com/photos/4596401/pexels-photo-4596401.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 102,
    title: 'Recovered Aluminum Scrap',
    description: 'Clean aluminum scrap from manufacturing process, high purity level.',
    category: 'Metals',
    subcategory: 'Aluminum',
    quantity: '2500 kg',
    price: '₹235 per kg',
    location: 'Jamnagar, Gujarat',
    createdAt: '2026-01-02',
    status: 'active',
    views: 98,
    inquiries: 4,
    image: 'https://images.pexels.com/photos/2881224/pexels-photo-2881224.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 103,
    title: 'Post-Industrial Cotton Waste',
    description: 'Cotton waste from textile manufacturing, can be used for recycled yarn production.',
    category: 'Textiles',
    subcategory: 'Cotton',
    quantity: '1800 kg',
    price: '₹75 per kg',
    location: 'Tirupur, Tamil Nadu',
    createdAt: '2026-02-28',
    status: 'pending',
    views: 0,
    inquiries: 0,
    image: 'https://images.pexels.com/photos/6869030/pexels-photo-6869030.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: 104,
    title: 'Recovered Wood Pulp',
    description: 'Wood pulp recovered from paper recycling process, suitable for low-grade paper products.',
    category: 'Paper & Pulp',
    subcategory: 'Wood Pulp',
    quantity: '10000 kg',
    price: '₹38 per kg',
    location: 'Saharanpur, Uttar Pradesh',
    createdAt: '2025-10-20',
    status: 'sold',
    views: 215,
    inquiries: 12,
    image: 'https://images.pexels.com/photos/5864250/pexels-photo-5864250.jpeg?auto=compress&cs=tinysrgb&w=600'
  }
];

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.primary.main};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  max-width: 800px;
  line-height: 1.6;
`;

const ActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const FilterSelect = styled.select`
  padding: 0.5rem 1rem;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.background.paper};
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
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

const ListingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const ListingCard = styled(motion.div)<{ status: string }>`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-top: 5px solid ${({ status, theme }) => 
    status === 'active' ? theme.colors.success :
    status === 'pending' ? theme.colors.warning :
    status === 'sold' ? theme.colors.info :
    theme.colors.primary.main
  };

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 255, 163, 0.15);
  }
`;

const CardImage = styled.div<{ $src: string }>`
  width: 100%;
  height: 160px;
  background-image: url(${({ $src }) => $src});
  background-size: cover;
  background-position: center;
  background-color: #1A2332;
`;

const ListingHeader = styled.div`
  padding: 1.5rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`;

const ListingTitle = styled.h3`
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0 0 0.5rem 0;
`;

const ListingCategory = styled.div`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const StatusBadge = styled.span<{ status: string }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: ${({ status, theme }) => 
    status === 'active' ? `${theme.colors.success}20` : 
    status === 'pending' ? `${theme.colors.warning}20` :
    status === 'sold' ? `${theme.colors.info}20` :
    theme.colors.primary.light
  };
  color: ${({ status, theme }) => 
    status === 'active' ? theme.colors.success : 
    status === 'pending' ? theme.colors.warning :
    status === 'sold' ? theme.colors.info :
    theme.colors.primary.main
  };
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  text-transform: capitalize;
`;

const ListingContent = styled.div`
  padding: 1.5rem;
`;

const ListingDescription = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text.primary};
  line-height: 1.6;
  margin-bottom: 1.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ListingDetails = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const DetailLabel = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 0.25rem;
`;

const DetailValue = styled.span`
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ListingFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FooterItem = styled.div`
  display: flex;
  align-items: center;
`;

const ButtonsContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button<{ variant: 'primary' | 'secondary' | 'danger' }>`
  padding: 0.5rem 1rem;
  background-color: ${({ variant, theme }) => 
    variant === 'primary' ? theme.colors.primary.main : 
    variant === 'secondary' ? 'transparent' :
    theme.colors.error
  };
  color: ${({ variant, theme }) => 
    variant === 'secondary' ? theme.colors.primary.main : 'white'
  };
  border: ${({ variant, theme }) => 
    variant === 'secondary' ? `1px solid ${theme.colors.primary.main}` : 'none'
  };
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 0.875rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  cursor: pointer;
  flex: 1;
  
  &:hover {
    background-color: ${({ variant, theme }) => 
      variant === 'primary' ? theme.colors.primary.dark : 
      variant === 'secondary' ? `${theme.colors.primary.light}20` :
      theme.colors.error
    };
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1rem;
`;

const EmptyStateText = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: 2rem;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const AIResultBanner = styled(motion.div)`
  margin-top: 1rem;
  padding: 12px 16px;
  background: linear-gradient(135deg, rgba(0, 255, 163, 0.08), rgba(0, 200, 130, 0.05));
  border: 1px solid rgba(0, 255, 163, 0.2);
  border-radius: 10px;
  font-size: 0.85rem;
  color: #E2E8F0;

  .ai-header {
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 700;
    color: #00FFA3;
    margin-bottom: 8px;
    font-size: 0.9rem;
  }

  .ai-score {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
  }

  .ai-score-bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }

  .ai-score-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.8s ease;
  }

  .ai-price {
    color: #00FFA3;
    font-weight: 600;
  }

  .ai-detail {
    margin: 4px 0;
    line-height: 1.5;
  }
`;

const MyListingsPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [listings, setListings] = useState<any[]>([]);
  const [evaluatingId, setEvaluatingId] = useState<number | null>(null);
  const [aiResults, setAiResults] = useState<Record<number, ListingEvaluation>>({});
  
  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login?redirect=/my-listings');
  }
  
  // Load listings from localStorage on component mount
  useEffect(() => {
    const storedListings = localStorage.getItem('materialListings');
    if (storedListings) {
      const parsed = JSON.parse(storedListings);
      // Check if stored data has old IDs (1-6) that overlap with marketplace — if so, reset
      const hasOldIds = parsed.some((l: any) => l.id >= 1 && l.id <= 10);
      if (hasOldIds) {
        setListings(mockListings);
        localStorage.setItem('materialListings', JSON.stringify(mockListings));
      } else {
        setListings(parsed);
      }
    } else {
      setListings(mockListings);
      localStorage.setItem('materialListings', JSON.stringify(mockListings));
    }
  }, []);
  
  // Filter listings based on status
  const filteredListings = statusFilter === 'all'
    ? listings
    : listings.filter(listing => listing.status === statusFilter);
  
  const handleCreateListing = () => {
    navigate('/create-listing');
  };
  
  const handleEditListing = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/edit-listing/${id}`);
  };
  
  const handleDeleteListing = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const listing = listings.find(item => item.id === id);
    if (listing && window.confirm(`Are you sure you want to delete "${listing.title}"? This action cannot be undone.`)) {
      const updatedListings = listings.filter(listing => listing.id !== id);
      setListings(updatedListings);
      localStorage.setItem('materialListings', JSON.stringify(updatedListings));
      alert('Listing has been deleted successfully.');
    }
  };
  
  const handleMarkAsSold = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to mark this listing as sold? This cannot be undone.')) {
      const updatedListings = listings.map(listing => 
        listing.id === id ? { ...listing, status: 'sold' } : listing
      );
      setListings(updatedListings);
      localStorage.setItem('materialListings', JSON.stringify(updatedListings));
      alert('Listing has been marked as sold.');
    }
  };

  const handleReEvaluate = async (listing: any, e: React.MouseEvent) => {
    e.stopPropagation();
    setEvaluatingId(listing.id);
    try {
      const result = await evaluateListing({
        title: listing.title,
        description: listing.description,
        category: listing.category,
        quantity: listing.quantity,
        condition: 'Good',
        contaminationLevel: 'Low',
        location: listing.location,
      });
      setAiResults(prev => ({ ...prev, [listing.id]: result }));
    } catch (err) {
      alert('AI evaluation failed. Please try again.');
    } finally {
      setEvaluatingId(null);
    }
  };

  const handleCardClick = (id: number) => {
    navigate(`/marketplace/${id}`);
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>My Material Listings</Title>
          <Subtitle>
            Manage your active, pending, and sold material listings. Create new listings or update existing ones.
          </Subtitle>
        </motion.div>
      </PageHeader>
      
      <ActionsBar>
        <FiltersContainer>
          <FilterSelect 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Listings</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
          </FilterSelect>
        </FiltersContainer>
        
        <Button onClick={handleCreateListing}>Create New Listing</Button>
      </ActionsBar>
      
      {filteredListings.length > 0 ? (
        <ListingGrid>
          {filteredListings.map((listing, index) => (
            <ListingCard 
              key={listing.id}
              status={listing.status}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => handleCardClick(listing.id)}
            >
              {listing.image && (
                <CardImage $src={listing.image} />
              )}
              <ListingHeader>
                <div>
                  <ListingTitle>{listing.title}</ListingTitle>
                  <ListingCategory>
                    {listing.category} &gt; {listing.subcategory}
                  </ListingCategory>
                </div>
                <StatusBadge status={listing.status}>
                  {listing.status}
                </StatusBadge>
              </ListingHeader>
              
              <ListingContent>
                <ListingDescription>{listing.description}</ListingDescription>
                
                <ListingDetails>
                  <DetailItem>
                    <DetailLabel>Quantity</DetailLabel>
                    <DetailValue>{listing.quantity}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Price</DetailLabel>
                    <DetailValue>{listing.price}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Location</DetailLabel>
                    <DetailValue>{listing.location}</DetailValue>
                  </DetailItem>
                  
                  <DetailItem>
                    <DetailLabel>Date Listed</DetailLabel>
                    <DetailValue>{listing.createdAt}</DetailValue>
                  </DetailItem>
                </ListingDetails>
                
                <ButtonsContainer>
                  <ActionButton 
                    variant="secondary"
                    onClick={(e) => handleEditListing(listing.id, e)}
                  >
                    Edit
                  </ActionButton>
                  
                  {listing.status === 'active' && (
                    <ActionButton 
                      variant="secondary"
                      onClick={(e) => handleMarkAsSold(listing.id, e)}
                    >
                      Mark Sold
                    </ActionButton>
                  )}
                  
                  <ActionButton 
                    variant="danger"
                    onClick={(e) => handleDeleteListing(listing.id, e)}
                  >
                    Delete
                  </ActionButton>
                </ButtonsContainer>

                {aiResults[listing.id] && (
                  <AIResultBanner
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="ai-header">🧠 Resourcify AI Evaluation</div>
                    <div className="ai-score">
                      <span>Score: {aiResults[listing.id].marketabilityScore}/100</span>
                      <div className="ai-score-bar">
                        <div 
                          className="ai-score-fill" 
                          style={{ 
                            width: `${aiResults[listing.id].marketabilityScore}%`,
                            background: aiResults[listing.id].marketabilityScore >= 70 
                              ? '#00FFA3' 
                              : aiResults[listing.id].marketabilityScore >= 40 
                                ? '#FFD700' 
                                : '#FF4444'
                          }} 
                        />
                      </div>
                    </div>
                    <div className="ai-detail">💰 Suggested Price: <span className="ai-price">{aiResults[listing.id].suggestedPrice}</span></div>
                    <div className="ai-detail">📊 Demand: {aiResults[listing.id].demandLevel}</div>
                    <div className="ai-detail">💡 {aiResults[listing.id].tips?.[0] || 'Listing looks good!'}</div>
                  </AIResultBanner>
                )}
              </ListingContent>
              
              <ListingFooter>
                <FooterItem>{listing.views} views</FooterItem>
                <FooterItem>{listing.inquiries} inquiries</FooterItem>
              </ListingFooter>
            </ListingCard>
          ))}
        </ListingGrid>
      ) : (
        <EmptyState>
          <EmptyStateTitle>No listings found</EmptyStateTitle>
          <EmptyStateText>
            {statusFilter === 'all' 
              ? "You haven't created any material listings yet. Get started by creating your first listing to showcase your circular materials."
              : `You don't have any ${statusFilter} listings at the moment.`}
          </EmptyStateText>
          <Button onClick={handleCreateListing}>Create Your First Listing</Button>
        </EmptyState>
      )}
    </PageContainer>
  );
};

export default MyListingsPage; 