import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { theme } from '../../styles';
import appUsageService from '../../services/AppUsageService';

const UsageDisplay = ({ period = 'weekly' }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchUsageData();
  }, [period]);

  const fetchUsageData = async () => {
    try {
      const usageStats = await appUsageService.getUsageStats(7);
      setStats(usageStats);
    } catch (error) {
      console.error('Error fetching usage data:', error);
    }
  };

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading Usage Data...</Text>
      </View>
    );
  }

  const data = {
    labels: stats.map(day => day.date),
    datasets: [
      {
        data: stats.map(day => Math.round(day.totalTime / 60)),
        color: () => theme.colors.primary, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ['Usage in Minutes'],
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Usage Statistics ({period})</Text>
      <LineChart
        data={data}
        width={Dimensions.get('window').width * 0.9} // from react-native
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
};

const chartConfig = {
  backgroundGradientFrom: theme.colors.background,
  backgroundGradientTo: theme.colors.background,
  color: (opacity = 1) => `${theme.colors.primary}66`,
  labelColor: (opacity = 1) => theme.colors.text.primary,
  style: {
    borderRadius: 16,
  },
  propsForDots: {
    r: '6',
    strokeWidth: '2',
    stroke: theme.colors.primary,
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: theme.spacing.md,
    backgroundColor: theme.colors.cardBackground,
    borderRadius: theme.layout.borderRadius.large,
    margin: theme.spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  loadingText: {
    textAlign: 'center',
    color: theme.colors.text.secondary,
  },
});

export default UsageDisplay;

