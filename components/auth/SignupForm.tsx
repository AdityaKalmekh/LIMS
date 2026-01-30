'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

// Zod validation schema for signup form
const signupSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email address'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(6, 'Password must be at least 6 characters'),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type SignupFormValues = z.infer<typeof signupSchema>

interface SignupFormProps {
  onSuccess?: () => void
}

export function SignupForm({ onSuccess }: SignupFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()

  // Initialize form with react-hook-form and zod validation
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  // Handle form submission
  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true)

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
      })

      if (error) {
        // Handle signup errors
        let errorMessage = 'Signup failed'
        let errorDescription = error.message
        
        // Provide more helpful messages for common errors
        if (error.message.includes('rate limit')) {
          errorMessage = 'Too many signup attempts'
          errorDescription = 'Please wait a few minutes before trying again, or ask an admin to disable email confirmation in Supabase.'
        } else if (error.message.includes('already registered')) {
          errorMessage = 'Email already registered'
          errorDescription = 'This email is already in use. Try logging in instead.'
        }
        
        toast.error(errorMessage, {
          description: errorDescription,
        })
        return
      }

      if (data.user) {
        // Check if email confirmation is required
        const needsEmailConfirmation = data.user.identities?.length === 0
        
        if (needsEmailConfirmation) {
          // Email confirmation required
          toast.success('Account created successfully', {
            description: 'Please check your email to verify your account before logging in.',
          })
          
          // Redirect to login page with a message
          router.push('/login?message=Please check your email to confirm your account')
        } else {
          // No email confirmation needed or auto-confirmed
          toast.success('Account created successfully', {
            description: 'You can now log in with your credentials.',
          })
          
          // Redirect to login page
          router.push('/login')
        }

        // Call onSuccess callback if provided
        if (onSuccess) {
          onSuccess()
        }

        router.refresh()
      }
    } catch (error) {
      // Handle unexpected errors
      console.error('Signup error:', error)
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

        {/* Confirm Password Field */}
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Confirm your password"
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
          {isLoading ? 'Creating account...' : 'Sign Up'}
        </Button>
      </form>
    </Form>
  )
}
