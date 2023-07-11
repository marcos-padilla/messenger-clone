'use client'

import { useCallback, useEffect, useState } from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import Input from './inputs/Input'
import Button from './Button'
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
type Variant = 'LOGIN' | 'REGISTER'

export default function AuthForm() {
	const session = useSession()
	const [variant, setVariant] = useState<Variant>('LOGIN')
	const [isLoading, setIsLoading] = useState(false)
	const router = useRouter()

	useEffect(() => {
		if (session?.status === 'authenticated') {
			router.push('/users')
		}
	}, [session?.status, router])

	const toggleVariant = useCallback(() => {
		setVariant((prev) => (prev === 'LOGIN' ? 'REGISTER' : 'LOGIN'))
	}, [variant])

	const handleCallback = useCallback((callback: any) => {
		if (callback?.error) {
			toast.error('Invalid credentials!')
		}

		if (callback?.ok && !callback?.error) {
			toast.success('Logged in')
			router.push('/users')
		}
	}, [])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FieldValues>({
		defaultValues: {
			name: '',
			email: '',
			password: '',
		},
	})

	const onSubmit: SubmitHandler<FieldValues> = (data) => {
		setIsLoading(true)
		if (variant === 'REGISTER') {
			axios.post('/api/register', data)
				.then(() =>
					signIn('credentials', {
						...data,
						redirect: false,
					})
				)
				.then(handleCallback)
				.catch((e) => {
					toast.error(e.response.data)
				})
				.finally(() => {
					setIsLoading(false)
				})
		}
		if (variant === 'LOGIN') {
			signIn('credentials', {
				...data,
				redirect: false,
			})
				.then(handleCallback)
				.finally(() => {
					setIsLoading(false)
				})
		}
	}
	const socialAction = (action: string) => {
		setIsLoading(true)
		signIn(action, {
			redirect: false,
		})
			.then(handleCallback)
			.catch((e) => {
				console.log({ e })
			})
			.finally(() => setIsLoading(false))
	}

	return (
		<div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
			<div className='bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10'>
				<form
					className='space-y-6'
					onSubmit={handleSubmit(onSubmit)}
				>
					{variant === 'REGISTER' && (
						<Input
							label='Name'
							register={register}
							id='name'
							errors={errors}
						/>
					)}
					<Input
						label='Email address'
						register={register}
						id='email'
						errors={errors}
						type='email'
					/>
					<Input
						label='Password'
						register={register}
						id='password'
						errors={errors}
						type='password'
					/>
					<div>
						<Button
							fullWidth
							type='submit'
							disabled={isLoading}
						>
							{variant === 'LOGIN'
								? 'Sign in'
								: 'Register'}
						</Button>
					</div>
				</form>
				<div className='mt-6'>
					<div className='relative'>
						<div className='absolute inset-0 flex items-center'>
							<div className='w-full border-t border-gray-300' />
						</div>
						<div className='relative flex justify-center text-sm'>
							<span className='bg-white px-2 text-gray-500'>
								Or continue with
							</span>
						</div>
					</div>
					<div className='flex mt-6 gap-2 flex-col sm:flex-row'>
						<AuthSocialButton
							icon={BsGithub}
							onClick={() => socialAction('github')}
						/>
						<AuthSocialButton
							icon={BsGoogle}
							onClick={() => socialAction('google')}
						/>
					</div>
				</div>
				<div className='flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500'>
					{variant === 'LOGIN'
						? 'New to Messenger?'
						: 'Already have an account?'}
					<div
						onClick={toggleVariant}
						className='underline cursor-pointer'
					>
						{variant === 'LOGIN'
							? 'Create an account'
							: 'Sign In'}
					</div>
				</div>
			</div>
		</div>
	)
}
