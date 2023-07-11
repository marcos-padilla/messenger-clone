import AuthProvider from '@/context/AuthProvider'
import ToasterContext from '@/context/ToasterContext'
import '@/styles/globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Messenger Clone',
	description: 'Messenger Clone',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='en'>
			<body>
				<AuthProvider>
					<ToasterContext />
					{children}
				</AuthProvider>
			</body>
		</html>
	)
}
