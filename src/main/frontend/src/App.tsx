import React from 'react';
import styled from 'styled-components';
import { Home } from './app/containers/HomePage';

const AppContiner = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  return (
    <AppContiner>
      <Home />
    </AppContiner>
  );
}

export default App;
