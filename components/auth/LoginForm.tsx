'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

// Zod validation schema for login form
const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccess?: () => void
}

// Internal component that uses useSearchParams
function LoginFormContent({ onSuccess }: LoginFormProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Get the redirectTo parameter from URL
  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

  // Initialize form with react-hook-form and zod validation
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  // Handle form submission
  async function onSubmit(values: LoginFormValues) {
    setIsLoading(true)

    try {
      // Authenticate with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        // Handle authentication errors
        let errorMessage = error.message
        let errorDescription = 'Please check your credentials and try again.'
        
        // Provide more helpful messages for common errors
        if (error.message.includes('Email not confirmed')) {
          errorMessage = 'Email not confirmed'
          errorDescription = 'Please check your email and click the confirmation link before logging in.'
        } else if (error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid credentials'
          errorDescription = 'The email or password you entered is incorrect.'
        }
        
        toast.error(errorMessage, {
          description: errorDescription,
        })
        return
      }

      if (data.user) {
        // Success - show toast and redirect
        toast.success('Login successful', {
          description: 'Welcome back!',
        })

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }

        // Redirect to the original destination or dashboard
        router.push(redirectTo)
        router.refresh()
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Login error:', error)
      toast.error('An unexpected error occurred', {
        description: 'Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {/* Email Field */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Password Field */}
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </Form>
  )
}

// Wrapper component with Suspense boundary
export function LoginForm(props: LoginFormProps) {
  return (
    <Suspense fallback={
      <div className="space-y-4">
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 bg-gray-200 rounded animate-pulse" />
      </div>
    }>
      <LoginFormContent {...props} />
    </Suspense>
  )
}
