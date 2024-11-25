// app/(tabs)/progress.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProgressStats {
    category: string;
    count: number;
    total: number;
    icon: keyof typeof Ionicons.glyphMap;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    requirement: number;
    completed: boolean;
}

export default function ProgressScreen() {
    const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
    const [progressStats, setProgressStats] = useState<ProgressStats[]>([]);
    const [achievements, setAchievements] = useState<Achievement[]>([]);
    const [overallProgress, setOverallProgress] = useState(0);

    useEffect(() => {
        loadProgress();
    }, []);

    const loadProgress = async () => {
        try {
            // Load learned vocabulary items
            const learnedItems = await AsyncStorage.getItem('learnedItems');
            const parsedLearnedItems = learnedItems ? JSON.parse(learnedItems) : [];

            // Load completed exercises
            const completedExercises = await AsyncStorage.getItem('completedExercises');
            const parsedExercises = completedExercises ? JSON.parse(completedExercises) : [];

            // Load speaking challenges
            const speakingChallenges = await AsyncStorage.getItem('speakingChallenges');
            const parsedChallenges = speakingChallenges ? JSON.parse(speakingChallenges) : [];

            // Load daily streaks
            const dailyProgress = await AsyncStorage.getItem('dailyProgress');
            const parsedDailyProgress = dailyProgress ? JSON.parse(dailyProgress) : { streak: 0 };

            // Update progress stats
            const updatedStats: ProgressStats[] = [
                {
                    category: 'Vocabulary Learned',
                    count: parsedLearnedItems.length,
                    total: 500,
                    icon: 'book-outline'
                },
                {
                    category: 'Exercises Completed',
                    count: parsedExercises.length,
                    total: 100,
                    icon: 'fitness-outline'
                },
                {
                    category: 'Speaking Challenges',
                    count: parsedChallenges.length,
                    total: 30,
                    icon: 'mic-outline'
                },
                {
                    category: 'Daily Streaks',
                    count: parsedDailyProgress.streak,
                    total: 7,
                    icon: 'flame-outline'
                }
            ];

            setProgressStats(updatedStats);

            // Calculate overall progress
            const totalProgress = updatedStats.reduce((acc, stat) =>
                acc + (stat.count / stat.total), 0) / updatedStats.length * 100;
            setOverallProgress(Math.round(totalProgress));

            // Update achievements
            const updatedAchievements = [
                {
                    id: 'vocab100',
                    title: 'Vocabulary Master',
                    description: '100 words learned',
                    requirement: 100,
                    completed: parsedLearnedItems.length >= 100
                },
                {
                    id: 'speaking10',
                    title: 'Speaking Pro',
                    description: '10 speaking challenges completed',
                    requirement: 10,
                    completed: parsedChallenges.length >= 10
                },
                {
                    id: 'streak7',
                    title: 'Perfect Week',
                    description: '7 days streak',
                    requirement: 7,
                    completed: parsedDailyProgress.streak >= 7
                },
                {
                    id: 'exercise50',
                    title: 'Exercise Expert',
                    description: '50 exercises completed',
                    requirement: 50,
                    completed: parsedExercises.length >= 50
                }
            ];

            setAchievements(updatedAchievements);

        } catch (error) {
            console.error('Error loading progress:', error);
        }
    };

    const renderProgressBar = (count: number, total: number) => {
        const percentage = Math.min((count / total) * 100, 100);
        return (
            <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${percentage}%` }]} />
            </View>
        );
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="chevron-back" size={24} color="#007AFF" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Progress</Text>
                <TouchableOpacity onPress={() => setIsInfoModalVisible(true)}>
                    <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isInfoModalVisible}
                onRequestClose={() => setIsInfoModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Progress Tracking Guide</Text>

                        <ScrollView style={styles.modalScroll}>
                            <Text style={styles.modalStep}>Overall Progress</Text>
                            <Text style={styles.modalText}>
                                Shows your total progress across all learning activities. The blue bar indicates how far you've come in your learning journey.
                            </Text>

                            <Text style={styles.modalStep}>Progress Categories</Text>
                            <Text style={styles.modalText}>
                                • Vocabulary Learned: Track the number of words you've mastered{'\n'}
                                • Exercises Completed: Monitor your practice exercise completion{'\n'}
                                • Speaking Challenges: Keep track of your speaking exercise progress{'\n'}
                                • Daily Streaks: See how many consecutive days you've practiced
                            </Text>

                            <Text style={styles.modalStep}>Achievements</Text>
                            <Text style={styles.modalText}>
                                Gold trophies indicate completed achievements. Gray trophies show achievements still to be unlocked. Keep practicing to earn them all!
                            </Text>
                        </ScrollView>

                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setIsInfoModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={styles.overallProgress}>
                <Text style={styles.sectionTitle}>Overall Progress</Text>
                {renderProgressBar(overallProgress, 100)}
                <Text style={styles.progressText}>{overallProgress}% Complete</Text>
            </View>

            <View style={styles.statsContainer}>
                {progressStats.map((stat, index) => (
                    <View key={index} style={styles.statCard}>
                        <Ionicons name={stat.icon} size={24} color="#007AFF" />
                        <Text style={styles.statTitle}>{stat.category}</Text>
                        <Text style={styles.statCount}>{stat.count}/{stat.total}</Text>
                        {renderProgressBar(stat.count, stat.total)}
                    </View>
                ))}
            </View>

            <View style={styles.achievementsSection}>
                <Text style={styles.sectionTitle}>Achievements</Text>
                {achievements.map((achievement, index) => (
                    <TouchableOpacity key={index} style={styles.achievementCard}>
                        <View style={styles.achievementIcon}>
                            <Ionicons
                                name={achievement.completed ? 'trophy' : 'trophy-outline'}
                                size={24}
                                color={achievement.completed ? '#FFD700' : '#CCCCCC'}
                            />
                        </View>
                        <View style={styles.achievementInfo}>
                            <Text style={styles.achievementTitle}>{achievement.title}</Text>
                            <Text style={styles.achievementDescription}>{achievement.description}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.bottomSpacing} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        height: 56,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    overallProgress: {
        padding: 20,
        backgroundColor: '#fff',
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#333',
    },
    progressTrack: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#007AFF',
        borderRadius: 4,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    statsContainer: {
        padding: 10,
    },
    statCard: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statTitle: {
        fontSize: 16,
        fontWeight: '500',
        marginVertical: 5,
    },
    statCount: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    achievementsSection: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: 10,
    },
    achievementCard: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    achievementIcon: {
        marginRight: 10,
    },
    achievementInfo: {
        flex: 1,
    },
    achievementTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    achievementDescription: {
        fontSize: 14,
        color: '#666',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    modalScroll: {
        maxHeight: 200,
    },
    modalStep: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
    },
    modalText: {
        fontSize: 14,
        color: '#666',
    },
    closeButton: {
        backgroundColor: '#007AFF',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    closeButtonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    bottomSpacing: {
        height: 100,
    },
});
