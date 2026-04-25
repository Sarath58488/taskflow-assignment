import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { taskAPI } from '../services/api';
import TaskCard from '../components/TaskCard';
import { EmptyState, LoadingScreen, SectionHeader } from '../components/UI';
import { COLORS, SPACING, RADIUS, FONTS } from '../utils/theme';

const FILTERS = ['All', 'Pending', 'In Progress', 'Completed'];
const STATUS_MAP = { All: '', Pending: 'pending', 'In Progress': 'in_progress', Completed: 'completed' };

const TasksScreen = ({ navigation }) => {
  const { user, isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [total, setTotal] = useState(0);

  const fetchTasks = async (searchVal = search, filter = activeFilter) => {
    try {
      const params = {
        status: STATUS_MAP[filter] || undefined,
        search: searchVal || undefined,
      };
      const res = await taskAPI.getAll(params);
      setTasks(res.data.tasks);
      setTotal(res.data.pagination.total);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchTasks();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTasks();
  };

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    fetchTasks(search, filter);
  };

  const handleSearch = (text) => {
    setSearch(text);
    fetchTasks(text, activeFilter);
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await taskAPI.update(taskId, { status: newStatus });
      setTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
      );
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  if (loading) return <LoadingScreen message="Loading tasks..." />;

  return (
    <View style={styles.container}>
      {/* Search bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={handleSearch}
          placeholder="Search tasks..."
          placeholderTextColor={COLORS.textMuted}
          returnKeyType="search"
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
            onPress={() => handleFilter(f)}
          >
            <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Task list */}
      <FlatList
        data={tasks}
        keyExtractor={(t) => t._id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={COLORS.primary}
          />
        }
        ListHeaderComponent={
          <SectionHeader
            title={isAdmin ? 'All Tasks' : 'My Tasks'}
            count={total}
            action={
              isAdmin && (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => navigation.navigate('CreateTask')}
                >
                  <Text style={styles.addBtnText}>+ New Task</Text>
                </TouchableOpacity>
              )
            }
          />
        }
        ListEmptyComponent={
          <EmptyState
            icon="📋"
            title="No Tasks Found"
            subtitle={
              search
                ? `No results for "${search}". Try a different search term.`
                : activeFilter !== 'All'
                ? `No ${activeFilter.toLowerCase()} tasks.`
                : isAdmin
                ? 'Create your first task to get started!'
                : 'No tasks have been assigned to you yet.'
            }
          />
        }
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            isAdmin={isAdmin}
            onPress={() => navigation.navigate('TaskDetail', { taskId: item._id })}
            onStatusChange={handleStatusChange}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, paddingHorizontal: SPACING.lg },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    height: 44,
  },
  searchIcon: { fontSize: 14, marginRight: SPACING.xs },
  searchInput: {
    flex: 1,
    color: COLORS.textPrimary,
    fontSize: FONTS.sizes.sm,
  },
  clearIcon: { color: COLORS.textMuted, fontSize: 14, paddingLeft: SPACING.sm },
  filterRow: {
    flexDirection: 'row',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
    flexWrap: 'wrap',
  },
  filterTab: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.bgCard,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  filterTabActive: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  filterTabText: { color: COLORS.textSecondary, fontSize: FONTS.sizes.xs, fontWeight: '600' },
  filterTabTextActive: { color: '#fff' },
  list: { paddingBottom: SPACING.xxxl },
  addBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
  },
  addBtnText: { color: '#fff', fontSize: FONTS.sizes.sm, fontWeight: '700' },
});

export default TasksScreen;
