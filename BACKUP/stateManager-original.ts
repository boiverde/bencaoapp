// State manager simples SEM localStorage 
const globalState = {}; 
export function useGlobalState(key, initialState) { 
  const [state, setState] = React.useState(initialState); 
  return [state, setState]; 
} 
