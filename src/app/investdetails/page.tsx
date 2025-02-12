'use client'

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { Property, PropertyPhoto } from '@/types/property';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import InvestLoader from '@/components/loaders/InvestLoader';

interface AirbnbListing {
  pricing: {
    price: string;
  };
}

interface SaveStatus {
  type: 'idle' | 'success' | 'error';
  message?: string;
}

interface SavedAnalysis {
  id: string;
  propertyId: string;
  airbnbRate: number;
  purchasePrice: number;
  annualRevenue: number;
  roi: number;
  monthlyRevenue: number;
  propertyDetails: {
    address: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    images: string[];
  };
  createdAt: string;
}

export default function InvestDetails() {
  const { user, isAuthenticated } = useUser();
  const router = useRouter();
  const [listing, setListing] = useState<AirbnbListing | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>({ type: 'idle' });
  const [isViewingMode, setIsViewingMode] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    const loadingTimer = setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      const mode = searchParams.get('mode');

      if (mode === 'view') {
        setIsViewingMode(true);
        const savedAnalysisData = localStorage.getItem('savedAnalysis');
        if (savedAnalysisData) {
          try {
            const savedAnalysis: SavedAnalysis = JSON.parse(savedAnalysisData);
            setProperty({
              zpid: parseInt(savedAnalysis.propertyId),
              price: savedAnalysis.purchasePrice,
              bedrooms: savedAnalysis.propertyDetails.bedrooms,
              bathrooms: savedAnalysis.propertyDetails.bathrooms,
              livingArea: savedAnalysis.propertyDetails.sqft,
              address: {
                streetAddress: savedAnalysis.propertyDetails.address,
                city: '',
                state: '',
                zipcode: '',
                neighborhood: null,
                community: null
              },
              city: '',
              state: '',
              homeStatus: '',
              streetAddress: savedAnalysis.propertyDetails.address,
              zipcode: '',
              latitude: 0,
              longitude: 0,
              homeType: '',
              yearBuilt: 0,
              priceHistory: [],
              originalPhotos: savedAnalysis.propertyDetails.images.map(url => ({
                caption: '', // Add the required caption field
                mixedSources: {
                  jpeg: [{
                    url,
                    width: 0 // Add any required fields from PhotoSource interface
                  }],
                  webp: [] // Add empty webp array if required
                }
              })) as PropertyPhoto[] // Type assertion here
            });

            setListing({
              pricing: {
                price: `$${savedAnalysis.airbnbRate}`
              }
            });
          } catch (error) {
            console.error('Error parsing saved analysis:', error);
            router.push('/saved-analyses');
          }
        }
      } else {
        const airbnbData = localStorage.getItem('selectedAirbnb');
        const propertyData = localStorage.getItem('zillowProperty');
        
        if (airbnbData && propertyData) {
          try {
            const parsedListing = JSON.parse(airbnbData);
            const parsedProperty = JSON.parse(propertyData);
            setListing(parsedListing);
            setProperty(parsedProperty);
          } catch (error) {
            console.error('Error parsing data:', error);
          }
        }
      }

      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(loadingTimer);
  }, [router]);

  const handleSave = async () => {
    if (!isAuthenticated || !user) {
      router.push('/login');
      return;
    }

    if (!property || !listing) {
      setSaveStatus({ 
        type: 'error', 
        message: 'Missing property or listing data' 
      });
      return;
    }

    setSaving(true);
    setSaveStatus({ type: 'idle' });

    try {
      const nightlyRate = parseFloat(listing.pricing.price.replace('$', ''));
      const annualRevenue = nightlyRate * 365 * 0.75;
      const roi = ((annualRevenue - (property.price * 0.1)) / property.price) * 100;

      const images = property.originalPhotos?.map(photo => photo.mixedSources.jpeg[0].url) || [];

      const analysis = {
        propertyId: property.zpid,
        airbnbRate: nightlyRate,
        purchasePrice: property.price,
        annualRevenue,
        roi,
        monthlyRevenue: nightlyRate * 30 * 0.75,
        propertyDetails: {
          address: property.address.streetAddress,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          sqft: property.livingArea,
          images
        }
      };

      const response = await fetch('/api/investment-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          analysis,
          userId: user.userId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to save analysis');
      }

      setSaveStatus({ type: 'success', message: 'Analysis saved successfully!' });
      
      setTimeout(() => {
        router.push('/saved-analyses');
      }, 1500);
    } catch (error) {
      console.error('Error saving analysis:', error);
      setSaveStatus({ 
        type: 'error', 
        message: error instanceof Error ? error.message : 'Failed to save analysis' 
      });
    } finally {
      setSaving(false);
    }
  };

  if (isLoading) {
    window.scrollTo(0, 0);
    return <InvestLoader />;
  }

  if (!listing || !property) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-white">Loading investment details...</div>
      </div>
    );
  }

  const nightlyRate = parseFloat(listing.pricing.price.replace('$', ''));
  const annualRevenue = nightlyRate * 365 * 0.75;
  const roi = ((annualRevenue - (property.price * 0.1)) / property.price) * 100;

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {isViewingMode && (
          <button
            onClick={() => router.push('/saved-analyses')}
            className="mb-6 text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Saved Analyses
          </button>
        )}

        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{property.address.streetAddress}</h1>
            <p className="text-gray-400">Purchase Price: ${property.price.toLocaleString()}</p>
          </div>
          {!isViewingMode && (
            <div className="flex items-center gap-4">
              {saveStatus.type !== 'idle' && (
                <span className={`${
                  saveStatus.type === 'success' ? 'text-green-500' : 'text-red-500'
                }`}>
                  {saveStatus.message}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className={`px-6 py-3 rounded-lg transition-all ${
                  saving 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer'
                }`}
              >
                {saving ? 'Saving...' : 'Save Analysis'}
              </button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* ROI Analysis */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">ROI Analysis</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Return on Investment</p>
                <p className="text-xl text-white">{roi.toFixed(2)}%</p>
                <p className="text-xs text-gray-500 mt-1">Based on purchase price and estimated revenue</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Purchase Price</p>
                <p className="text-xl text-white">${property.price.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Cash Flow Analysis */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Revenue Projections</h2>
            <div className="space-y-4">
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Nightly Rate</p>
                <p className="text-xl text-white">${nightlyRate}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Monthly Revenue (75% occupancy)</p>
                <p className="text-xl text-white">
                  ${Math.round(nightlyRate * 30 * 0.75).toLocaleString()}
                </p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Annual Revenue (75% occupancy)</p>
                <p className="text-xl text-white">
                  ${Math.round(annualRevenue).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Property Details with Image Gallery */}
          <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Property Details</h2>
            <div className="space-y-4">
              {/* Image Gallery */}
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400 mb-3">Property Images</p>
                <div className="relative aspect-video mb-2">
                  <Image
                    src={property.originalPhotos?.[selectedImageIndex]?.mixedSources.jpeg[0].url || '/placeholder-house.jpg'}
                    alt="Property"
                    fill
                    className="object-cover rounded"
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {property.originalPhotos?.slice(0, 4).map((photo, index) => (
                    <div 
                      key={index}
                      className={`relative aspect-square cursor-pointer ${
                        selectedImageIndex === index ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => setSelectedImageIndex(index)}
                    >
                      <Image
                        src={photo.mixedSources.jpeg[0].url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Property Info</p>
                <p className="text-white mt-1">{property.bedrooms} beds • {property.bathrooms} baths</p>
                <p className="text-white">{property.livingArea} sqft</p>
                <p className="text-white">Built in {property.yearBuilt}</p>
              </div>
              <div className="bg-gray-700/50 p-4 rounded-lg">
                <p className="text-sm text-gray-400">Location</p>
                <p className="text-white mt-1">{property.address.city}, {property.address.state}</p>
                <p className="text-white">{property.address.zipcode}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}