'use client'

import { useCallback, useState } from 'react'
import { useForm, FieldValues, SubmitHandler } from 'react-hook-form'
import Input from './inputs/Input'
import Button from './Button'
import AuthSocialButton from './AuthSocialButton'
import { BsGithub, BsGoogle } from 'react-icons/bs'
import axios from 'axios'
type Variant = 'LOGIN' | 'REGISTER'

export default function AuthForm() {
	const [variant, setVariant] = useState<Variant>('LOGIN')
	const [isLoading, setIsLoading] = useState(false)

	const toggleVariant = useCallback(() => {
		setVariant((prev) => (prev === 'LOGIN' ? 'REGISTER' : 'LOGIN'))
	}, [variant])

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
		}
		if (variant === 'LOGIN') {
		}
	}
	const socialAction = (action: string) => {
		setIsLoading(true)

		//Next Auth social sign in
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
