
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface RouteGuardProps {
  paramName: string; // Назва параметру URL, який потрібно перевірити
  defaultPath: string; // Шлях для перенаправлення у випадку помилки
  validation?: (param: string) => boolean; // Функція перевірки параметру
  children: React.ReactNode;
}

export const RouteGuard = ({ 
  paramName, 
  defaultPath, 
  validation = (param) => !!param && !isNaN(Number(param)), 
  children 
}: RouteGuardProps) => {
  const params = useParams();
  const navigate = useNavigate();
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    const param = params[paramName];
    
    if (!param || !validation(param)) {
      navigate(defaultPath, { replace: true });
      return;
    }
    
    setIsValid(true);
  }, [params, paramName, defaultPath, validation, navigate]);

  if (isValid === null) {
    return <div className="container mx-auto py-8 text-center">Перевірка параметрів...</div>;
  }

  return <>{children}</>;
};
