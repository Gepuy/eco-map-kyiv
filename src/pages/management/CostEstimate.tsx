
import React from 'react';
import { CostEstimateForm } from '@/components/management/CostEstimateForm';

const CostEstimatePage = () => {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Кошторис витрат</h1>
      
      <CostEstimateForm />
    </div>
  );
};

export default CostEstimatePage;
