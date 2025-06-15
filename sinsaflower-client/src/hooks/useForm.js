import { useState, useCallback } from 'react';

/**
 * 폼 상태 관리를 위한 커스텀 훅
 * @param {Object} initialValues - 초기값
 * @param {Function} validationSchema - 유효성 검사 함수 (선택사항)
 */
export const useForm = (initialValues = {}, validationSchema = null) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 값 변경 핸들러
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    // 에러 상태가 있으면 실시간으로 검증
    if (errors[name] && validationSchema) {
      const fieldErrors = validationSchema({ ...values, [name]: newValue });
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name] || null
      }));
    }
  }, [values, errors, validationSchema]);

  // 블러 핸들러
  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    // 유효성 검사 실행
    if (validationSchema) {
      const fieldErrors = validationSchema(values);
      setErrors(prev => ({
        ...prev,
        [name]: fieldErrors[name] || null
      }));
    }
  }, [values, validationSchema]);

  // 전체 폼 유효성 검사
  const validate = useCallback(() => {
    if (!validationSchema) return true;
    
    const validationErrors = validationSchema(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validationSchema]);

  // 값 설정 (외부에서 프로그래매틱하게 설정)
  const setValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // 여러 값 설정
  const setMultipleValues = useCallback((newValues) => {
    setValues(prev => ({
      ...prev,
      ...newValues
    }));
  }, []);

  // 폼 리셋
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // 제출 핸들러
  const handleSubmit = useCallback((onSubmit) => {
    return async (e) => {
      e.preventDefault();
      setIsSubmitting(true);

      const isValid = validate();
      if (!isValid) {
        setIsSubmitting(false);
        return;
      }

      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    };
  }, [values, validate]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setMultipleValues,
    validate,
    reset
  };
};

export default useForm; 
