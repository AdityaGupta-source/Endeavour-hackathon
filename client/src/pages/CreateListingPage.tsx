import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { evaluateListing, ListingEvaluation } from '../services/aiService';

// Mock categories - would be fetched from API in production
const materialCategories = [
  { id: 1, name: 'Plastics', subcategories: ['PET', 'HDPE', 'PVC', 'LDPE', 'PP', 'PS', 'Other'] },
  { id: 2, name: 'Metals', subcategories: ['Aluminum', 'Steel', 'Copper', 'Brass', 'Iron', 'Other'] },
  { id: 3, name: 'Paper & Pulp', subcategories: ['Cardboard', 'Office Paper', 'Newspaper', 'Magazines', 'Wood Pulp', 'Other'] },
  { id: 4, name: 'Textiles', subcategories: ['Cotton', 'Polyester', 'Wool', 'Nylon', 'Other'] },
  { id: 5, name: 'Glass', subcategories: ['Clear', 'Green', 'Brown', 'Other'] },
  { id: 6, name: 'Organics', subcategories: ['Food Waste', 'Agricultural Waste', 'Other'] },
  { id: 7, name: 'Construction', subcategories: ['Concrete', 'Wood', 'Masonry', 'Metal', 'Other'] },
  { id: 8, name: 'Electronics', subcategories: ['PCBs', 'Batteries', 'Displays', 'Precious Metals', 'Other'] }
];

const PageContainer = styled.div`
  max-width: 1000px;
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

const FormContainer = styled(motion.div)`
  background: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  overflow: hidden;
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const FormSection = styled.div`
  padding: 2rem;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  &:last-child {
    border-bottom: none;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const FormGroup = styled.div<{ $span?: number }>`
  flex: ${({ $span }) => $span || 1};
  display: flex;
  flex-direction: column;
`;

const FormLabel = styled.label`
  font-size: 0.9rem;
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: 0.5rem;
`;

const FormInput = styled.input`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.default};
  resize: vertical;
  min-height: 120px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FormSelect = styled.select`
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: ${({ theme }) => theme.colors.background.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary.main};
  }
`;

const FormHint = styled.p`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: 0.25rem;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
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

const BackButton = styled(Link)`
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.text.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeights.medium};
  font-size: 1rem;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.background.default};
  }
`;

const ErrorMessage = styled.div`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.9rem;
  margin-top: 0.5rem;
`;

// AI Evaluation Styles
const glowPulse = keyframes`
  0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 163, 0.3); }
  50% { box-shadow: 0 0 25px rgba(0, 255, 163, 0.6); }
`;

const shimmer = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const AIButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #00FFA3, #00F0FF);
  color: #0A0F16;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${glowPulse} 2s ease-in-out infinite;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 30px rgba(0, 255, 163, 0.5);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    animation: none;
  }
`;

const AILoadingBar = styled.div`
  height: 3px;
  background: linear-gradient(90deg, transparent, #00FFA3, #00F0FF, transparent);
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s linear infinite;
  border-radius: 2px;
  margin: 1rem 0;
`;

const AIResultsPanel = styled(motion.div)`
  background: linear-gradient(135deg, #0D1117 0%, #131C28 100%);
  border: 1px solid #1E2D3D;
  border-radius: 16px;
  padding: 2rem;
  margin-top: 1.5rem;
  box-shadow: 0 0 30px rgba(0, 255, 163, 0.1);
`;

const AIResultsHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #1E2D3D;
`;

const AIIcon = styled.span`
  font-size: 28px;
`;

const AIResultsTitle = styled.h3`
  font-size: 1.3rem;
  color: #00FFA3;
  margin: 0;
`;

const ScoreContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 1rem;
  background: #0A0F16;
  border-radius: 12px;
  border: 1px solid #1E2D3D;
`;

const ScoreCircle = styled.div<{ $score: number }>`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 800;
  color: #0A0F16;
  background: ${({ $score }) => 
    $score >= 8 ? 'linear-gradient(135deg, #00FFA3, #00C882)' :
    $score >= 5 ? 'linear-gradient(135deg, #FFD700, #FFA000)' :
    'linear-gradient(135deg, #FF3366, #FF1744)'};
  flex-shrink: 0;
  box-shadow: ${({ $score }) => 
    $score >= 8 ? '0 0 20px rgba(0, 255, 163, 0.4)' :
    $score >= 5 ? '0 0 20px rgba(255, 215, 0, 0.4)' :
    '0 0 20px rgba(255, 51, 102, 0.4)'};
`;

const ScoreDetails = styled.div`
  flex: 1;
`;

const ScoreLabel = styled.div`
  font-size: 0.85rem;
  color: #A0AEC0;
  margin-bottom: 4px;
`;

const ScoreValue = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: #FFFFFF;
`;

const ResultSection = styled.div`
  margin-bottom: 1.5rem;
`;

const ResultSectionTitle = styled.h4`
  font-size: 1rem;
  color: #00F0FF;
  margin-bottom: 0.75rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuggestionList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SuggestionItem = styled.li`
  padding: 10px 14px;
  background: #0A0F16;
  border-radius: 8px;
  border-left: 3px solid #00FFA3;
  color: #E2E8F0;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const BuyerCard = styled.div`
  padding: 14px;
  background: #0A0F16;
  border-radius: 12px;
  border: 1px solid #1E2D3D;
  margin-bottom: 10px;
  transition: all 0.2s;

  &:hover {
    border-color: #00FFA3;
    box-shadow: 0 0 12px rgba(0, 255, 163, 0.15);
  }
`;

const BuyerName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  color: #FFFFFF;
  margin-bottom: 4px;
`;

const BuyerIndustry = styled.span`
  display: inline-block;
  padding: 2px 10px;
  background: rgba(0, 240, 255, 0.15);
  color: #00F0FF;
  border-radius: 20px;
  font-size: 0.75rem;
  margin-bottom: 6px;
`;

const BuyerReason = styled.div`
  font-size: 0.85rem;
  color: #A0AEC0;
  line-height: 1.4;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const InfoCard = styled.div`
  padding: 14px;
  background: #0A0F16;
  border-radius: 10px;
  border: 1px solid #1E2D3D;
`;

const InfoLabel = styled.div`
  font-size: 0.75rem;
  color: #A0AEC0;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
`;

const InfoValue = styled.div`
  font-size: 0.95rem;
  color: #FFFFFF;
  line-height: 1.4;
`;

const DemandBadge = styled.span<{ $level: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  background: ${({ $level }) =>
    $level === 'Very High' || $level === 'High' ? 'rgba(0, 255, 163, 0.15)' :
    $level === 'Medium' ? 'rgba(255, 215, 0, 0.15)' :
    'rgba(255, 51, 102, 0.15)'};
  color: ${({ $level }) =>
    $level === 'Very High' || $level === 'High' ? '#00FFA3' :
    $level === 'Medium' ? '#FFD700' :
    '#FF3366'};
`;

const CreateListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [category, setCategory] = useState('');
  const [subcategories, setSubcategories] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if not logged in
  if (!isLoggedIn) {
    navigate('/login?redirect=/create-listing');
  }
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subcategory: '',
    quantity: '',
    unit: 'kg',
    price: '',
    priceUnit: 'per kg',
    location: '',
    images: [] as File[],
    certification: '',
    availabilityDate: '',
    condition: 'clean',
    contaminationLevel: 'low',
    verificationLevel: 'self-declared'
  });
  const [aiResult, setAiResult] = useState<ListingEvaluation | null>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    
    // Find subcategories for the selected category
    const categoryObj = materialCategories.find(cat => cat.name === selectedCategory);
    if (categoryObj) {
      setSubcategories(categoryObj.subcategories);
      setFormData({
        ...formData,
        category: selectedCategory,
        subcategory: ''
      });
    } else {
      setSubcategories([]);
    }
  };
  
  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.category || 
        !formData.subcategory || !formData.quantity || !formData.price || !formData.location) {
      setError('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      // Generate a Material Passport ID
      const passportId = `MPID-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

      // Create a new listing object
      const newListing = {
        id: Date.now(), // Use timestamp as unique ID
        passportId,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subcategory: formData.subcategory,
        condition: formData.condition,
        contaminationLevel: formData.contaminationLevel,
        verificationLevel: formData.verificationLevel,
        quantity: `${formData.quantity} ${formData.unit}`,
        price: `€${formData.price} ${formData.priceUnit}`,
        location: formData.location,
        createdAt: new Date().toISOString().split('T')[0],
        status: 'active',
        views: 0,
        inquiries: 0,
        certification: formData.certification,
        availabilityDate: formData.availabilityDate
      };
      
      // Get existing listings from localStorage or initialize empty array
      const existingListings = JSON.parse(localStorage.getItem('materialListings') || '[]');
      
      // Add new listing
      const updatedListings = [...existingListings, newListing];
      
      // Save to localStorage
      localStorage.setItem('materialListings', JSON.stringify(updatedListings));
      
      // Simulate a network delay
      setTimeout(() => {
        setIsSubmitting(false);
        alert('Listing created successfully!');
        navigate('/my-listings');
      }, 1000);
    } catch (err) {
      setIsSubmitting(false);
      setError('Failed to create listing. Please try again.');
    }
  };
  
  return (
    <PageContainer>
      <PageHeader>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title>Create New Listing</Title>
          <Subtitle>
            List your circular materials and connect with potential buyers. Provide detailed information to increase visibility and interest.
          </Subtitle>
        </motion.div>
      </PageHeader>
      
      <FormContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit}>
          <FormSection>
            <SectionTitle>Basic Information</SectionTitle>
            <FormRow>
              <FormGroup $span={2}>
                <FormLabel htmlFor="title">Listing Title*</FormLabel>
                <FormInput
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="E.g., Recycled PET Flakes, Clean Grade"
                  required
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="description">Description*</FormLabel>
                <FormTextarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your material, its quality, source, and potential applications"
                  required
                />
                <FormHint>Detailed descriptions attract more serious buyers</FormHint>
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="category">Category*</FormLabel>
                <FormSelect
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  required
                >
                  <option value="">Select Category</option>
                  {materialCategories.map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </FormSelect>
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="subcategory">Subcategory*</FormLabel>
                <FormSelect
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  disabled={!category}
                  required
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map(subcat => (
                    <option key={subcat} value={subcat}>{subcat}</option>
                  ))}
                </FormSelect>
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Quantity & Pricing</SectionTitle>
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="quantity">Quantity*</FormLabel>
                <FormInput
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="E.g., 5000"
                  min="1"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="unit">Unit</FormLabel>
                <FormSelect
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                >
                  <option value="kg">Kilograms (kg)</option>
                  <option value="ton">Metric Tons (ton)</option>
                  <option value="lb">Pounds (lb)</option>
                  <option value="m3">Cubic Meters (m³)</option>
                  <option value="piece">Pieces</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="price">Price*</FormLabel>
                <FormInput
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="E.g., 1.25"
                  step="0.01"
                  min="0"
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="priceUnit">Price Unit</FormLabel>
                <FormSelect
                  id="priceUnit"
                  name="priceUnit"
                  value={formData.priceUnit}
                  onChange={handleChange}
                >
                  <option value="per kg">per kg</option>
                  <option value="per ton">per ton</option>
                  <option value="per lb">per lb</option>
                  <option value="per m3">per m³</option>
                  <option value="per piece">per piece</option>
                  <option value="total">total (for entire quantity)</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Location & Availability</SectionTitle>
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="location">Location*</FormLabel>
                <FormInput
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="E.g., Hamburg, Germany"
                  required
                />
                <FormHint>City and country where the material is located</FormHint>
              </FormGroup>
              
              <FormGroup>
                <FormLabel htmlFor="availabilityDate">Available From</FormLabel>
                <FormInput
                  type="date"
                  id="availabilityDate"
                  name="availabilityDate"
                  value={formData.availabilityDate}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="certification">Certification (if any)</FormLabel>
                <FormInput
                  type="text"
                  id="certification"
                  name="certification"
                  value={formData.certification}
                  onChange={handleChange}
                  placeholder="E.g., ISO 14001, GRS, Cradle to Cradle"
                />
              </FormGroup>

            </FormRow>
          </FormSection>
          
          <FormSection>
            <SectionTitle>Condition & Verification</SectionTitle>
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="condition">Material Condition*</FormLabel>
                <FormSelect
                  id="condition"
                  name="condition"
                  value={formData.condition}
                  onChange={handleChange}
                  required
                >
                  <option value="clean">Clean / Processed</option>
                  <option value="mixed">Mixed / Unsorted</option>
                  <option value="baled">Baled / Compressed</option>
                  <option value="raw">Raw / Unprocessed</option>
                </FormSelect>
              </FormGroup>
              <FormGroup>
                <FormLabel htmlFor="contaminationLevel">Contamination Level*</FormLabel>
                <FormSelect
                  id="contaminationLevel"
                  name="contaminationLevel"
                  value={formData.contaminationLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="none">None (0%)</option>
                  <option value="low">Low (&lt; 5%)</option>
                  <option value="medium">Medium (5-15%)</option>
                  <option value="high">High (&gt; 15%)</option>
                </FormSelect>
              </FormGroup>
            </FormRow>
            <FormRow>
              <FormGroup>
                <FormLabel htmlFor="verificationLevel">Initial Verification Level*</FormLabel>
                <FormSelect
                  id="verificationLevel"
                  name="verificationLevel"
                  value={formData.verificationLevel}
                  onChange={handleChange}
                  required
                >
                  <option value="self-declared">Self-declared</option>
                  <option value="photo-verified">Photo verified</option>
                  <option value="document-verified">Document verified</option>
                </FormSelect>
                <FormHint>Higher verification levels attract more buyers. You can upgrade this later via Third-party verification.</FormHint>
              </FormGroup>
            </FormRow>
          </FormSection>
          
          {error && <FormSection>
            <ErrorMessage>{error}</ErrorMessage>
          </FormSection>}
          
          <FormSection>
            <ButtonsContainer>
              <BackButton to="/my-listings">Cancel</BackButton>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <AIButton
                  type="button"
                  onClick={async () => {
                    if (!formData.title || !formData.category) {
                      setError('Please fill in at least a title and category before evaluating.');
                      return;
                    }
                    setIsEvaluating(true);
                    setError('');
                    setAiResult(null);
                    try {
                      const result = await evaluateListing(formData);
                      setAiResult(result);
                    } catch (err) {
                      setError('AI evaluation failed. Please try again.');
                    } finally {
                      setIsEvaluating(false);
                    }
                  }}
                  disabled={isEvaluating}
                >
                  🤖 {isEvaluating ? 'Analyzing...' : 'Evaluate with AI'}
                </AIButton>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Listing'}
                </Button>
              </div>
            </ButtonsContainer>

            {isEvaluating && <AILoadingBar />}

            <AnimatePresence>
              {aiResult && (
                <AIResultsPanel
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.4 }}
                >
                  <AIResultsHeader>
                    <AIIcon>🧠</AIIcon>
                    <AIResultsTitle>ReValue AI Analysis</AIResultsTitle>
                  </AIResultsHeader>

                  <ScoreContainer>
                    <ScoreCircle $score={aiResult.score}>{aiResult.score}/10</ScoreCircle>
                    <ScoreDetails>
                      <ScoreLabel>Expected Market Price</ScoreLabel>
                      <ScoreValue>{aiResult.expectedPrice}</ScoreValue>
                      <div style={{ marginTop: '8px' }}>
                        <ScoreLabel>Demand Level</ScoreLabel>
                        <DemandBadge $level={aiResult.demandLevel}>{aiResult.demandLevel}</DemandBadge>
                      </div>
                    </ScoreDetails>
                  </ScoreContainer>

                  <InfoGrid>
                    <InfoCard>
                      <InfoLabel>⚠️ Safety</InfoLabel>
                      <InfoValue>{aiResult.safetyCheck}</InfoValue>
                    </InfoCard>
                    <InfoCard>
                      <InfoLabel>📋 Legal / Regulatory</InfoLabel>
                      <InfoValue>{aiResult.legalCheck}</InfoValue>
                    </InfoCard>
                    <InfoCard style={{ gridColumn: '1 / -1' }}>
                      <InfoLabel>🚚 Logistics Feasibility</InfoLabel>
                      <InfoValue>{aiResult.feasibilityNotes}</InfoValue>
                    </InfoCard>
                  </InfoGrid>

                  <ResultSection>
                    <ResultSectionTitle>💡 Suggestions to Improve</ResultSectionTitle>
                    <SuggestionList>
                      {aiResult.suggestions.map((s, i) => (
                        <SuggestionItem key={i}>{s}</SuggestionItem>
                      ))}
                    </SuggestionList>
                  </ResultSection>

                  <ResultSection>
                    <ResultSectionTitle>🏢 Potential Buyer Companies</ResultSectionTitle>
                    {aiResult.potentialBuyers.map((buyer, i) => (
                      <BuyerCard key={i}>
                        <BuyerName>{buyer.name}</BuyerName>
                        <BuyerIndustry>{buyer.industry}</BuyerIndustry>
                        <BuyerReason>{buyer.reason}</BuyerReason>
                      </BuyerCard>
                    ))}
                  </ResultSection>
                </AIResultsPanel>
              )}
            </AnimatePresence>
          </FormSection>
        </form>
      </FormContainer>
    </PageContainer>
  );
};

export default CreateListingPage; 