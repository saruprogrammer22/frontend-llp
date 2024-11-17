// SignUp.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Input from '../components/Input';
import Button from '../components/Button';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [middleName, setMiddleName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const handleSignUp = () => {
        router.replace('/SignIn');
    };

    return (
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.iconContainer}>
                    <Ionicons name="person-add-outline" size={80} color="#4CAF50" />
                </View>

                <View style={styles.formContainer}>
                    <Text style={styles.title}>Join Tongue Tide</Text>
                    <Text style={styles.subtitle}>Start Your Language Learning Journey</Text>

                    <View style={styles.inputGroup}>
                        <Input
                            placeholder="First Name"
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                            style={styles.input}
                        />
                        <Input
                            placeholder="Middle Name"
                            value={middleName}
                            onChangeText={setMiddleName}
                            autoCapitalize="words"
                            style={styles.input}
                        />
                        <Input placeholder="Last Name" value={lastName} onChangeText={setLastName} autoCapitalize="words" style={styles.input} />
                        <Input placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" style={styles.input} />
                        <Input placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
                    </View>

                    <TouchableOpacity
                        style={styles.signInButton}
                        onPress={handleSignUp}
                    >
                        <Text style={styles.signInButtonText}>Create Account</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                    <Text style={styles.switchText}>
                        Already have an account?{' '}
                        <Text style={styles.linkText} onPress={() => router.push('/SignIn')}>
                            Sign In
                        </Text>
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    iconContainer: {
        backgroundColor: '#e8f5e9',
        padding: 25,
        borderRadius: 60,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 6,
    },
    formContainer: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4CAF50',
        marginBottom: 10,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputGroup: {
        width: '100%',
        gap: 16,
        marginBottom: 24,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 12,
        padding: 15,
        fontSize: 16,
    },
    signInButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 50,
        borderRadius: 30,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 4,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    footer: {
        marginTop: 32,
        alignItems: 'center',
    },
    switchText: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    linkText: {
        color: '#4CAF50',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;