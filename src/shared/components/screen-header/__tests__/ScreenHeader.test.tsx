import { fireEvent, render, screen } from '@testing-library/react-native'
import { ScreenHeader } from '../ScreenHeader'

jest.mock('@expo/vector-icons', () => ({
  MaterialIcons: 'MaterialIcons',
  MaterialCommunityIcons: 'MaterialCommunityIcons'
}))

describe('ScreenHeader', () => {
  it('renders a centred title', () => {
    render(<ScreenHeader title="Your Collection" />)

    expect(screen.getByRole('header', { name: 'Your Collection' })).toBeTruthy()
  })

  it('centres title text', () => {
    render(<ScreenHeader title="Your Collection" />)

    expect(screen.getByRole('header', { name: 'Your Collection' })).toHaveStyle({
      textAlign: 'center'
    })
  })

  it('invokes onBackPress when the back control is used', () => {
    const onBackPress = jest.fn()
    
    render(
      <ScreenHeader title="Upload" onBackPress={onBackPress} />
    )

    fireEvent.press(screen.getByLabelText('Go back'))
    
    expect(onBackPress).toHaveBeenCalledTimes(1)
  })

  it('centres title in the slot when back control is shown', () => {
    render(<ScreenHeader title="Upload" onBackPress={jest.fn()} />)

    expect(screen.getByTestId('screen-header-title-slot')).toHaveStyle({
      alignItems: 'center'
    })
  })
})
