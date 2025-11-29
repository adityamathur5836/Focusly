import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, error, id, name, disabled = false }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input
        id={id}
        name={name}
        type={type}
        className={`px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 transition-all duration-200 ${
          error
            ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
            : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-200'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
