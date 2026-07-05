import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { registerSchema, RegisterFormData } from '../../utils/validators';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export default function RegisterForm() {
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setServerError(null);
    try {
      await registerUser(data);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Failed to create account');
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-kanban-text">Create your account</h2>
        <p className="mt-2 text-sm text-kanban-textMuted">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-kanban-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          type="text"
          placeholder="John Doe"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email address"
          type="email"
          placeholder="you@company.com"
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          helperText="Must be at least 6 characters"
          error={errors.password?.message}
          {...register('password')}
        />

        {serverError && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">{serverError}</div>
        )}

        <Button type="submit" variant="primary" size="lg" isLoading={isSubmitting} className="w-full">
          Create account
        </Button>
      </form>

      <p className="mt-4 text-xs text-kanban-textMuted text-center">
        By signing up, you agree to our{' '}
        <a href="#" className="text-kanban-primary hover:underline">
          Terms of Service
        </a>{' '}
        and{' '}
        <a href="#" className="text-kanban-primary hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </div>
  );
}