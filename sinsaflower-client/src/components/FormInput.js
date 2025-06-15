import React from 'react';

/**
 * 재사용 가능한 폼 입력 컴포넌트
 * @param {string} label - 입력 필드 라벨
 * @param {string} name - 입력 필드 name 속성
 * @param {string} type - 입력 타입 (text, email, password, etc.)
 * @param {string} value - 입력 값
 * @param {Function} onChange - 값 변경 핸들러
 * @param {Function} onBlur - 블러 핸들러
 * @param {string} error - 에러 메시지
 * @param {boolean} touched - 터치 여부
 * @param {boolean} required - 필수 여부
 * @param {string} placeholder - 플레이스홀더
 * @param {boolean} disabled - 비활성화 여부
 * @param {string} className - 추가 CSS 클래스
 */
const FormInput = ({
  label,
  name,
  type = 'text',
  value = '',
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className={`block text-sm font-medium mb-2 ${
            required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''
          }`}
        >
          {label}
        </label>
      )}
      
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${hasError 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 bg-white'
          }
          ${disabled 
            ? 'bg-gray-100 cursor-not-allowed' 
            : 'hover:border-gray-400'
          }
        `}
        {...props}
      />
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * 텍스트 영역 컴포넌트
 */
export const FormTextarea = ({
  label,
  name,
  value = '',
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  rows = 3,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className={`block text-sm font-medium mb-2 ${
            required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''
          }`}
        >
          {label}
        </label>
      )}
      
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-vertical
          ${hasError 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 bg-white'
          }
          ${disabled 
            ? 'bg-gray-100 cursor-not-allowed' 
            : 'hover:border-gray-400'
          }
        `}
        {...props}
      />
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * 셀렉트 컴포넌트
 */
export const FormSelect = ({
  label,
  name,
  value = '',
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  options = [],
  placeholder,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={name}
          className={`block text-sm font-medium mb-2 ${
            required ? "after:content-['*'] after:ml-0.5 after:text-red-500" : ''
          }`}
        >
          {label}
        </label>
      )}
      
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        className={`
          w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
          ${hasError 
            ? 'border-red-500 bg-red-50' 
            : 'border-gray-300 bg-white'
          }
          ${disabled 
            ? 'bg-gray-100 cursor-not-allowed' 
            : 'hover:border-gray-400'
          }
        `}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option 
            key={option.value} 
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

/**
 * 체크박스 컴포넌트
 */
export const FormCheckbox = ({
  label,
  name,
  checked = false,
  onChange,
  error,
  touched,
  disabled = false,
  className = '',
  ...props
}) => {
  const hasError = touched && error;
  
  return (
    <div className={`mb-4 ${className}`}>
      <div className="flex items-center">
        <input
          id={name}
          name={name}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className={`
            h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded
            ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}
          `}
          {...props}
        />
        {label && (
          <label 
            htmlFor={name}
            className={`ml-2 block text-sm ${disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 cursor-pointer'}`}
          >
            {label}
          </label>
        )}
      </div>
      
      {hasError && (
        <p className="mt-1 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormInput; 