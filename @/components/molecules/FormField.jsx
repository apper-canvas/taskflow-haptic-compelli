import React from 'react';

const FormField = ({ label, children, className }) => {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
          {label}
        </label>
      )}
      {children}
    </div>
  );
};

export default FormField;