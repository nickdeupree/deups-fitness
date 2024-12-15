'use client';

import React, {useState, useEffect} from 'react';
import {Button, Input, Card, Spacer} from '@nextui-org/react';
import {useRouter} from 'next/navigation';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import { useTheme } from 'next-themes';
import { auth } from '../lib/firebaseClient';
import { signInWithEmailAndPassword } from 'firebase/auth';

const SigninPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [mounted, setMounted] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const router = useRouter();
    const { theme } = useTheme();

    useEffect(() => {
        setMounted(true);  
    }, []);

    const toggleVisibility = () => {
        setIsVisible(prev => !prev);
    };

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);
      
        try {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          console.log(userCredential.user);
          router.push("/");
        } catch (error: any) {
          setError(error.message);
        } finally {
          setIsLoading(false);
        }
      };

    return (
      <div>
        <div className="flex items-center justify-center min-h-screen">
            <Card className="max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Sign In</h2>
                <form onSubmit={handleSignIn} className="flex flex-col gap-4">
                    <Input
                        isRequired
                        label="Email"
                        type="email"
                        value={email}
                        onValueChange={setEmail}
                        variant="bordered"
                        placeholder="Enter your email"
                    />

                    <Spacer y={1} />

                    <Input
                        isRequired
                        endContent={
                            <button
                                aria-label="toggle password visibility"
                                className="focus:outline-none"
                                type="button"
                                onClick={toggleVisibility}
                            >
                                {isVisible ? (
                                    <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                ) : (
                                    <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                )}
                            </button>
                        }
                        label="Password"
                        type={isVisible ? 'text' : 'password'}
                        value={password}
                        onValueChange={setPassword}
                        variant="bordered"
                        placeholder="Enter your password"
                    />

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" isLoading={isLoading} color="primary" variant="flat">
                        Sign In
                    </Button>
                </form>
            </Card>
        </div>
      </div>  
    );
}

export default SigninPage;