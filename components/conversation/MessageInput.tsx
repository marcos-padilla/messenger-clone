'use client'
import clsx from 'clsx'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface MessageInputProps {
	id: string
	placeholder?: string
	required?: boolean
	type?: string
	register: UseFormRegister<FieldValues>
	errors: FieldErrors
}

export default function MessageInput({
	id,
	placeholder,
	type,
	required,
	register,
	errors,
}: MessageInputProps) {
	return (
		<div className='relative w-full'>
			<input
				type={type}
				id={id}
				autoComplete='off'
				{...register(id, { required })}
				placeholder={placeholder}
				className='text-black font-light py-2 px-4 bg-neutral-100 w-full rounded-full focus:outline-none'
			/>
		</div>
	)
}
