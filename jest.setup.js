import 'react-native-gesture-handler/jestSetup';

// Mock expo-notifications
jest.mock('expo-notifications', () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  requestPermissionsAsync: jest.fn(() => Promise.resolve({ status: 'granted' })),
  getExpoPushTokenAsync: jest.fn(() => Promise.resolve({ data: 'mock-token' })),
  addNotificationReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  addNotificationResponseReceivedListener: jest.fn(() => ({ remove: jest.fn() })),
  scheduleNotificationAsync: jest.fn(),
  AndroidImportance: {
    MAX: 5,
  },
  setNotificationChannelAsync: jest.fn(),
}));

// Mock expo-device
jest.mock('expo-device', () => ({
  isDevice: true,
  brand: 'mock-brand',
  manufacturer: 'mock-manufacturer',
  modelName: 'mock-model',
  modelId: 'mock-model-id',
  designName: 'mock-design-name',
  productName: 'mock-product-name',
  deviceYearClass: 2023,
  totalMemory: 8000000000,
  osName: 'mock-os',
  osVersion: '16.0',
  osBuildId: 'mock-build-id',
  osInternalBuildId: 'mock-internal-build-id',
  osBuildFingerprint: 'mock-fingerprint',
  platformApiLevel: 33,
  deviceName: 'mock-device-name',
}));

// Mock expo-linear-gradient
jest.mock('expo-linear-gradient', () => ({
  LinearGradient: 'LinearGradient',
}));

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: () => ({
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: jest.fn(() => ({})),
  Link: 'Link',
  Stack: {
    Screen: 'Stack.Screen',
  },
  Tabs: {
    Screen: 'Tabs.Screen',
  },
}));

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock safe area context
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  SafeAreaView: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
}));

// Mock the Lucide icons
jest.mock('lucide-react-native', () => {
  const icons = {};
  const iconNames = [
    'Heart', 'MessageSquare', 'Calendar', 'User', 'Search', 
    'Users', 'Bell', 'Phone', 'Video', 'HandHelping', 'Smile',
    'Plus', 'Mic', 'Camera', 'MapPin', 'Languages', 'X', 'Book',
    'Clock', 'Check', 'ChevronRight', 'Shield', 'Star', 'Trophy',
    'Target', 'Zap', 'ChartBar', 'Lightbulb', 'Globe', 'Church',
    'Settings', 'LogOut', 'CreditCard', 'Award', 'TriangleAlert',
    'TrendingUp', 'CircleCheck', 'Circle', 'Info', 'Filter',
    'RefreshCw', 'Trash2', 'Share2', 'Edit3', 'MoveVertical',
    'MoveHorizontal', 'Copy', 'Play', 'Pause', 'Square', 'Brain',
    'Mail', 'Smartphone', 'Fingerprint', 'Eye', 'EyeOff', 'Lock',
    'Upload', 'Download', 'FileSliders', 'Tag', 'Sparkles'
  ];
  
  iconNames.forEach(name => {
    icons[name] = ({ size, color }) => ({
      type: 'Icon',
      name,
      props: { size, color }
    });
  });
  
  return icons;
});

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(() => Promise.resolve()),
  getItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
  clear: jest.fn(() => Promise.resolve()),
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'web',
  select: jest.fn(obj => obj.web || obj.default),
}));

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn(() => ({ width: 375, height: 812 })),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Global mocks
global.fetch = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
    headers: {
      get: jest.fn(),
      map: jest.fn(),
    },
  })
);

// Console error/warn mocks
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.error = (...args) => {
  // Suppress specific React Native warnings for tests
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Warning:') || 
     args[0].includes('React does not recognize the'))
  ) {
    return;
  }
  originalConsoleError(...args);
};

console.warn = (...args) => {
  // Suppress specific React Native warnings for tests
  if (
    typeof args[0] === 'string' && 
    (args[0].includes('Warning:') || 
     args[0].includes('componentWillReceiveProps') ||
     args[0].includes('componentWillMount'))
  ) {
    return;
  }
  originalConsoleWarn(...args);
};