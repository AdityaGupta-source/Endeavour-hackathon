import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useChatContext } from '../contexts/ChatContext';
import { evaluateListing, ListingEvaluation } from '../services/aiService';

// Mock data for materials - Replace with API call in production
const mockMaterialsDB: Record<number, any> = {
  1: {
    id: 1,
    name: 'Recycled Plastic Pellets',
    category: 'Plastics',
    subcategory: 'HDPE',
    quantity: '500 kg',
    minOrderQuantity: '50 kg',
    location: 'Mumbai, Maharashtra',
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
      name: 'EcoPlastics India Pvt Ltd',
      location: 'Mumbai, Maharashtra',
      rating: 4.8,
      verified: true
    },
    sustainability: {
      carbonFootprint: '70% reduction compared to virgin material',
      certifications: ['GRS Certified', 'ISO 14001'],
      recycledContent: '100%'
    },
    availableFrom: '2025-09-01',
    availableUntil: '2026-03-31'
  },
  2: {
    id: 2,
    name: 'Wood Offcuts',
    category: 'Wood',
    subcategory: 'Pine',
    quantity: '200 kg',
    minOrderQuantity: '25 kg',
    location: 'Dehradun, Uttarakhand',
    price: '₹40/kg',
    image: 'https://images.pexels.com/photos/129733/pexels-photo-129733.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Clean pine offcuts sourced from furniture manufacturing units. Ideal for particleboard production, biomass energy, or artisanal woodworking. All pieces are untreated and free from chemical coatings.',
    specifications: [
      { name: 'Wood Type', value: 'Pine (Pinus roxburghii)' },
      { name: 'Moisture Content', value: '12-15%' },
      { name: 'Average Piece Size', value: '15-40 cm length' },
      { name: 'Treatment', value: 'Untreated / Chemical-free' },
      { name: 'Suitable For', value: 'Particleboard, Biomass, Crafts' }
    ],
    seller: {
      id: 102,
      name: 'GreenWood Solutions',
      location: 'Dehradun, Uttarakhand',
      rating: 4.5,
      verified: true
    },
    sustainability: {
      carbonFootprint: '85% reduction vs new timber harvesting',
      certifications: ['FSC Recycled', 'ISO 14001'],
      recycledContent: '100%'
    },
    availableFrom: '2025-10-01',
    availableUntil: '2026-06-30'
  },
  3: {
    id: 3,
    name: 'Aluminum Scrap',
    category: 'Metals',
    subcategory: 'Aluminum',
    quantity: '300 kg',
    minOrderQuantity: '30 kg',
    location: 'Jamnagar, Gujarat',
    price: '₹150/kg',
    image: 'https://images.pexels.com/photos/2881224/pexels-photo-2881224.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Clean aluminum scrap primarily from extrusion offcuts and manufacturing waste. Pre-sorted and free from heavy contamination. Suitable for secondary smelting and re-extrusion into new profiles.',
    specifications: [
      { name: 'Alloy Grade', value: '6061 / 6063 Mix' },
      { name: 'Form', value: 'Extrusion offcuts & sheet trim' },
      { name: 'Purity', value: '95-98% Aluminum' },
      { name: 'Contamination', value: 'Minimal paint residue (<2%)' },
      { name: 'Processing Method', value: 'Smelting, Re-extrusion' }
    ],
    seller: {
      id: 103,
      name: 'MetalWorks India Ltd',
      location: 'Jamnagar, Gujarat',
      rating: 4.9,
      verified: true
    },
    sustainability: {
      carbonFootprint: '92% reduction vs virgin aluminum production',
      certifications: ['R2 Certified', 'ISO 9001', 'ISO 14001'],
      recycledContent: '100%'
    },
    availableFrom: '2025-08-15',
    availableUntil: '2026-02-28'
  },
  4: {
    id: 4,
    name: 'Cotton Fabric Remnants',
    category: 'Textiles',
    subcategory: 'Cotton',
    quantity: '150 kg',
    minOrderQuantity: '20 kg',
    location: 'Tirupur, Tamil Nadu',
    price: '₹200/kg',
    image: 'https://images.pexels.com/photos/6869030/pexels-photo-6869030.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Premium organic cotton remnants from garment manufacturing. Pre-sorted by color (white, pastel, dark). Perfect for industrial wiping cloths, recycled yarn production, or stuffing material.',
    specifications: [
      { name: 'Fiber Composition', value: '100% Organic Cotton' },
      { name: 'Color Groups', value: 'White (40%), Pastels (35%), Darks (25%)' },
      { name: 'Average Piece Size', value: '20x20 cm to 60x80 cm' },
      { name: 'Weave Type', value: 'Jersey knit & Woven mix' },
      { name: 'Suitable For', value: 'Recycled yarn, Wiping cloths, Stuffing' }
    ],
    seller: {
      id: 104,
      name: 'FabricCycle Textiles',
      location: 'Tirupur, Tamil Nadu',
      rating: 4.6,
      verified: true
    },
    sustainability: {
      carbonFootprint: '60% reduction vs virgin cotton farming',
      certifications: ['GOTS Certified', 'OEKO-TEX Standard 100'],
      recycledContent: '100%'
    },
    availableFrom: '2025-07-01',
    availableUntil: '2026-01-31'
  },
  5: {
    id: 5,
    name: 'Glass Cullet',
    category: 'Glass',
    subcategory: 'Mixed Color',
    quantity: '1000 kg',
    minOrderQuantity: '100 kg',
    location: 'Firozabad, Uttar Pradesh',
    price: '₹25/kg',
    image: 'https://images.pexels.com/photos/4255811/pexels-photo-4255811.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Mixed color glass cullet crushed and cleaned from post-consumer bottle and container collection. Suitable for glass manufacturing, fiberglass insulation, or decorative aggregate. Thoroughly washed and metal-free.',
    specifications: [
      { name: 'Glass Type', value: 'Soda-lime (container glass)' },
      { name: 'Color Mix', value: 'Clear (50%), Green (30%), Amber (20%)' },
      { name: 'Particle Size', value: '5-25 mm crushed' },
      { name: 'Contamination', value: '<0.5% (metal-free, label-free)' },
      { name: 'Suitable For', value: 'Re-melting, Fiberglass, Aggregate' }
    ],
    seller: {
      id: 105,
      name: 'ClearGlass Recyclers',
      location: 'Firozabad, Uttar Pradesh',
      rating: 4.3,
      verified: false
    },
    sustainability: {
      carbonFootprint: '30% reduction vs virgin glass production',
      certifications: ['ISO 14001'],
      recycledContent: '100%'
    },
    availableFrom: '2025-06-01',
    availableUntil: '2026-05-31'
  },
  6: {
    id: 6,
    name: 'Paper Pulp',
    category: 'Paper',
    subcategory: 'Mixed Pulp',
    quantity: '750 kg',
    minOrderQuantity: '75 kg',
    location: 'Saharanpur, Uttar Pradesh',
    price: '₹35/kg',
    image: 'https://images.pexels.com/photos/5864250/pexels-photo-5864250.jpeg?auto=compress&cs=tinysrgb&w=1200',
    description: 'Recycled paper pulp produced from sorted post-consumer office paper and cardboard. De-inked and processed into a clean slurry. Suitable for manufacturing tissue paper, packaging board, and egg trays.',
    specifications: [
      { name: 'Pulp Type', value: 'De-inked recycled pulp (DIP)' },
      { name: 'Brightness', value: '72-78% ISO' },
      { name: 'Freeness (CSF)', value: '350-450 ml' },
      { name: 'Ash Content', value: '<8%' },
      { name: 'Suitable For', value: 'Tissue, Packaging board, Egg trays' }
    ],
    seller: {
      id: 106,
      name: 'PaperLoop Industries',
      location: 'Saharanpur, Uttar Pradesh',
      rating: 4.4,
      verified: true
    },
    sustainability: {
      carbonFootprint: '40% reduction vs virgin wood pulp',
      certifications: ['FSC Recycled', 'EPA Compliant'],
      recycledContent: '100%'
    },
    availableFrom: '2025-11-01',
    availableUntil: '2026-04-30'
  }
};

// Fallback for unknown IDs
const getMockMaterial = (id: number) => {
  return mockMaterialsDB[id] || {
    ...mockMaterialsDB[1],
    id,
    name: `Material #${id}`,
  };
};

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

const ReEvalSection = styled.div`
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const ReEvalButton = styled.button`
  width: 100%;
  padding: 0.85rem 1.5rem;
  background: linear-gradient(135deg, rgba(0, 255, 163, 0.15), rgba(0, 200, 130, 0.1));
  color: #00FFA3;
  border: 1px solid rgba(0, 255, 163, 0.3);
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(0, 255, 163, 0.25), rgba(0, 200, 130, 0.2));
    box-shadow: 0 0 20px rgba(0, 255, 163, 0.15);
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ReEvalResults = styled(motion.div)`
  margin-top: 1rem;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(0, 255, 163, 0.06), rgba(0, 200, 130, 0.03));
  border: 1px solid rgba(0, 255, 163, 0.15);
  border-radius: 12px;
`;

const ReEvalHeader = styled.div`
  font-weight: 700;
  color: #00FFA3;
  font-size: 1rem;
  margin-bottom: 12px;
`;

const ReEvalScoreRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 0.9rem;
  color: #A0AEC0;
`;

const ReEvalScoreValue = styled.span`
  font-weight: 700;
  color: #E2E8F0;
  font-size: 1.1rem;
`;

const ReEvalBar = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 14px;
`;

const ReEvalBarFill = styled.div`
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
`;

const ReEvalDetail = styled.div`
  font-size: 0.9rem;
  color: #CBD5E0;
  margin: 5px 0;
  line-height: 1.6;
`;

const MaterialDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const materialId = parseInt(id || '1');
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const { setPageContext } = useChatContext();
  const [material, setMaterial] = useState(getMockMaterial(materialId));
  const [isOrdering, setIsOrdering] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const [auditRequested, setAuditRequested] = useState(false);
  const [isProcessingAudit, setIsProcessingAudit] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [aiEvaluation, setAiEvaluation] = useState<ListingEvaluation | null>(null);

  // Check marketplace mock DB first, then fall back to localStorage for user's own listings
  useEffect(() => {
    // Priority 1: Marketplace mock data (has rich detail)
    if (mockMaterialsDB[materialId]) {
      setMaterial(mockMaterialsDB[materialId]);
      return;
    }

    // Priority 2: User's own listings from localStorage
    const storedListings = localStorage.getItem('materialListings');
    if (storedListings) {
      const userListings = JSON.parse(storedListings);
      const found = userListings.find((l: any) => l.id === materialId);
      if (found) {
        setMaterial({
          id: found.id,
          name: found.title || found.name,
          category: found.category || 'General',
          subcategory: found.subcategory || found.category || 'Mixed',
          quantity: found.quantity || 'N/A',
          minOrderQuantity: found.minOrderQuantity || '10 kg',
          location: found.location || 'India',
          price: found.price || 'Contact for price',
          image: found.image || '',
          description: found.description || 'No description provided.',
          specifications: found.specifications || [
            { name: 'Category', value: found.category || 'General' },
            { name: 'Subcategory', value: found.subcategory || 'Mixed' },
            { name: 'Condition', value: found.condition || 'Good' },
            { name: 'Contamination', value: found.contaminationLevel || 'Low' },
            { name: 'Listed On', value: found.createdAt || 'N/A' }
          ],
          seller: found.seller || {
            id: 100,
            name: 'You (My Listing)',
            location: found.location || 'India',
            rating: 5.0,
            verified: true
          },
          sustainability: found.sustainability || {
            carbonFootprint: 'Reduced vs virgin material',
            certifications: ['Self-Declared'],
            recycledContent: '100%'
          },
          availableFrom: found.createdAt || '2025-01-01',
          availableUntil: '2026-12-31'
        });
        return;
      }
    }

    // Fallback
    setMaterial(getMockMaterial(materialId));
  }, [materialId]);

  // Set chat context so the chatbot knows what material the user is viewing
  useEffect(() => {
    setPageContext({
      pageName: 'Material Detail',
      pageType: 'material-detail',
      title: material.name,
      details: `Material: ${material.name}\nCategory: ${material.category} (${material.subcategory})\nPrice: ${material.price}\nQuantity Available: ${material.quantity}\nMin Order: ${material.minOrderQuantity}\nLocation: ${material.seller.location}\nSeller: ${material.seller.name} (Rating: ${material.seller.rating}/5, ${material.seller.verified ? 'Verified' : 'Unverified'})\nCondition: ${material.description}\nSpecifications: ${material.specifications.map(s => s.name + ': ' + s.value).join(', ')}\nSustainability: ${material.sustainability.carbonFootprint}, Recycled Content: ${material.sustainability.recycledContent}, Certifications: ${material.sustainability.certifications.join(', ')}`,
    });
  }, [material, setPageContext]);
  
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
      alert('Physical Audit requested! A Resourcify certified expert will be dispatched within 48 hours to verify this material.');
    }, 1500);
  };

  const handleReEvaluate = async () => {
    setIsEvaluating(true);
    try {
      const result = await evaluateListing({
        title: material.name,
        description: material.description,
        category: material.category,
        quantity: material.quantity,
        condition: 'Good',
        contaminationLevel: 'Low',
        location: material.location,
      });
      setAiEvaluation(result);
    } catch (err) {
      alert('AI evaluation failed. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
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
          <AiHeader>🧠 Resourcify AI Recommendations</AiHeader>
          
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
            <AuditTitle>🛡️ Resourcify Certified Physical Audit</AuditTitle>
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