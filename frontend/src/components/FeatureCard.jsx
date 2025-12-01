import React from 'react';
import Card from './ui/Card';

const FeatureCard = ({ icon: Icon, title, description, iconBgColor = 'bg-purple-100', iconColor = 'text-purple-600' }) => {
  return (
    <Card className="p-6 text-center hover:shadow-lg transition-shadow">
      <div className={`w-16 h-16 ${iconBgColor} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
        <Icon className={`h-8 w-8 ${iconColor}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        {description}
      </p>
    </Card>
  );
};

export default FeatureCard;
