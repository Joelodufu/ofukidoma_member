import { PuffLoader } from 'react-spinners'
function Loading({ isLoggin, color, style }) {
  return (
    <div style={style} className='spinnner'>
      <PuffLoader
        color={color}
        loading={isLoggin}
        size={150}
        aria-label='Loading Spinner'
        data-testid='loader'
      />
    </div>
  )
}

export default Loading
