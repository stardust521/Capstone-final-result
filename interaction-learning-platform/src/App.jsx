import React, { Suspense } from 'react'
import { Spin } from 'antd'
import Routes from './routes'

const App = () => {
  return (
    <Suspense
      fallback={<Spin size="large" style={{ width: '100%', height: '100%' }} />}
    >
      <Routes />
    </Suspense>
  )
}

export default App
