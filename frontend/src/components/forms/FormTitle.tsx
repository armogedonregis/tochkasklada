'use client';

import React from 'react';

interface FormTitleProps {
  label: string;
  className?: string;
}

const FormTitle: React.FC<FormTitleProps> = ({
  label,
  className = ''
}) => {
  return (
    <h4 className={`text-gray-900 dark:text-white font-bold text-base ${className}`}>
      {label}
    </h4>
  );
};

export default FormTitle; 