'use client';

import React, {useState, useEffect} from 'react';
import {Button, Input, Card, Spacer} from '@nextui-org/react';
import {useRouter} from 'next/navigation';
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import { useTheme } from 'next-themes';

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [name, setName] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isVisible, setIsVisible] = useState<boolean>(false);
    const [confirmPassword, setConfirmPassword] = useState<string>('');
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

    const handleSignUp = async (e: React.FormEvent) => {
        setIsLoading(true);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        e.preventDefault();
        setError(null);

        const res = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password, name}),
        });

        const data = await res.json();
        setIsLoading(false);
        if (!res.ok) {
            setError((data as {error: string}).error);
        } else {
            router.push('/signin');
        }
    };

    if (!mounted) return null;

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="max-w-md w-full p-6">
                <h2 className="text-2xl font-bold mb-4">Create an Account</h2>
                <form onSubmit={handleSignUp} className="flex flex-col gap-4">
                    <Input 
                        isRequired
                        label="Name"
                        value={name}
                        onValueChange={setName}
                        variant="bordered"
                        placeholder="Enter your name"
                    />
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
                        label="Confirm Password"
                        type={isVisible ? 'text' : 'password'}
                        value={confirmPassword}
                        onValueChange={setConfirmPassword}
                        variant="bordered"
                        placeholder="Confirm your password"
                    />

                    {/* <p className="text-center text-sm text-gray-500">or</p>

                    <Button isIconOnly className="bg-transparent p-0 flex items-center justify-center">
                    <img
                        src={theme === 'dark' ? '/gSUD.svg' : '/gSUL.svg'}
                        alt="Google Sign Up"
                        className="w-full h-full"
                    />
                    </Button> */}

                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <Button type="submit" isLoading={isLoading} color="primary" variant="flat">
                        Sign Up
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default SignupPage;
