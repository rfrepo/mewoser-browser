import { render, screen } from '@testing-library/react-native'
import { CustomTabBar } from '../CustomTabBar'

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons'
}))

jest.mock('expo-blur', () => ({
  BlurView: 'BlurView'
}))

const navigation = {
  navigate: jest.fn(),
  emit: jest.fn()
} as any

const buildProps = () =>
  ({
    state: {
      index: 0,
      key: 'tab-state',
      routeNames: ['index', 'upload'],
      history: [],
      type: 'tab',
      stale: false,
      routes: [
        { key: 'index-key', name: 'index' },
        { key: 'upload-key', name: 'upload' }
      ]
    },
    descriptors: {
      'index-key': {
        options: {
          title: 'Home',
          tabBarLabel: 'Home'
        }
      },
      'upload-key': {
        options: {
          title: 'Upload',
          tabBarLabel: 'Upload'
        }
      }
    },
    insets: { top: 0, right: 0, bottom: 0, left: 0 },
    navigation
  }) as any

describe('CustomTabBar', () => {
  it('renders tabs with horizontal icon and label alignment', () => {
    render(<CustomTabBar {...buildProps()} />)

    const homeTab = screen.getByRole('tab', { name: 'Home tab' })
    expect(homeTab).toHaveStyle({ flexDirection: 'row' })
  })
})
